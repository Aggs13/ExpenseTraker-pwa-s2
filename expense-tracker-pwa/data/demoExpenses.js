// Datos generados exclusivamente para la pantalla de comparación de renderizado.
// No se muestran en el listado real: sirven para que la diferencia entre
// TanStack Virtual y `map()` sea observable.
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

const DEMO_COUNT = 500;
const BASE_DATE = Date.UTC(2026, 9, 31);

export const demoExpenses = Array.from({ length: DEMO_COUNT }, (_, index) => {
  const template = DEMO_TEMPLATES[index % DEMO_TEMPLATES.length];
  const date = new Date(BASE_DATE - index * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return {
    // Los ids arrancan en 4 para no chocar con los 3 gastos reales de mockExpenses.
    id: index + 4,
    name: template.name,
    amount: template.amount + (index % 7) * 250,
    category: template.category,
    date,
    notes: `${template.notes} Registro de prueba #${index + 4}.`,
  };
});

export default demoExpenses;
