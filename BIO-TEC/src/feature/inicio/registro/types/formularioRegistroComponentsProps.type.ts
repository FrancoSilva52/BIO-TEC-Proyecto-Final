import type { PerfilMedico } from './perfilMedico.type';
import type { AuthenticatedUser } from '../../login/types/authenticatedUser.type';

export type FormularioRegistroComponentsProps = {
  modo?: 'registro' | 'edicion';
  medicoId?: string;
  perfilInicial?: PerfilMedico;
  alActualizarPerfil?: (usuario: AuthenticatedUser) => void;
  alCancelar?: () => void;
};