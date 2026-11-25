import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import CategoryIcon from './CategoryIcon';
import { getCategoryMeta } from '../data/categories';
import { formatCurrency } from '../utils/format';
import './ExpenseCard.css';

// Tarjeta reutilizable de un gasto. Navega al detalle usando el id en la URL.
export default function ExpenseCard({ expense }) {
  if (!expense) return null;

  const { variant } = getCategoryMeta(expense.category);
  const title = expense.title ?? expense.name ?? expense.nombre;

  return (
    <article className={`expense-card expense-card--${variant}`}>
      <Link className="expense-card__link" to={`/expenses/${expense.id}`}>
        <span className="expense-card__icon" aria-hidden="true">
          <CategoryIcon category={expense.category} size={20} />
        </span>

        <div className="expense-card__info">
          <p className="expense-card__name">{title}</p>
          <CategoryBadge category={expense.category} />
        </div>

        <p className="expense-card__amount">{formatCurrency(expense.amount)}</p>
      </Link>
    </article>
  );
}
