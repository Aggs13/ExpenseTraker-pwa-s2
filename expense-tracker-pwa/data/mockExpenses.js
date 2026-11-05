// Datos de ejemplo que simulan los gastos registrados.
// Los primeros tres registros son los del Sprint 1; el resto se genera de forma
// determinística para poder comparar el renderizado con `map()` y con
// TanStack Virtual sin depender de un backend.
const BASE_EXPENSES = [
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

const DEMO_TEMPLATES = [
  {
    name: 'Supermercado',
    category: 'Comida',
    amount: 24500,
    notes: 'Compra semanal de alimentos.',
  },
  {
    name: 'Almuerzo',
    category: 'Comida',
    amount: 8500,
    notes: 'Almuerzo fuera de casa.',
  },
  {
    name: 'Café',
    category: 'Comida',
    amount: 3200,
    notes: 'Café con algo dulce.',
  },
  {
    name: 'Combustible',
    category: 'Transporte',
    amount: 17500,
    notes: 'Carga de nafta.',
  },
  {
    name: 'Transporte público',
    category: 'Transporte',
    amount: 1500,
    notes: 'Viaje en colectivo o subte.',
  },
  {
    name: 'Internet',
    category: 'Servicios',
    amount: 32000,
    notes: 'Abono mensual de internet.',
  },
  {
    name: 'Electricidad',
    category: 'Servicios',
    amount: 21000,
    notes: 'Factura de luz.',
  },
  {
    name: 'Cine',
    category: 'Ocio',
    amount: 12000,
    notes: 'Entrada al cine.',
  },
  {
    name: 'Streaming',
    category: 'Ocio',
    amount: 9500,
    notes: 'Suscripción mensual de streaming.',
  },
  {
    name: 'Farmacia',
    category: 'Salud',
    amount: 7800,
    notes: 'Compra de medicamentos.',
  },
  {
    name: 'Consulta médica',
    category: 'Salud',
    amount: 28000,
    notes: 'Consulta con profesional de la salud.',
  },
  {
    name: 'Regalo',
    category: 'Otros',
    amount: 16000,
    notes: 'Regalo para un cumpleaños.',
  },
];

const DEMO_EXPENSES = Array.from({ length: 117 }, (_, index) => {
  const template = DEMO_TEMPLATES[index % DEMO_TEMPLATES.length];
  const month = 10 - Math.floor(index / 28);
  const day = 28 - (index % 28);
  const date = `2026-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return {
    id: index + 4,
    name: template.name,
    amount: template.amount + (index % 7) * 250,
    category: template.category,
    date,
    notes: `${template.notes} Registro de ejemplo #${index + 4}.`,
  };
});

export const mockExpenses = [...BASE_EXPENSES, ...DEMO_EXPENSES];

export default mockExpenses;
