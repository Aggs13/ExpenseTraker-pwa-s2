// Metadatos compartidos por las categorías de gastos.
// La variante se usa para colorear badges, íconos y tarjetas.
export const CATEGORIES = ['Comida', 'Transporte', 'Servicios', 'Ocio', 'Salud', 'Otros'];

export const CATEGORY_META = {
  Comida: { variant: 'food' },
  Transporte: { variant: 'transport' },
  Servicios: { variant: 'services' },
  Ocio: { variant: 'leisure' },
  Salud: { variant: 'health' },
  Otros: { variant: 'other' },
};

export function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? CATEGORY_META.Otros;
}

export default CATEGORY_META;
