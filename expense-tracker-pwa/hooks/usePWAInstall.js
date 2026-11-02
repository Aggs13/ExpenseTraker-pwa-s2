import { useEffect, useState, useCallback } from 'react';

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detecta si ya está instalada (modo standalone)
    const standalone =
      (typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(display-mode: standalone)').matches) ||
      (typeof navigator !== 'undefined' && navigator.standalone === true);

    setIsInstalled(Boolean(standalone));

    // Captura el evento beforeinstallprompt (Android/Chrome)
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Evita el banner automático del navegador
      setInstallPrompt(e);
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
    typeof navigator !== 'undefined' &&
    /iphone|ipad|ipod/i.test(navigator.userAgent) &&
    !window.MSStream;

  // Solo se puede instalar si hay prompt disponible y no está instalada
  const canInstall = Boolean(installPrompt) && !isInstalled;

  return { installPrompt, promptInstall, isIOS, isInstalled, canInstall };
}

export default usePWAInstall;