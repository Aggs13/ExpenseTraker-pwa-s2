import { Outlet } from 'react-router-dom';
import BottomNav from '../src/components/BottomNav';
import OfflineBanner from '../src/components/OfflineBanner';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <OfflineBanner />
      <div className="main-layout__content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}