import './CategoryBadge.css';

// Variante visual por categoría. Las categorías desconocidas usan la variante base.
const VARIANT_BY_CATEGORY = {
  Comida: 'food',
  Transporte: 'transport',
  Servicios: 'services',
  Ocio: 'leisure',
  Salud: 'health',
};

export default function CategoryBadge({ category }) {
  if (!category) return null;

  const variant = VARIANT_BY_CATEGORY[category] ?? 'default';

  return (
    <span className={`category-badge category-badge--${variant}`}>{category}</span>
  );
}
