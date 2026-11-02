import { mockExpenses } from '../data/mockExpenses';
import ExpenseCard from '../src/components/ExpenseCard';
import './ExpensesScreen.css';

export default function ExpensesScreen() {
  return (
    <div className="expenses">
      <header className="expenses__header">
        <h1>Mis Gastos</h1>
      </header>

      <main className="expenses__main">
        {mockExpenses.length === 0 ? (
          <p className="expenses__empty">Todavía no hay gastos registrados.</p>
        ) : (
          <ul className="expenses__list">
            {mockExpenses.map((expense) => (
              <li key={expense.id} className="expenses__item">
                <ExpenseCard expense={expense} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
