import { ActionIcon, Text } from '@mantine/core';
import { ClipboardList, Clock3, House, Pin, Settings, UserRound, Users, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';

type MenuLateralComponentProps = {
  isPinned: boolean;
  isOpen: boolean;
  onTogglePinned: () => void;
  onClose: () => void;
};

const navigationItems = [
  { label: 'Inicio', to: '/', icon: House, end: true },
  { label: 'Pacientes', to: '/pacientes', icon: Users },
  { label: 'Historial', to: '/historial', icon: Clock3 },
  { label: 'Formularios de paciente', to: '/formularios/paciente', icon: UserRound },
  { label: 'Formularios extra', to: '/formularios/extra', icon: ClipboardList },
  { label: 'Configuración', to: '/configuracion', icon: Settings },
];

export const MenuLateralComponent = ({
  isPinned,
  isOpen,
  onTogglePinned,
  onClose,
}: MenuLateralComponentProps) => {
  if (!isOpen && !isPinned) return null;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="home-sidebar__backdrop"
          aria-label="Cerrar menú de navegación"
          onClick={onClose}
        />
      )}
      <aside
        id="home-sidebar"
        className={`home-sidebar${isOpen ? ' home-sidebar--open' : ''}${isPinned ? ' home-sidebar--pinned' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="home-sidebar__heading">
          <Text className="home-sidebar__title">Navegación</Text>
          <div className="home-sidebar__controls">
            <ActionIcon
              variant="subtle"
              color="blue"
              onClick={onTogglePinned}
              aria-label={isPinned ? 'Desfijar menú' : 'Fijar menú'}
              title={isPinned ? 'Desfijar menú' : 'Fijar menú'}
            >
              <Pin size={17} className={isPinned ? 'home-sidebar__pin--active' : ''} />
            </ActionIcon>
            {!isPinned && (
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={onClose}
                aria-label="Cerrar menú"
              >
                <X size={17} />
              </ActionIcon>
            )}
          </div>
        </div>
        <nav className="home-sidebar__nav">
          {navigationItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `home-sidebar__link${isActive ? ' home-sidebar__link--active' : ''}`
              }
              onClick={() => {
                if (!isPinned) onClose();
              }}
            >
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="home-sidebar__footer">BIO-TEC</div>
      </aside>
    </>
  );
};
