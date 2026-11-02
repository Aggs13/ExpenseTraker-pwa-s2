import { Outlet } from 'react-router-dom';
import BottomNav from '../src/components/BottomNav';
import './MainLayout.css';

export default function MainLayout() {
  return (
    <div className="main-layout">
      <div className="main-layout__content">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}