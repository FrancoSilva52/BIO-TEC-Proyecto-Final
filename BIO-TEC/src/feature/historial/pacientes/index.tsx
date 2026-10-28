import { PacienteHistorialComponents } from './componentes/pacienteHistorial.components';

type HistorialPacientesPageProps = {
  doctorId: string;
};

export const HistorialPacientesPage = ({ doctorId }: HistorialPacientesPageProps) => (
  <PacienteHistorialComponents doctorId={doctorId} />
);
