import '../../styles/pacientes/pacientes.css';
import { GrillaPacientesComponents } from './components/grillaPacientes.components';

type PacientesPageProps = {
  doctorId: string;
};

export const PacientesPage = ({ doctorId }: PacientesPageProps) => {
  return <GrillaPacientesComponents doctorId={doctorId} />;
};

export { PerfilPacienteComponents } from './components/perfilPaciente.components';
