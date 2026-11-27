import { IoCloudOfflineOutline } from 'react-icons/io5';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import './OfflineBanner.css';

export default function OfflineBanner() {
  const isOnline = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="offline-banner" role="status" aria-live="polite">
      <IoCloudOfflineOutline className="offline-banner__icon" aria-hidden="true" />
      <span>Sin conexión — Los cambios se sincronizarán al volver a conectarse</span>
    </div>
  );
}
