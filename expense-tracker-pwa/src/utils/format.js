// Utilidades de formato compartidas por las pantallas de gastos.

export function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

export function formatDate(date) {
  if (!date) return '';
  // Se agrega la hora para evitar que el navegador desplace la fecha por zona horaria.
  const parsed = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
