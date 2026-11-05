import { useNavigate, useParams } from 'react-router-dom';
import { mockExpenses } from '../data/mockExpenses';
import CategoryBadge from '../src/components/CategoryBadge';
import { formatCurrency, formatDate } from '../src/utils/format';
import './ExpenseDetailScreen.css';

export default function ExpenseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();

  // La URL es la fuente de verdad: el gasto se busca a partir del id de la ruta.
  // Así el detalle sobrevive a una recarga o a un enlace compartido.
  const expense = mockExpenses.find((item) => String(item.id) === id);

  if (!expense) {
    return (
      <div className="expense-detail">
        <header className="expense-detail__header">
          <h1>Detalle del Gasto</h1>
        </header>

        <main id="main-content" tabIndex={-1} className="expense-detail__main">
          <section className="expense-detail__card expense-detail__card--empty">
            <p className="expense-detail__not-found">
              No encontramos un gasto con el id «{id}».
            </p>
            <button
              type="button"
              className="expense-detail__back"
              onClick={() => navigate(-1)}
            >
              Volver
            </button>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="expense-detail">
      <header className="expense-detail__header">
        <h1>Detalle del Gasto</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="expense-detail__main">
        <section className="expense-detail__card" aria-label="Detalle del gasto">
          <p className="expense-detail__amount">{formatCurrency(expense.amount)}</p>
          <p className="expense-detail__name">{expense.name}</p>
          <CategoryBadge category={expense.category} showIcon />

          <dl className="expense-detail__fields">
            <div className="expense-detail__field">
              <dt>Descripción</dt>
              <dd>{expense.name}</dd>
            </div>
            <div className="expense-detail__field">
              <dt>Monto</dt>
              <dd>{formatCurrency(expense.amount)}</dd>
            </div>
            <div className="expense-detail__field">
              <dt>Categoría</dt>
              <dd>{expense.category}</dd>
            </div>
            <div className="expense-detail__field">
              <dt>Fecha</dt>
              <dd>{formatDate(expense.date)}</dd>
            </div>
            <div className="expense-detail__field">
              <dt>Notas</dt>
              <dd>{expense.notes || 'Sin notas.'}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="expense-detail__back"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </section>
      </main>
    </div>
  );
}
