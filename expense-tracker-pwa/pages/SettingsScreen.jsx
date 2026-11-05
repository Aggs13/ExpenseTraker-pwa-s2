import InstallBanner from '../src/components/InstallBanner';
import './SettingsScreen.css';

export default function SettingsScreen() {
  return (
    <div className="settings">
      <header className="settings__header">
        <h1>Ajustes</h1>
      </header>

      <main id="main-content" tabIndex={-1} className="settings__main">
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
