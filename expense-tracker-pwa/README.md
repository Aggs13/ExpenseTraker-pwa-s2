# ExpenseTracker PWA

Aplicación React + Vite para registrar y controlar gastos personales. Funciona como
PWA instalable y está pensada para usarse desde el celular.

## Scripts

```bash
npm install
npm run dev      # servidor de desarrollo
npm run lint     # oxlint
npm run build    # build de producción
npm run preview  # sirve el build de producción
```

## Estructura principal

- `pages/`: pantallas de la aplicación.
- `src/components/`: componentes reutilizables (tarjetas, badges, íconos y modal).
- `data/mockExpenses.js`: gastos de ejemplo que se muestran en la app (3 registros).
- `public/`: manifest, íconos, `robots.txt` y service worker.
- `router/AppRouter.jsx`: rutas y transición entre pantallas.

---

# Bonus 2 — User Story #9 (`#pwa-s2-us9`)

## 1. Íconos equivalentes a Expo Vector Icons

Se incorporó `react-icons` y se usan íconos de **Ionicons** (`react-icons/io5`), el
equivalente web más cercano a los íconos de Expo:

| Categoría | Ícono |
| --- | --- |
| Comida | `IoFastFoodOutline` |
| Transporte | `IoCarOutline` |
| Servicios | `IoFlashOutline` |
| Ocio | `IoGameControllerOutline` |
| Salud | `IoMedkitOutline` |
| Otros | `IoPricetagOutline` |

Los íconos se muestran en el listado (círculo de color por categoría), en el badge del
detalle y en el resumen de la pantalla de inicio. Son decorativos, por lo que llevan
`aria-hidden="true"` para no duplicar información con el texto.

## 2. Colores por categoría y total del listado

Cada categoría tiene una variante de color compartida entre badge, ícono y borde de la
tarjeta. Los colores se definen con variables CSS en `src/components/ExpenseCard.css` y
`src/components/CategoryBadge.css`.

Al final del listado se muestra una tarjeta con el **total de gastos**, calculado con
`reduce()` y formateado con `formatCurrency()` (mismo formato que el Sprint 1).

## 3. Transiciones suaves entre pantallas

`router/AppRouter.jsx` envuelve las rutas en un contenedor con `key={location.pathname}`.
Cada cambio de ruta monta el contenedor y dispara una animación CSS de entrada
(`screen-enter`): un desplazamiento vertical suave de 10 px.

La animación se desactiva con `@media (prefers-reduced-motion: reduce)` para respetar la
preferencia de accesibilidad del sistema.

> Nota: la animación usa sólo `transform` (no arranca en `opacity: 0`) para que el
> contenido esté disponible de inmediato y no retrase el First Contentful Paint de
> Lighthouse.

## 4. `touch-action: manipulation`

Se aplica globalmente a enlaces, botones, inputs, selects, textareas y elementos con
`role="button"` en `src/global.css`. También se mantiene en los componentes que ya lo
tenían (botones del modal, chips, etc.).

**Efecto esperado en el teléfono:**

- Elimina el retraso de ~300 ms que algunos navegadores móviles agregan para detectar el
  doble toque.
- Evita el zoom por doble toque sobre controles, manteniendo habilitado el zoom con
  pinch (a diferencia de `user-scalable=no`, que sí es un problema de accesibilidad).
- Hace que los toques en tarjetas, chips y botones se sientan más inmediatos.
- No bloquea el scroll ni los gestos de arrastre.

Verificación realizada en el entorno de desarrollo:

```js
getComputedStyle(document.querySelector('a, button, input')).touchAction
// "manipulation"
```

Para la comprobación física se recomienda abrir la app en Chrome Android y Safari iOS,
activar la opción de mostrar toques del sistema y comparar la respuesta de los botones
con y sin la regla.

## 5. Mejora de Lighthouse

Se trabajó sobre las tres categorías pedidas: **Performance**, **Accessibility** y
**Best Practices**.

Cambios aplicados:

- `lang="es"`, `meta description`, título descriptivo y `robots.txt`.
- Landmark `main` con `id="main-content"` y enlace “Saltar al contenido principal”.
- Foco visible global y estilos `:focus-visible` en controles.
- Contraste de textos secundarios ajustado a AA (`#4b5563` sobre fondos claros).
- Íconos decorativos con `aria-hidden="true"`.
- Animaciones respetando `prefers-reduced-motion`.
- Eliminación de `console.log` en producción.
- Service worker con cache del app shell para visitas repetidas y uso offline.

Resultado medido con **Lighthouse 12.8.2**, Chrome 131 headless, sobre
`npm run preview` (emulación mobile):

| Pantalla | Performance | Accessibility | Best Practices | SEO |
| --- | ---: | ---: | ---: | ---: |
| Inicio (`/`) | 99 | 100 | 100 | 100 |
| Listado (`/expenses`) | 99 | 100 | 100 | 100 |
| Detalle (`/expenses/1`) | 99 | 100 | 100 | 100 |

Los puntajes pueden variar según dispositivo, red y versión de Chrome. Para reproducir:

```bash
npm run build
npm run preview
npx lighthouse http://localhost:4173/expenses --view
```

## 6. Capacidades web en Android e iPhone

Se relevó la matriz de [What Web Can Do Today](https://whatwebcando.today/) (hoy
redirige a Progressier) y la compatibilidad de Safari/iOS. La siguiente tabla resume las
capacidades que **podrían usarse en ExpenseTracker** en cada plataforma:

| Capacidad | Android (Chrome/Edge) | iPhone (Safari/iOS) | Uso potencial en ExpenseTracker |
| --- | --- | --- | --- |
| Instalación en pantalla de inicio | ✅ `beforeinstallprompt` + manifest | ✅ manual: Compartir → Agregar a pantalla de inicio | Acceso directo sin tienda |
| Modo standalone | ✅ | ✅ | Experiencia tipo app nativa |
| Service Worker / offline | ✅ | ✅ desde iOS 11.3 | Cachear listado y formulario |
| Web Push | ✅ | ⚠️ iOS 16.4+, sólo PWA instalada | Recordatorios de gastos |
| Background Sync | ✅ | ❌ | Reintentar guardado sin conexión |
| LocalStorage / IndexedDB | ✅ | ✅ | Persistir gastos localmente |
| Web Share | ✅ | ✅ | Compartir resumen de gastos |
| Cámara / `getUserMedia` | ✅ | ✅ Safari 13+ | Adjuntar foto de un ticket |
| Geolocalización | ✅ con permiso | ✅ con permiso | Etiquetar gasto por lugar |
| Vibration API | ✅ | ❌ | Feedback háptico al guardar |
| Web Bluetooth / NFC / USB | ✅ en Chrome Android | ❌ | Integraciones avanzadas |
| Payment Request | ✅ | ⚠️ parcial (Apple Pay web) | Pagos o suscripciones |
| File System Access | ⚠️ parcial / OPFS | ❌ | Exportar/importar CSV |
| Screen Wake Lock | ✅ | ✅ desde iOS 16.4 | No apagar la pantalla al cargar |
| App Badge | ✅ | ⚠️ según versión | Badge de gastos pendientes |
| Shortcuts del manifest | ✅ | ❌ | Accesos a “Nuevo gasto” |
| View Transitions API | ✅ | ⚠️ según versión | Transiciones nativas |
| Passkeys / biometría | ✅ | ✅ | Desbloqueo de la app |
| Touch gestures | ✅ | ✅ | Swipe para borrar/editar |
| Network Information / Battery | ✅ | ⚠️ parcial | Ajustar la experiencia según red/batería |

**Conclusión para ExpenseTracker:** Android ofrece hoy el paquete más completo para una
PWA de gastos (instalación con prompt, offline, push, cámara, share, vibración y
shortcuts). En iPhone la app sigue siendo perfectamente instalable y usable, pero
conviene diseñar las funciones avanzadas como _progressive enhancement_: guardar
localmente, funcionar offline y usar Web Share; dejar push, background sync, Bluetooth,
NFC y shortcuts como mejoras opcionales o exclusivas de Android.

> La verificación se documentó a partir de la matriz de capacidades de What Web Can Do
> Today y de las tablas de compatibilidad de Safari/iOS. Para completar la prueba en
> dispositivos reales, abrir la app y `whatwebcando.today` desde Chrome Android y desde
> Safari en iPhone; los resultados pueden variar según versión de sistema y navegador.

---

## PWA y service worker

- `public/manifest.json`: nombre, colores, íconos, `lang`, categorías y shortcuts.
- `public/sw.js`: cachea el app shell, sirve navegación con estrategia _network-first_ y
  assets con _cache-first_.
- `src/main.jsx`: registra el service worker sólo en producción.
- `hooks/usePWAInstall.js`: maneja `beforeinstallprompt` en Android y la detección de
  iOS para el instructivo manual.

## Accesibilidad

- Auditoría automática con `axe-core` (reglas WCAG 2.0/2.1 A y AA) sin violaciones en
  `/`, `/expenses`, `/expenses/1` y `/new`.
- Foco visible, skip link, landmarks, textos alternativos/`aria-hidden` y contraste AA.
- Soporte de `prefers-reduced-motion`.
