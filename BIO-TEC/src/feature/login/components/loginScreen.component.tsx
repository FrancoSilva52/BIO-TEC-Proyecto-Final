import { useState, type FormEvent } from 'react';
import { Button, Checkbox, PasswordInput, Stack, Text, TextInput, Title } from '@mantine/core';
import '../../../styles/login/login.css';

type LoginScreenComponentProps = {
  onLogin: (username: string) => void;
};

export const LoginScreenComponent = ({ onLogin }: LoginScreenComponentProps) => {
  const [username, setUsername] = useState(
    () => localStorage.getItem('bio-tec-remembered-user') ?? '',
  );
  const [rememberUser, setRememberUser] = useState(
    () => localStorage.getItem('bio-tec-remember-user') === 'true',
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rememberUser) {
      localStorage.setItem('bio-tec-remembered-user', username);
      localStorage.setItem('bio-tec-remember-user', 'true');
    } else {
      localStorage.removeItem('bio-tec-remembered-user');
      localStorage.removeItem('bio-tec-remember-user');
    }
    onLogin(username);
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-form-wrap">
          <div className="login-brand">
            <span className="login-brand__mark" aria-hidden="true">B</span>
            <div>
              <Text fw={700} size="lg"  >BIO-TEC</Text>
              <Text size="xs" c="dimmed">Software de Gestión clínica</Text>
            </div>
          </div>
          <div className="login-heading">
            <Title id="login-title" order={2} className="login-title" ta="center">Iniciar Sesión</Title>
          </div>

          <form onSubmit={handleSubmit} >
            <Stack gap="md">
              <TextInput
                label="Correo electrónico o usuario"
                placeholder="Ingresá tu usuario"
                value={username}
                onChange={(event) => setUsername(event.currentTarget.value)}
                autoComplete="username"
                required
                size="md"
              />
              <PasswordInput
                label="Contraseña"
                placeholder="Ingresá tu contraseña"
                autoComplete="current-password"
                required
                size="md"
              />
              <Checkbox
                label="Recordar usuario"
                checked={rememberUser}
                onChange={(event) => setRememberUser(event.currentTarget.checked)}
                color="blue"
              />
              <Button type="submit" size="md" fullWidth mt="md">
                Ingresar
              </Button>
            </Stack>
             <Button variant="outline" type="button" size="md" fullWidth mt="md">
                Registrarse
              </Button>
          </form>
        </div>
      </section>
    </main>
  );
};
