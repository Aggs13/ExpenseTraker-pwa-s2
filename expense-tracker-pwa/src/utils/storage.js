export const EXPENSES_STORAGE_KEY = '@expensetracker/expenses';
export const SETTINGS_STORAGE_KEY = '@expensetracker/settings';

export function loadFromStorage(key, fallback, isValid = () => true) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed = JSON.parse(raw);
    if (!isValid(parsed)) return fallback;

    return parsed;
  } catch (error) {
    console.error(`Error al leer "${key}" desde localStorage:`, error);
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error al guardar "${key}" en localStorage:`, error);
  }
}
