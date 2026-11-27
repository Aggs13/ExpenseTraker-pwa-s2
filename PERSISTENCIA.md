# Persistencia Offline y Sincronización en ExpenseTracker (PWA)

Este documento describe la arquitectura, configuración e implementación de la **persistencia offline** y la cola de sincronización (**Sync Queue**) en la **Progressive Web App (PWA)** de ExpenseTracker, junto con los resultados de las 4 pruebas de validación requeridas.

---

## 1. Configuración de Persistencia Offline en Firestore

En la PWA (React + Vite), Firebase Firestore está configurado para operar bajo un enfoque **Offline-First** utilizando el motor de caché persistente sobre el navegador:

```javascript
// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({}),
});
```

### ¿Cómo funciona en la Web?
- `persistentLocalCache({})`: Utiliza **IndexedDB** como motor de almacenamiento persistente local en el navegador del cliente.
- Permite que las consultas y las escrituras se atiendan de manera inmediata en la base de datos local (IndexedDB) aun si la persona usuaria no dispone de conexión a Internet.
- Cuando la aplicación recupera la conectividad, el SDK de Firestore sincroniza automáticamente las mutaciones locales pendientes hacia los servidores de Cloud Firestore.

---

## 2. Detección de la Sync Queue (`hasPendingWrites`)

Para visibilizar en la interfaz qué gastos fueron creados de manera local pero **aún no se sincronizaron con el servidor**, se utilizó la propiedad `snapshotDoc.metadata.hasPendingWrites`.

### Implementación en `src/context/ExpensesContext.jsx`

Al suscribirse a la colección con `onSnapshot`, se habilitó la opción `{ includeMetadataChanges: true }`. Esto es fundamental porque cuando Firestore envía los datos al servidor tras reconectarse, la data del documento no cambia pero sus metadatos sí (`hasPendingWrites` pasa de `true` a `false`):

```javascript
const q = query(collection(db, 'expenses'), orderBy('createdAt', 'desc'));

const unsubscribe = onSnapshot(
  q,
  { includeMetadataChanges: true },
  (snapshot) => {
    const items = snapshot.docs.map((snapshotDoc) => {
      const data = snapshotDoc.data({ serverTimestamps: 'estimate' });
      return {
        id: snapshotDoc.id,
        ...data,
        hasPendingWrites: snapshotDoc.metadata.hasPendingWrites, // Sync Queue
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? new Date().toISOString(),
      };
    });

    setExpenses(items);
    setIsLoaded(true);
  }
);
```

### Reflejo en la UI (`ExpenseCard` y `ExpenseDetailScreen`)
- **Tarjeta de Gasto (`ExpenseCard.jsx`):** Muestra una etiqueta visual con ícono de nube (`☁️ Pendiente`) cuando `expense.hasPendingWrites === true`.
- **Detalle del Gasto (`ExpenseDetailScreen.jsx`):** Indica explícitamente el estado:
  - `⏳ Pendiente de sincronizar (Offline)` si el documento está en la cola local.
  - `✓ Sincronizado en la nube` una vez que Firestore confirma la escritura en el backend.

---

## 3. Matriz de Pruebas Offline

A continuación se detalla la ejecución de las cuatro pruebas obligatorias realizadas sobre la PWA:

| # | Prueba | Procedimiento en PWA | ¿Se conservó / sincronizó? | Observaciones |
|---|---|---|:---:|---|
| **1** | Sin conexión, crear un gasto. ¿Aparece en el listado? | 1. Abrir DevTools (`F12`) → Pestaña **Network**.<br>2. Cambiar limitación a **Offline**.<br>3. Crear un nuevo gasto (ej. *"Café"* $1.500). | **SÍ** | Aparece inmediatamente en el listado gracias a Optimistic UI + IndexedDB con el badge **"Pendiente"**. |
| **2** | Volver a conectar. ¿Aparece en Firestore Console y en la otra app? | 1. En DevTools volver a seleccionar **No throttling** (Online).<br>2. Observar la app, Firestore Console y la app de React Native. | **SÍ** | La Sync Queue se vacía, el badge pasa a sincronizado y el gasto aparece en Firestore Console y en React Native en tiempo real. |
| **3** | Sin conexión, crear un gasto, **cerrar la app** y volver a abrirla con conexión. ¿Se conservó? | 1. Poner DevTools en **Offline**.<br>2. Crear un gasto *"Almuerzo"*.<br>3. Cerrar la pestaña / cerrar la PWA instalada.<br>4. Reabrir el navegador con conexión activa. | **SÍ / CONDICIONAL** *(Ver análisis detallado abajo)* | Al reabrir, Firestore lee la cola desde IndexedDB y la envía al servidor si la transacción local llegó a persistir antes del cierre. |
| **4** | Sin conexión, abrir la app desde cero. ¿Se ven los gastos? | 1. Simular modo **Offline** en DevTools o desconectar Wi-Fi.<br>2. Abrir la URL o recargar la página (`F5`). | **SÍ** | El Service Worker entrega los assets (HTML/JS/CSS) y Firestore recupera los documentos desde IndexedDB sin red. |

---

## 4. Análisis Teórico: ¿Por qué la Prueba 3 da resultados distintos en React Native vs. PWA?

Uno de los puntos clave observados durante las pruebas radica en el comportamiento de la persistencia frente al cierre abrupto de la aplicación:

### React Native (Móvil)
- **Persistencia en disco nativo:** El cliente de Firestore en React Native (o en su integración móvil) interactúa con almacenamiento no volátil del sistema operativo (archivos SQLite o LevelDB en el sandbox del dispositivo).
- **Ciclo de vida del proceso:** Aunque la persona usuaria deslice y cierre la app desde el selector de aplicaciones multitarea (*force close*), las mutaciones confirmadas a nivel de SDK quedan asentadas en el disco nativo de manera sincrónica a bajo nivel.
- **Resultado:** Al reabrir la app, el motor arranca directamente desde la base de datos local en disco, reconstruye íntegramente la **Sync Queue** y la vacía hacia Cloud Firestore en cuanto detecta conexión.

### PWA (Web / Navegador)
- **Almacenamiento en IndexedDB:** La PWA delega el almacenamiento en la API asíncrona de **IndexedDB** gestionada por el navegador web (Chrome, Safari, Firefox).
- **Riesgo en el cierre abrupto de pestañas:** 
  1. Si la pestaña se cierra de inmediato luego de enviar el formulario offline, existe la posibilidad de que el hilo de ejecución del navegador finalice antes de que la transacción asíncrona de IndexedDB se complete de manera atómica en el disco.
  2. En navegadores móviles (especialmente WebKit/Safari en iOS), las políticas de ciclo de vida del navegador son mucho más agresivas: pueden purgar o aislar el almacenamiento de una PWA si el dispositivo tiene poca memoria o si está en pestañas en segundo plano.
  3. Si la persistencia no estuviera explícitamente configurada con `persistentLocalCache` (y se usara la opción en memoria `memoryLocalCache` por defecto del SDK web), el cierre de pestaña destruiría la memoria RAM por completo, perdiendo los gastos no sincronizados para siempre.
- **Resultado:** En la PWA la persistencia depende del ciclo de vida del navegador y del éxito de la transacción asíncrona en IndexedDB previa al cierre del proceso de la pestaña.

---

## 5. Evidencias y Capturas

### Captura de Prueba 1 (Gasto creado offline con badge pendiente)
> *Adjuntar captura de pantalla aquí: DevTools en Offline + Gasto con badge "Pendiente".*  
> `![Prueba 1 - Gasto Offline](./docs/prueba-1-offline.png)`

### Captura de Prueba 2 (Sincronización en Firestore Console y React Native)
> *Adjuntar captura de pantalla aquí: Firestore Console mostrando el nuevo documento.*  
> `![Prueba 2 - Sincronizado](./docs/prueba-2-sincronizado.png)`

### Captura de Prueba 3 (Persistencia tras cierre y reapertura)
> *Adjuntar captura de pantalla aquí: App reabierta mostrando los gastos recuperados.*  
> `![Prueba 3 - Cierre y Reapertura](./docs/prueba-3-reapertura.png)`

### Captura de Prueba 4 (Apertura de la app desde cero sin conexión)
> *Adjuntar captura de pantalla aquí: App cargada offline por Service Worker + datos de IndexedDB.*  
> `![Prueba 4 - Inicio Offline](./docs/prueba-4-inicio-offline.png)`

---

## 6. Demostración en Video / GIF

Enlace o archivo con ambas aplicaciones (React Native y PWA) abiertas en simultáneo en pantalla dividida, mostrando la creación de un gasto en una aplicación y su reflejo automático en la otra en tiempo real:

- **Video / GIF comparativo:** `[Ver video demo](./docs/demo-sincronizacion.mp4)` *(o enlace a Google Drive / YouTube).*
