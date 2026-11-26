import { createContext, useContext, useEffect, useState } from 'react';
import { CATEGORIES } from '../data/categories';
import {
  EXPENSES_STORAGE_KEY,
  loadFromStorage,
  saveToStorage,
} from '../utils/storage';

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  // localStorage es síncrono: hidratamos directamente en el estado inicial.
  const [expenses, setExpenses] = useState(() =>
    loadFromStorage(EXPENSES_STORAGE_KEY, [], Array.isArray)
  );
  const [isLoaded] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    saveToStorage(EXPENSES_STORAGE_KEY, expenses);
  }, [expenses, isLoaded]);

  const addExpense = (data) => {
    const title = String(data?.title ?? data?.name ?? data?.nombre ?? '').trim();
    const amount = Number(data?.amount);
    if (!title || Number.isNaN(amount) || amount <= 0) {
      return null;
    }

    const newExpense = {
      id: data?.id != null ? String(data.id) : Date.now().toString(),
      title,
      amount,
      category: data?.category ?? data?.categoria ?? CATEGORIES[0],
      notes: String(data?.notes ?? '').trim(),
      createdAt: data?.createdAt ?? data?.date ?? new Date().toISOString(),
    };

    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const removeExpense = (id) => {
    const targetId = String(id);
    setExpenses((prev) => prev.filter((item) => String(item.id) !== targetId));
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
