import { usePWAInstall } from '../../hooks/usePWAInstall';

export default function InstallBanner() {
  const { canInstall, promptInstall, isIOS, isInstalled } = usePWAInstall();

  if (isInstalled) return null;

  if (canInstall) {
    return (
      <button type="button" onClick={promptInstall}>
        Instalar App
      </button>
    );
  }

  if (isIOS) {
    return (
      <p>
        Para instalar: tocá <strong>Compartir</strong> y luego{' '}
        <strong>Agregar a pantalla de inicio</strong>.
      </p>
    );
  }

  return null;
}