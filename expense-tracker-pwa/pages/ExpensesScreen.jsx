import { Link } from 'react-router-dom';
import { IoGitCompareOutline, IoReceiptOutline } from 'react-icons/io5';
import { mockExpenses } from '../data/mockExpenses';
import ExpenseList from '../src/components/ExpenseList';
import { formatCurrency } from '../src/utils/format';
import './ExpensesScreen.css';

const EXPENSES = mockExpenses;
const TOTAL = EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);

export default function ExpensesScreen() {
  return (
    <div className="expenses">
      <header className="expenses__header">
        <h1>Mis Gastos</h1>
        <p className="expenses__subtitle">Listado virtualizado con TanStack Virtual.</p>
      </header>

      <main id="main-content" tabIndex={-1} className="expenses__main">
        <section className="expenses__toolbar" aria-label="Opciones del listado">
          <p className="expenses__count">
            <strong>{EXPENSES.length}</strong> gastos
          </p>

          <Link to="/comparison" className="expenses__compare-link">
            <IoGitCompareOutline aria-hidden="true" />
            Comparar con map()
          </Link>
        </section>

        {EXPENSES.length === 0 ? (
          <p className="expenses__empty">Todavía no hay gastos registrados.</p>
        ) : (
          <ExpenseList expenses={EXPENSES} mode="virtual" showHint={false} />
        )}

        <footer className="expenses__total" aria-label="Total de gastos">
          <span className="expenses__total-icon" aria-hidden="true">
            <IoReceiptOutline />
          </span>
          <span className="expenses__total-label">Total de gastos</span>
          <strong className="expenses__total-value">{formatCurrency(TOTAL)}</strong>
        </footer>
      </main>
    </div>
  );
}
