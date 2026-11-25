import { IoReceiptOutline } from 'react-icons/io5';
import { useExpenses } from '../src/context/ExpensesContext';
import ExpenseCard from '../src/components/ExpenseCard';
import { formatCurrency } from '../src/utils/format';
import './ExpensesScreen.css';

export default function ExpensesScreen() {
  const { expenses } = useExpenses();
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  return (
    <div className="expenses">
      <header className="expenses__header">
        <h1>Mis Gastos</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="expenses__main">
        {expenses.length === 0 ? (
          <p className="expenses__empty">Todavía no hay gastos registrados.</p>
        ) : (
          <ul className="expenses__list">
            {expenses.map((expense) => (
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
          <strong className="expenses__total-value">{formatCurrency(total)}</strong>
        </footer>
      </main>
    </div>
  );
}
