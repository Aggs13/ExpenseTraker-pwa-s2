import {
  IoCarOutline,
  IoFastFoodOutline,
  IoFlashOutline,
  IoGameControllerOutline,
  IoMedkitOutline,
  IoPricetagOutline,
} from 'react-icons/io5';

// Íconos de Ionicons (react-icons/io5) equivalentes a los usados en Expo.
const ICON_BY_CATEGORY = {
  Comida: IoFastFoodOutline,
  Transporte: IoCarOutline,
  Servicios: IoFlashOutline,
  Ocio: IoGameControllerOutline,
  Salud: IoMedkitOutline,
  Otros: IoPricetagOutline,
};

export default function CategoryIcon({ category, className, size = 16 }) {
  const Icon = ICON_BY_CATEGORY[category] ?? IoPricetagOutline;

  return (
    <Icon
      className={className}
      size={size}
      aria-hidden="true"
      focusable="false"
    />
  );
}
