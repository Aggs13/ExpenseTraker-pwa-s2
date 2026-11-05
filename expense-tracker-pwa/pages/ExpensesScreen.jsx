import { useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { IoGridOutline, IoListOutline, IoReceiptOutline } from 'react-icons/io5';
import { mockExpenses } from '../data/mockExpenses';
import ExpenseCard from '../src/components/ExpenseCard';
import { formatCurrency } from '../src/utils/format';
import './ExpensesScreen.css';

const EXPENSES = mockExpenses;
const TOTAL = EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);

export default function ExpensesScreen() {
  const [viewMode, setViewMode] = useState('virtual');
  const scrollRef = useRef(null);

  // TanStack Virtual expone funciones estables que el compilador de React no debe memoizar.
  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useVirtualizer({
    count: EXPENSES.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 82,
    overscan: 6,
    getItemKey: (index) => EXPENSES[index].id,
  });

  const virtualItems = virtualizer.getVirtualItems();
  const isVirtual = viewMode === 'virtual';

  return (
    <div className="expenses">
      <header className="expenses__header">
        <h1>Mis Gastos</h1>
        <p className="expenses__subtitle">
          Compará el renderizado virtualizado con el clásico <code>map()</code>.
        </p>
      </header>

      <main id="main-content" tabIndex={-1} className="expenses__main">
        <section className="expenses__toolbar" aria-label="Opciones del listado">
          <p className="expenses__count">
            <strong>{EXPENSES.length}</strong> gastos
          </p>

          <div
            className="expenses__view-toggle"
            role="group"
            aria-label="Modo de renderizado del listado"
          >
            <button
              type="button"
              className="expenses__view-button"
              aria-pressed={isVirtual}
              onClick={() => setViewMode('virtual')}
            >
              <IoGridOutline aria-hidden="true" />
              Virtual
            </button>
            <button
              type="button"
              className="expenses__view-button"
              aria-pressed={!isVirtual}
              onClick={() => setViewMode('map')}
            >
              <IoListOutline aria-hidden="true" />
              map()
            </button>
          </div>
        </section>

        <p className="expenses__hint">
          {isVirtual
            ? `TanStack Virtual monta ${virtualItems.length} de ${EXPENSES.length} tarjetas.`
            : `map() monta las ${EXPENSES.length} tarjetas del listado.`}
        </p>

        {EXPENSES.length === 0 ? (
          <p className="expenses__empty">Todavía no hay gastos registrados.</p>
        ) : (
          <div
            className="expenses__list-viewport"
            ref={scrollRef}
            role="region"
            aria-label="Listado de gastos"
            tabIndex={0}
          >
            {isVirtual ? (
              <ul
                className="expenses__list expenses__list--virtual"
                style={{ height: `${virtualizer.getTotalSize()}px` }}
              >
                {virtualItems.map((virtualItem) => {
                  const expense = EXPENSES[virtualItem.index];

                  return (
                    <li
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      className="expenses__item expenses__item--virtual"
                      style={{
                        transform: `translateY(${virtualItem.start}px)`,
                      }}
                    >
                      <ExpenseCard expense={expense} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul className="expenses__list">
                {EXPENSES.map((expense) => (
                  <li key={expense.id} className="expenses__item">
                    <ExpenseCard expense={expense} />
                  </li>
                ))}
              </ul>
            )}
          </div>
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
