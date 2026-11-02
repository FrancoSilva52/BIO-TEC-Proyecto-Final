import type { AuthenticatedUser } from '../../../inicio/login/types/authenticatedUser.type';

export type ConfiguracionUsuarioPageProps = {
  usuario: AuthenticatedUser;
  alActualizarPerfil: (usuario: AuthenticatedUser) => void;
};