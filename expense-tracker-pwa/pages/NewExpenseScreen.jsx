import { Link } from 'react-router-dom';
import './NewExpenseScreen.css';

// Placeholder: el formulario de carga se implementa en una user story posterior.
export default function NewExpenseScreen() {
  return (
    <div className="new-expense">
      <header className="new-expense__header">
        <h1>Nuevo Gasto</h1>
      </header>

      <main className="new-expense__main">
        <section className="new-expense__card">
          <p>El formulario de carga de gastos estará disponible próximamente.</p>
          <Link to="/" className="new-expense__back">
            Volver al inicio
          </Link>
        </section>
      </main>
    </div>
  );
}
