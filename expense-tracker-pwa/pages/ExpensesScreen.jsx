import { IoReceiptOutline } from 'react-icons/io5';
import { mockExpenses } from '../data/mockExpenses';
import ExpenseCard from '../src/components/ExpenseCard';
import { formatCurrency } from '../src/utils/format';
import './ExpensesScreen.css';

const EXPENSES = mockExpenses;
const TOTAL = EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);

export default function ExpensesScreen() {
  return (
    <div className="expenses">
      <header className="expenses__header">
        <h1>Mis Gastos</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="expenses__main">
        {EXPENSES.length === 0 ? (
          <p className="expenses__empty">Todavía no hay gastos registrados.</p>
        ) : (
          <ul className="expenses__list">
            {EXPENSES.map((expense) => (
              <li key={expense.id} className="expenses__item">
                <ExpenseCard expense={expense} />
              </li>
            ))}
          </ul>
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
