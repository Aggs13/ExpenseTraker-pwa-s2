import CategoryIcon from './CategoryIcon';
import { getCategoryMeta } from '../utils/categories';
import './CategoryBadge.css';

// Variante visual por categoría. Las categorías desconocidas usan la variante base.
export default function CategoryBadge({ category, showIcon = false }) {
  if (!category) return null;

  const { variant } = getCategoryMeta(category);

  return (
    <span className={`category-badge category-badge--${variant}`}>
      {showIcon && <CategoryIcon category={category} className="category-badge__icon" />}
      <span>{category}</span>
    </span>
  );
}
