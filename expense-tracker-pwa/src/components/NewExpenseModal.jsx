import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './NewExpenseModal.css';

const CATEGORIES = ['Comida', 'Transporte', 'Ocio', 'Salud', 'Otros'];

export default function NewExpenseModal({ open = false, onClose = () => {} }) {
  const dialogRef = useRef(null);
  const feedbackTimerRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [feedback, setFeedback] = useState('');

  // Mantiene una referencia estable al callback del padre.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Sincroniza el estado real del <dialog> con la prop `open`.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Notifica al padre cuando el modal se cierra (botón, backdrop o Esc).
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleNotifyClose = () => {
      setFeedback('');
      onCloseRef.current();
    };

    dialog.addEventListener('close', handleNotifyClose);
    return () => dialog.removeEventListener('close', handleNotifyClose);
  }, []);

  useEffect(() => () => window.clearTimeout(feedbackTimerRef.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const expense = { name: name.trim(), amount: amount.trim(), category };

    // Por ahora sólo se muestra la acción: todavía no se persiste nada.
    console.log('Nuevo gasto (demo):', expense);
    setFeedback(`Gasto "${expense.name || 'sin nombre'}" registrado (demo).`);

    setName('');
    setAmount('');
    setCategory(CATEGORIES[0]);

    window.clearTimeout(feedbackTimerRef.current);
    feedbackTimerRef.current = window.setTimeout(() => setFeedback(''), 3000);
  };

  const handleCancel = () => {
    const dialog = dialogRef.current;
    if (dialog && dialog.open) dialog.close();
  };

  const handleBackdropClick = (event) => {
    if (event.target === dialogRef.current) handleCancel();
  };

  return createPortal(
    <dialog
      ref={dialogRef}
      className="expense-modal"
      aria-labelledby="expense-modal-title"
      onClick={handleBackdropClick}
    >
      <form className="expense-modal__sheet" onSubmit={handleSubmit}>
        <span className="expense-modal__grabber" aria-hidden="true" />
        <h2 id="expense-modal-title" className="expense-modal__title">
          Nuevo gasto
        </h2>

        <div className="expense-modal__field">
          <label htmlFor="expense-name">Nombre del gasto</label>
          <input
            id="expense-name"
            type="text"
            placeholder="Ej: Supermercado"
            autoComplete="off"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>

        <div className="expense-modal__field">
          <label htmlFor="expense-amount">Monto</label>
          <input
            id="expense-amount"
            type="text"
            inputMode="decimal"
            placeholder="Ej: 1500"
            autoComplete="off"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
          />
        </div>

        <div className="expense-modal__field">
          <span className="expense-modal__label" id="expense-category-label">
            Categoría
          </span>
          <div
            className="expense-modal__chips"
            role="group"
            aria-labelledby="expense-category-label"
          >
            {CATEGORIES.map((item) => (
              <button
                key={item}
                type="button"
                className="expense-modal__chip"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {feedback && (
          <p className="expense-modal__feedback" role="status">
            {feedback}
          </p>
        )}

        <div className="expense-modal__actions">
          <button type="button" className="expense-modal__cancel" onClick={handleCancel}>
            Cancelar
          </button>
          <button type="submit" className="expense-modal__submit">
            Guardar
          </button>
        </div>
      </form>
    </dialog>,
    document.body
  );
}
