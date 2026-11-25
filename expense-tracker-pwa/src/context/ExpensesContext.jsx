import { createContext, useContext, useState } from 'react';
import { CATEGORIES } from '../data/categories';

const INITIAL_EXPENSES = [
  {
    id: '1',
    title: 'Supermercado',
    amount: 25000,
    category: 'Comida',
    notes: 'Compra semanal: verduras, lácteos y productos de limpieza.',
    createdAt: '2026-10-25T12:00:00.000Z',
  },
  {
    id: '2',
    title: 'Combustible',
    amount: 18000,
    category: 'Transporte',
    notes: 'Carga completa de nafta para el auto.',
    createdAt: '2026-10-27T12:00:00.000Z',
  },
  {
    id: '3',
    title: 'Internet',
    amount: 32000,
    category: 'Servicios',
    notes: 'Abono mensual de fibra óptica 300 Mbps.',
    createdAt: '2026-10-29T12:00:00.000Z',
  },
];

const ExpensesContext = createContext(null);

export function ExpensesProvider({ children }) {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [isLoaded] = useState(true);

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
