import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

import HomeScreen from '../pages/HomeScreen';
import ExpensesScreen from '../pages/ExpensesScreen';
import ExpenseDetailScreen from '../pages/ExpenseDetailScreen';
import SettingsScreen from '../pages/SettingsScreen';
import NewExpenseScreen from '../pages/NewExpenseScreen';
import '../src/screenTransitions.css';

function AppRoutes() {
  const location = useLocation();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Saltar al contenido principal
      </a>

      <div className="screen-transition" key={location.pathname}>
        <Routes location={location}>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/new" element={<NewExpenseScreen />} />
          <Route path="/expenses" element={<ExpensesScreen />} />
          <Route path="/expenses/:id" element={<ExpenseDetailScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
        </Routes>
      </div>
    </>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
