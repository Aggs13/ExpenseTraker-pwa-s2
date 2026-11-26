import { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoChevronForward, IoReceiptOutline, IoWalletOutline } from 'react-icons/io5';
import { useExpenses } from '../src/context/ExpensesContext';
import NewExpenseModal from '../src/components/NewExpenseModal';
import './HomeScreen.css';

export default function HomeScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { expenses } = useExpenses();

  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const count = expenses.length;

  return (
    <div className="welcome">
      <header className="welcome__header">
        <h1>ExpenseTracker</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="welcome__main">
        <section className="welcome__intro">
          <p className="welcome__title">¡Bienvenido a ExpenseTracker!</p>
          <p className="welcome__description">
            Esta aplicación te permite registrar y llevar el control de tus gastos
            personales de forma sencilla.
          </p>
        </section>

        <section className="welcome__summary" aria-label="Resumen de gastos">
          <div className="summary-card">
            <span className="summary-card__icon summary-card__icon--total" aria-hidden="true">
              <IoWalletOutline />
            </span>
            <p className="summary-card__label">Total registrado</p>
            <p className="summary-card__value">${total.toLocaleString('es-AR')}</p>
          </div>
          <div className="summary-card">
            <span className="summary-card__icon summary-card__icon--count" aria-hidden="true">
              <IoReceiptOutline />
            </span>
            <p className="summary-card__label">Movimientos</p>
            <p className="summary-card__value">{count}</p>
          </div>
        </section>

        {count === 0 && (
          <p className="welcome__empty" role="status">
            Todavía no registraste gastos
          </p>
        )}

        <section className="welcome__actions" aria-label="Accesos rápidos">
          <button
            type="button"
            className="welcome__button welcome__button--primary"
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Nuevo Gasto
          </button>
          <Link to="/expenses" className="welcome__button welcome__button--secondary">
            Ver Listado Completo
            <IoChevronForward aria-hidden="true" />
          </Link>
        </section>
      </main>

      <NewExpenseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
