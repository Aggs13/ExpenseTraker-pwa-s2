import { useEffect, useState } from 'react';
import InstallBanner from '../src/components/InstallBanner';
import {
  SETTINGS_STORAGE_KEY,
  loadFromStorage,
  saveToStorage,
} from '../src/utils/storage';
import './SettingsScreen.css';

const DEFAULT_SETTINGS = {
  notifications: true,
  darkMode: false,
};

function loadSettings() {
  const stored = loadFromStorage(
    SETTINGS_STORAGE_KEY,
    DEFAULT_SETTINGS,
    (value) => value !== null && typeof value === 'object' && !Array.isArray(value)
  );

  return {
    notifications:
      typeof stored.notifications === 'boolean'
        ? stored.notifications
        : DEFAULT_SETTINGS.notifications,
    darkMode:
      typeof stored.darkMode === 'boolean'
        ? stored.darkMode
        : DEFAULT_SETTINGS.darkMode,
  };
}

export default function SettingsScreen() {
  const [settings, setSettings] = useState(loadSettings);

  useEffect(() => {
    saveToStorage(SETTINGS_STORAGE_KEY, settings);
  }, [settings]);

  const toggleSetting = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="settings">
      <header className="settings__header">
        <h1>Ajustes</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="settings__main">
        <section className="settings__card" aria-label="Preferencias">
          <h2 className="settings__card-title">Preferencias</h2>

          <div className="settings__row">
            <label className="settings__row-info" htmlFor="setting-notifications">
              <span className="settings__row-label">Notificaciones</span>
              <span className="settings__row-description">
                Recibir recordatorios para registrar tus gastos diarios.
              </span>
            </label>
            <input
              id="setting-notifications"
              type="checkbox"
              role="switch"
              className="settings__switch"
              checked={settings.notifications}
              onChange={() => toggleSetting('notifications')}
            />
          </div>

          <div className="settings__divider" aria-hidden="true" />

          <div className="settings__row">
            <label className="settings__row-info" htmlFor="setting-dark-mode">
              <span className="settings__row-label">Modo oscuro</span>
              <span className="settings__row-description">
                Usar apariencia oscura en la aplicación.
              </span>
            </label>
            <input
              id="setting-dark-mode"
              type="checkbox"
              role="switch"
              className="settings__switch"
              checked={settings.darkMode}
              onChange={() => toggleSetting('darkMode')}
            />
          </div>
        </section>

        <section className="settings__card" aria-label="Instalación">
          <h2 className="settings__card-title">Instalar la aplicación</h2>
          <p className="settings__card-text">
            Instalá ExpenseTracker en tu dispositivo para usarla como una app
            más, a pantalla completa.
          </p>
          <InstallBanner />
        </section>

        <section className="settings__card" aria-label="Acerca de">
          <h2 className="settings__card-title">Acerca de</h2>
          <p className="settings__card-text">ExpenseTracker · versión demo</p>
        </section>
      </main>
    </div>
  );
}
