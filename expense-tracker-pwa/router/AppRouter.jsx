import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import HomeScreen from '../pages/HomeScreen';
import ExpensesScreen from '../pages/ExpensesScreen';
import ExpenseDetailScreen from '../pages/ExpenseDetailScreen';
import SettingsScreen from '../pages/SettingsScreen';
import NewExpenseScreen from '../pages/NewExpenseScreen';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* todas las pantallas comparten el layout con la barra inferior */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/new" element={<NewExpenseScreen />} />
          <Route path="/expenses" element={<ExpensesScreen />} />
          <Route path="/expenses/:id" element={<ExpenseDetailScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Route>
        {/* ruta desconocida: vuelve al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}