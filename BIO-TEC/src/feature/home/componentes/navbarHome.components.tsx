import { ActionIcon, Avatar, Menu, Text, UnstyledButton } from '@mantine/core';
import { Menu as MenuIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../../../styles/home/navbar.css';

type NavBarComponentProps = {
  username: string;
  onLogout: () => void;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
};

export const NavBarComponent = ({
  username,
  onLogout,
  onMenuToggle,
  isMenuOpen,
}: NavBarComponentProps) => {
  const displayName = username.trim() || 'Usuario';
  const navigate = useNavigate();

  return (
    <header className="home-navbar">
      <div className="home-navbar__start">
        <ActionIcon
          className="home-navbar__menu-toggle"
          variant="subtle"
          color="blue"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          aria-expanded={isMenuOpen}
          aria-controls="home-sidebar"
        >
          <MenuIcon size={20} />
        </ActionIcon>
        <a className="home-navbar__brand" href="#/" aria-label="BIO-TEC, inicio">
        <span className="home-navbar__mark" aria-hidden="true">B</span>
        <span className="home-navbar__brand-copy">
          <Text className="home-navbar__brand-name">BIO-TEC</Text>
          <Text className="home-navbar__brand-caption">Gestión clínica</Text>
        </span>
        </a>
      </div>

      <Menu position="bottom-end" shadow="sm" withinPortal>
        <Menu.Target>
          <UnstyledButton className="home-navbar__profile" aria-label="Abrir menú de usuario">
            <Avatar color="blue" radius="xl" size={38}>
              {displayName.charAt(0).toUpperCase()}
            </Avatar>
            <span className="home-navbar__user-copy">
              <Text className="home-navbar__user-name">{displayName}</Text>
              <Text className="home-navbar__user-role">Cuenta</Text>
            </span>
            <span className="home-navbar__chevron" aria-hidden="true" />
          </UnstyledButton>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item onClick={() => navigate('/configuracion')}>Configuración</Menu.Item>
          <Menu.Divider />
          <Menu.Item color="red" onClick={onLogout}>Cerrar sesión</Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </header>
  );
};
