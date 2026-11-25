// Utilidades de formato compartidas por las pantallas de gastos.

export function formatCurrency(amount) {
  return `$${Number(amount).toLocaleString('es-AR')}`;
}

export function formatDate(date) {
  if (!date) return '';
  const raw = String(date);
  // Si viene solo YYYY-MM-DD se agrega la hora para evitar desplazamiento por zona horaria.
  const parsed = raw.includes('T') ? new Date(raw) : new Date(`${raw}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return raw;

  return parsed.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
