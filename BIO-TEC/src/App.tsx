import { useState } from 'react';
import { HashRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import type { AuthenticatedUser } from './feature/inicio/login/services/auth.service';
import { HomePage } from './feature/home';
import { HomeDashboardComponent } from './feature/home/componentes/homeDashboard.component';
import { LoginScreenPage } from './feature/inicio/login';
import { RegistroPage } from './feature/inicio/registro';
import { PacientesPage, PerfilPacienteComponents } from './feature/pacientes';
import { HistorialPacientesPage } from './feature/historial/pacientes';
import { BackButtonComponent } from './components/navigation/backButton.component';

function WorkspaceSection({ title }: { title: string }) {
  return (
    <section className="workspace-placeholder">
      <BackButtonComponent fallbackTo="/" />
      <p className="workspace-placeholder__eyebrow">BIO-TEC</p>
      <h1>{title}</h1>
      <p>Esta sección estará disponible a medida que se incorporen sus funciones.</p>
    </section>
  );
}

function AppRoutes() {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          currentUser ? (
            <Navigate to="/" replace />
          ) : (
            <LoginScreenPage
              onLogin={(user) => {
                setCurrentUser(user);
                navigate('/', { replace: true });
              }}
            />
          )
        }
      />
      <Route
        path="/registro"
        element={currentUser ? <Navigate to="/" replace /> : <RegistroPage />}
      />
      <Route
        path="/"
        element={
          currentUser ? (
            <HomePage
              username={currentUser.fullName}
              profilePhotoDataUrl={currentUser.profilePhotoDataUrl}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<HomeDashboardComponent />} />
        <Route
          path="pacientes"
          element={currentUser ? <PacientesPage doctorId={currentUser.id} /> : null}
        />
        <Route
          path="pacientes/:patientId"
          element={currentUser ? <PerfilPacienteComponents doctorId={currentUser.id} /> : null}
        />
        <Route
          path="historial"
          element={currentUser ? <HistorialPacientesPage doctorId={currentUser.id} /> : null}
        />
        {/* <Route path="formularios/paciente" element={<NuevoAnalisisPlaceholderComponent />} /> */}
        <Route path="formularios/extra" element={<WorkspaceSection title="Formularios extra" />} />
        <Route path="configuracion" element={<WorkspaceSection title="Configuración" />} />
      </Route>
      <Route path="*" element={<Navigate to={currentUser ? '/' : '/login'} replace />} />
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