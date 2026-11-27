import { createContext, useContext, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { CATEGORIES } from '../data/categories';
import { db } from '../services/firebase';

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
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
  }, []);

  const addExpense = (data) => {
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
    addDoc(collection(db, 'expenses'), newExpense).catch((error) => {
      console.error('Error al guardar el gasto en Firestore:', error);
    });

    return newExpense;
  };

  const removeExpense = (id) => {
    deleteDoc(doc(db, 'expenses', String(id))).catch((error) => {
      console.error('Error al eliminar el gasto en Firestore:', error);
    });
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        isLoaded,
        addExpense,
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
