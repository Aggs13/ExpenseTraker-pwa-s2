import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useExpenses } from '../src/context/ExpensesContext';
import { CATEGORIES } from '../src/data/categories';
import './NewExpenseScreen.css';

export default function NewExpenseScreen() {
  const { addExpense } = useExpenses();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedTitle = name.trim();
    const numericAmount = Number(String(amount).trim().replace(',', '.'));

    if (!trimmedTitle || !String(amount).trim() || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Ingresa un nombre válido y un monto mayor a cero.');
      return;
    }

    setError('');
    addExpense({
      title: trimmedTitle,
      amount: numericAmount,
      category,
      notes: notes.trim(),
    });

    navigate('/expenses');
  };

  return (
    <div className="new-expense">
      <header className="new-expense__header">
        <h1>Nuevo Gasto</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="new-expense__main">
        <form className="new-expense__card new-expense__form" onSubmit={handleSubmit}>
          <div className="new-expense__field">
            <label htmlFor="page-expense-name">Nombre del gasto</label>
            <input
              id="page-expense-name"
              type="text"
              placeholder="Ej: Supermercado"
              autoComplete="off"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="new-expense__field">
            <label htmlFor="page-expense-amount">Monto</label>
            <input
              id="page-expense-amount"
              type="text"
              inputMode="decimal"
              placeholder="Ej: 1500"
              autoComplete="off"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
          </div>

          <div className="new-expense__field">
            <span className="new-expense__label" id="page-expense-category-label">
              Categoría
            </span>
            <div
              className="new-expense__chips"
              role="group"
              aria-labelledby="page-expense-category-label"
            >
              {CATEGORIES.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="new-expense__chip"
                  aria-pressed={category === item}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="new-expense__field">
            <label htmlFor="page-expense-notes">Notas (opcional)</label>
            <input
              id="page-expense-notes"
              type="text"
              placeholder="Ej: Compra semanal"
              autoComplete="off"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
          </div>

          {error && (
            <p className="new-expense__error" role="alert">
              {error}
            </p>
          )}

          <div className="new-expense__actions">
            <Link to="/" className="new-expense__cancel">
              Cancelar
            </Link>
            <button type="submit" className="new-expense__back">
              Guardar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
