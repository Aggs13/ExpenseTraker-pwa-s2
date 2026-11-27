import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useExpenses } from '../src/context/ExpensesContext';
import CategoryBadge from '../src/components/CategoryBadge';
import { formatCurrency, formatDate } from '../src/utils/format';
import './ExpenseDetailScreen.css';

export default function ExpenseDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { expenses, removeExpense } = useExpenses();

  // Si se entró directo por URL no hay historial previo: vuelve al listado.
  const handleBack = () =>
    location.key === 'default' ? navigate('/expenses') : navigate(-1);

  // La URL es la fuente de verdad: el gasto se busca en el Context a partir del id de la ruta.
  const expense = expenses.find((item) => String(item.id) === String(id));

  const handleDelete = () => {
    if (!expense) return;
    const title = expense.title ?? expense.name ?? expense.nombre;
    const confirmed = window.confirm(
      `¿Estás seguro de que quieres eliminar "${title}"?`
    );
    if (confirmed) {
      removeExpense(expense.id);
      navigate('/expenses');
    }
  };

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
              onClick={handleBack}
            >
              Volver
            </button>
          </section>
        </main>
      </div>
    );
  }

  const title = expense.title ?? expense.name ?? expense.nombre;
  const createdAt = expense.createdAt ?? expense.date;

  return (
    <div className="expense-detail">
      <header className="expense-detail__header">
        <h1>Detalle del Gasto</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="expense-detail__main">
        <section className="expense-detail__card" aria-label="Detalle del gasto">
          <p className="expense-detail__amount">{formatCurrency(expense.amount)}</p>
          <p className="expense-detail__name">{title}</p>
          <CategoryBadge category={expense.category} showIcon />

          <dl className="expense-detail__fields">
            <div className="expense-detail__field">
              <dt>Descripción</dt>
              <dd>{title}</dd>
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
              <dd>{formatDate(createdAt)}</dd>
            </div>
            <div className="expense-detail__field">
              <dt>Sincronización</dt>
              <dd>
                {expense.hasPendingWrites ? (
                  <span className="expense-detail__sync-status expense-detail__sync-status--pending">
                    ⏳ Pendiente de sincronizar (Offline)
                  </span>
                ) : (
                  <span className="expense-detail__sync-status expense-detail__sync-status--synced">
                    ✓ Sincronizado en la nube
                  </span>
                )}
              </dd>
            </div>
            <div className="expense-detail__field">
              <dt>Notas</dt>
              <dd>{expense.notes || 'Sin notas.'}</dd>
            </div>
          </dl>

          <div className="expense-detail__actions">
            <button
              type="button"
              className="expense-detail__delete"
              onClick={handleDelete}
            >
              Eliminar
            </button>
            <button
              type="button"
              className="expense-detail__back"
              onClick={handleBack}
            >
              Volver
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
