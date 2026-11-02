import '../../styles/pacientes/pacientes.css';
import { GrillaPacientesComponents } from './components/grillaPacientes.components';
import type { PacientesPageProps } from './types/pacientesPageProps.type';

export const PacientesPage = ({ doctorId }: PacientesPageProps) => {
  return <GrillaPacientesComponents doctorId={doctorId} />;
};

export { PerfilPacienteComponents } from './components/perfilPaciente.components';
