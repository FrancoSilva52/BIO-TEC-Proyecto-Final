import { ArrowUpRight, ClipboardList, Clock3, Settings, Users, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const quickLinks = [
  { title: 'Pacientes', to: '/pacientes', icon: Users },
  { title: 'Historial de consultas', to: '/historial', icon: Clock3 },
  { title: 'Formulario de paciente', to: '/formularios/paciente', icon: UserRound },
  { title: 'Formularios extra', to: '/formularios/extra', icon: ClipboardList },
  { title: 'Configuración', to: '/configuracion', icon: Settings },
];

export const HomeDashboardComponent = () => (
  <section className="home-dashboard" aria-labelledby="home-title">
    <div className="home-dashboard__heading">
      <div>
        <p className="home-dashboard__eyebrow">BIO-TEC</p>
        <h1 id="home-title">Inicio</h1>
      </div>
    </div>
    <h2 className="home-dashboard__section-title">Accesos rápidos</h2>
    <div className="home-quick-links">
      {quickLinks.map(({ title, to, icon: Icon }) => (
        <NavLink className="home-quick-link" key={to} to={to}>
          <span className="home-quick-link__icon"><Icon size={21} strokeWidth={1.8} /></span>
          <span className="home-quick-link__title">{title}</span>
          <ArrowUpRight className="home-quick-link__arrow" size={18} />
        </NavLink>
      ))}
    </div>
  </section>
);