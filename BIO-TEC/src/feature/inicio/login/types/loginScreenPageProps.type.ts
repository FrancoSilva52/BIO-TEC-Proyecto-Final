import type { AuthenticatedUser } from './authenticatedUser.type';

export type LoginScreenPageProps = {
  onLogin: (user: AuthenticatedUser) => void;
};