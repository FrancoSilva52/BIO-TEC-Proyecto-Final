import { LoginScreenComponent } from './components/loginScreen.component'

type LoginScreenPageProps = {
  onLogin: (username: string) => void;
};

export const LoginScreenPage = ({ onLogin }: LoginScreenPageProps) => {
  return (
    <LoginScreenComponent onLogin={onLogin} />
  );
}
