export type NavBarComponentProps = {
  username: string;
  profilePhotoDataUrl: string;
  onLogout: () => void;
  onMenuToggle: () => void;
  isMenuOpen: boolean;
};