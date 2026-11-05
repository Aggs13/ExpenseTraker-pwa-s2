import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IoArrowBackOutline,
  IoGridOutline,
  IoListOutline,
  IoReceiptOutline,
} from 'react-icons/io5';
import { demoExpenses } from '../data/demoExpenses';
import ExpenseList from '../src/components/ExpenseList';
import { formatCurrency } from '../src/utils/format';
import './ExpensesScreen.css';
import './ExpensesComparisonScreen.css';

const EXPENSES = demoExpenses;
const TOTAL = EXPENSES.reduce((sum, expense) => sum + expense.amount, 0);

export default function ExpensesComparisonScreen() {
  const [viewMode, setViewMode] = useState('virtual');
  const isVirtual = viewMode === 'virtual';

  return (
    <div className="expenses expenses--comparison">
      <header className="expenses__header">
        <Link to="/expenses" className="expenses__back-link">
          <IoArrowBackOutline aria-hidden="true" />
          Volver al listado
        </Link>
        <h1>Comparación de renderizado</h1>
        <p className="expenses__subtitle">
          Mismos {EXPENSES.length} gastos de prueba, dos formas de renderizar.
        </p>
      </header>

      <main id="main-content" tabIndex={-1} className="expenses__main">
        <section
          className="comparison__explanation"
          aria-label="Cómo funciona la comparación"
        >
          <p>
            <strong>TanStack Virtual</strong> monta sólo las tarjetas visibles.{' '}
            <strong>map()</strong> monta las {EXPENSES.length} tarjetas de una vez.
            Usá el selector para comparar la cantidad de nodos del DOM.
          </p>
        </section>

        <section className="expenses__toolbar" aria-label="Opciones de comparación">
          <p className="expenses__count">
            <strong>{EXPENSES.length}</strong> gastos de prueba
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

        <ExpenseList
          expenses={EXPENSES}
          mode={viewMode}
          ariaLabel="Listado de comparación de gastos"
        />

        <footer className="expenses__total" aria-label="Total de los gastos de prueba">
          <span className="expenses__total-icon" aria-hidden="true">
            <IoReceiptOutline />
          </span>
          <span className="expenses__total-label">Total de los gastos de prueba</span>
          <strong className="expenses__total-value">{formatCurrency(TOTAL)}</strong>
        </footer>
      </main>
    </div>
  );
}
