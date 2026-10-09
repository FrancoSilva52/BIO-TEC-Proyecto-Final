import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { HomePage } from './feature/home';
import { HomeDashboardComponent } from './feature/home/componentes/homeDashboard.component';
import { LoginScreenPage } from './feature/login';

function WorkspaceSection({ title }: { title: string }) {
  return (
    <section className="workspace-placeholder">
      <p className="workspace-placeholder__eyebrow">BIO-TEC</p>
      <h1>{title}</h1>
      <p>Esta sección estará disponible a medida que se incorporen sus funciones.</p>
    </section>
  );
}

function AppRoutes() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginScreenPage
              onLogin={(submittedUsername) => {
                setUsername(submittedUsername);
                setIsLoggedIn(true);
                navigate('/', { replace: true });
              }}
            />
          )
        }
      />
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <HomePage username={username} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<HomeDashboardComponent />} />
        <Route path="pacientes" element={<WorkspaceSection title="Pacientes" />} />
        <Route path="historial" element={<WorkspaceSection title="Historial de consultas" />} />
        <Route path="formularios/paciente" element={<WorkspaceSection title="Formularios de paciente" />} />
        <Route path="formularios/extra" element={<WorkspaceSection title="Formularios extra" />} />
        <Route path="configuracion" element={<WorkspaceSection title="Configuración" />} />
      </Route>
      <Route path="*" element={<Navigate to={isLoggedIn ? '/' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  );
}

export default App;