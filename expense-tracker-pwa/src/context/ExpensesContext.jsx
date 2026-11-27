import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { CATEGORIES } from '../data/categories';
import { auth, db } from '../services/firebase';

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [user, setUser] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        signInAnonymously(auth).catch((error) => {
          console.error('Error al iniciar sesión anónima:', error);
          setIsLoaded(true);
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return undefined;

    const q = query(
      collection(db, 'users', user.uid, 'expenses'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        const items = snapshot.docs.map((snapshotDoc) => {
          const data = snapshotDoc.data({ serverTimestamps: 'estimate' });
          return {
            id: snapshotDoc.id,
            ...data,
            hasPendingWrites: snapshotDoc.metadata.hasPendingWrites,
            createdAt: data.createdAt?.toDate
              ? data.createdAt.toDate().toISOString()
              : data.createdAt ?? new Date().toISOString(),
          };
        });

        setExpenses(items);
        setIsLoaded(true);
      },
      (error) => {
        console.error('Error al escuchar gastos en Firestore:', error);
        setIsLoaded(true);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const addExpense = (data) => {
    if (!user) return null;
    const title = String(data?.title ?? data?.name ?? data?.nombre ?? '').trim();
    const amount = Number(data?.amount);
    if (!title || Number.isNaN(amount) || amount <= 0) {
      return null;
    }

    const newExpense = {
      title,
      amount,
      category: data?.category ?? data?.categoria ?? CATEGORIES[0],
      notes: String(data?.notes ?? '').trim(),
      createdAt: serverTimestamp(),
    };

    // No bloqueamos el formulario esperando al servidor (Optimistic UI en offline).
    addDoc(collection(db, 'users', user.uid, 'expenses'), newExpense).catch(
      (error) => {
        console.error('Error al guardar el gasto en Firestore:', error);
      }
    );

    return newExpense;
  };

  const updateExpense = (id, data) => {
    if (!user || !id) return null;
    const title = String(data?.title ?? data?.name ?? data?.nombre ?? '').trim();
    const amount = Number(data?.amount);
    if (!title || Number.isNaN(amount) || amount <= 0) {
      return null;
    }

    const updatedFields = {
      title,
      amount,
      category: data?.category ?? data?.categoria ?? CATEGORIES[0],
      notes: String(data?.notes ?? '').trim(),
    };

    updateDoc(
      doc(db, 'users', user.uid, 'expenses', String(id)),
      updatedFields
    ).catch((error) => {
      console.error('Error al actualizar el gasto en Firestore:', error);
    });

    return updatedFields;
  };

  const removeExpense = (id) => {
    if (!user || !id) return;
    deleteDoc(doc(db, 'users', user.uid, 'expenses', String(id))).catch(
      (error) => {
        console.error('Error al eliminar el gasto en Firestore:', error);
      }
    );
  };

  return (
    <ExpensesContext.Provider
      value={{
        user,
        expenses,
        isLoaded,
        addExpense,
        updateExpense,
        removeExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses debe usarse dentro de un ExpensesProvider');
  }
  return context;
}

export default ExpensesContext;
