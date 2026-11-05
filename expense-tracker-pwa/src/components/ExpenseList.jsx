import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ExpenseCard from './ExpenseCard';

// Listado reutilizable con dos estrategias de renderizado:
// - virtual: TanStack Virtual monta sólo las filas visibles.
// - map: se montan todas las filas, como un ScrollView con map().
export default function ExpenseList({
  expenses,
  mode = 'virtual',
  ariaLabel = 'Listado de gastos',
  showHint = true,
}) {
  const scrollRef = useRef(null);
  const isVirtual = mode === 'virtual';

  // TanStack Virtual expone funciones estables que el compilador de React no debe memoizar.
  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useVirtualizer({
    count: expenses.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 82,
    overscan: 6,
    getItemKey: (index) => expenses[index].id,
  });

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <>
      {showHint && (
        <p className="expenses__hint">
          {isVirtual
            ? `TanStack Virtual monta ${virtualItems.length} de ${expenses.length} tarjetas.`
            : `map() monta las ${expenses.length} tarjetas del listado.`}
        </p>
      )}

      <div
        className="expenses__list-viewport"
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        {isVirtual ? (
          <ul
            className="expenses__list expenses__list--virtual"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualItems.map((virtualItem) => {
              const expense = expenses[virtualItem.index];

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
            {expenses.map((expense) => (
              <li key={expense.id} className="expenses__item">
                <ExpenseCard expense={expense} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
