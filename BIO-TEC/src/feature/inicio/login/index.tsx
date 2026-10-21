import { LoginScreenComponent } from './components/loginScreen.component'
import type { AuthenticatedUser } from './services/auth.service';

type LoginScreenPageProps = {
  onLogin: (user: AuthenticatedUser) => void;
};

export const LoginScreenPage = ({ onLogin }: LoginScreenPageProps) => {
  return (
    <LoginScreenComponent onLogin={onLogin} />
  );
}
