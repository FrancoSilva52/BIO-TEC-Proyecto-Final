import { LoginScreenComponent } from './components/loginScreen.component'
import type { LoginScreenPageProps } from './types/loginScreenPageProps.type';

export const LoginScreenPage = ({ onLogin }: LoginScreenPageProps) => {
  return (
    <LoginScreenComponent onLogin={onLogin} />
  );
}
