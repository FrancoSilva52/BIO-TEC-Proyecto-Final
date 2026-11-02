import type { AuthenticatedUser } from './authenticatedUser.type';

export type LoginScreenComponentProps = {
  onLogin: (user: AuthenticatedUser) => void;
};