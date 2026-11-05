import { useEffect, useState, useCallback } from 'react';

function getIsStandalone() {
  if (typeof window === 'undefined') return false;

  const standaloneByMedia =
    window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

  return Boolean(standaloneByMedia || navigator.standalone === true);
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(getIsStandalone);

  useEffect(() => {
    // Captura el evento beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault(); // Evita el banner automático del navegador
      setInstallPrompt(event);
    };

    // Marca como instalada si se completa la instalación
    const handleAppInstalled = () => setIsInstalled(true);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Función para disparar el prompt de instalación
  const promptInstall = useCallback(async () => {
    if (!installPrompt) return false;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') setIsInstalled(true);
    setInstallPrompt(null);
    return outcome === 'accepted';
  }, [installPrompt]);

  // Detecta iOS (Safari no dispara beforeinstallprompt)
  const isIOS =
    typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  // Solo se puede instalar si hay prompt disponible y no está instalada
  const canInstall = Boolean(installPrompt) && !isInstalled;

  return { installPrompt, promptInstall, isIOS, isInstalled, canInstall };
}

export default usePWAInstall;
