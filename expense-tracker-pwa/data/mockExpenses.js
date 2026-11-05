// Datos de ejemplo que simulan los gastos registrados.
// Fuente temporal hasta conectar un almacenamiento real (Sprint posterior).
export const mockExpenses = [
  {
    id: 1,
    name: 'Supermercado',
    amount: 25000,
    category: 'Comida',
    date: '2026-10-25',
    notes: 'Compra semanal: verduras, lácteos y productos de limpieza.',
  },
  {
    id: 2,
    name: 'Combustible',
    amount: 18000,
    category: 'Transporte',
    date: '2026-10-27',
    notes: 'Carga completa de nafta para el auto.',
  },
  {
    id: 3,
    name: 'Internet',
    amount: 32000,
    category: 'Servicios',
    date: '2026-10-29',
    notes: 'Abono mensual de fibra óptica 300 Mbps.',
  },
];

export default mockExpenses;
