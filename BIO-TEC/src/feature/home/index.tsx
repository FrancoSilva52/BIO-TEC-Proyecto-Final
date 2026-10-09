import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../../styles/home/menulateral.css';
import { NavBarComponent } from './componentes/navbarHome.components';
import { MenuLateralComponent } from './componentes/menuLateral.components';

type HomePageProps = {
  username: string;
  onLogout: () => void;
};

export const HomePage = ({ username, onLogout }: HomePageProps) => {
  const [isPinned, setIsPinned] = useState(
    () => localStorage.getItem('bio-tec-sidebar-pinned') === 'true',
  );
  const [isOpen, setIsOpen] = useState(isPinned);

  const togglePinned = () => {
    const nextPinned = !isPinned;
    setIsPinned(nextPinned);
    setIsOpen(nextPinned);
    localStorage.setItem('bio-tec-sidebar-pinned', String(nextPinned));
  };

  return (
    <div className={`home-page${isPinned ? ' home-page--pinned' : ''}`}>
      <NavBarComponent
        username={username}
        onLogout={onLogout}
        onMenuToggle={() => setIsOpen(!isOpen)}
        isMenuOpen={isOpen}
      />
      <div className="home-layout">
        <MenuLateralComponent
          isPinned={isPinned}
          isOpen={isOpen}
          onTogglePinned={togglePinned}
          onClose={() => setIsOpen(false)}
        />
        <main className="home-workspace">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
