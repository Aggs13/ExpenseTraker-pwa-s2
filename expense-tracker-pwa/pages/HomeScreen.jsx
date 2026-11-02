import { Link } from 'react-router-dom';
import { mockExpenses } from '../data/mockExpenses';
import './HomeScreen.css';

export default function HomeScreen() {
  const total = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const count = mockExpenses.length;

  return (
    <div className="welcome">
      <header className="welcome__header">
        <h1>ExpenseTracker</h1>
      </header>

      <main className="welcome__main">
        <section className="welcome__intro">
          <p className="welcome__title">¡Bienvenido a ExpenseTracker!</p>
          <p className="welcome__description">
            Esta aplicación te permite registrar y llevar el control de tus gastos
            personales de forma sencilla.
          </p>
        </section>

        <section className="welcome__summary" aria-label="Resumen de gastos">
          <div className="summary-card">
            <p className="summary-card__label">Total registrado</p>
            <p className="summary-card__value">${total.toLocaleString('es-AR')}</p>
          </div>
          <div className="summary-card">
            <p className="summary-card__label">Movimientos</p>
            <p className="summary-card__value">{count}</p>
          </div>
        </section>

        <section className="welcome__actions" aria-label="Accesos rápidos">
          <Link to="/new" className="welcome__button welcome__button--primary">
            Registrar Nuevo Gasto
          </Link>
          <Link to="/expenses" className="welcome__button welcome__button--secondary">
            Ver Listado Completo
          </Link>
        </section>
      </main>
    </div>
  );
}
