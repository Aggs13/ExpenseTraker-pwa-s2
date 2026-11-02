import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import { formatCurrency } from '../utils/format';
import './ExpenseCard.css';

// Tarjeta reutilizable de un gasto. Navega al detalle usando el id en la URL.
export default function ExpenseCard({ expense }) {
  if (!expense) return null;

  return (
    <article className="expense-card">
      <Link className="expense-card__link" to={`/expenses/${expense.id}`}>
        <div className="expense-card__info">
          <p className="expense-card__name">{expense.name}</p>
          <CategoryBadge category={expense.category} />
        </div>
        <p className="expense-card__amount">{formatCurrency(expense.amount)}</p>
      </Link>
    </article>
  );
}
