import { useState } from 'react';
import NewExpenseModal from '../src/components/NewExpenseModal';
import './ExpensesScreen.css';

export default function ExpensesScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="expenses">
      <header className="expenses__header">
        <h1>Mis Gastos</h1>
      </header>

      <main className="expenses__main">
        <section className="expenses__list" aria-label="Listado de gastos">
          <p>Listado de gastos registrados</p>
          <button
            type="button"
            className="expenses__add"
            onClick={() => setIsModalOpen(true)}
          >
            Registrar Nuevo Gasto
          </button>
        </section>
      </main>

      <NewExpenseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
