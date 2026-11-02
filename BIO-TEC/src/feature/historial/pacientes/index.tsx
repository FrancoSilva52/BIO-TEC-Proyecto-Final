import { PacienteHistorialComponents } from './componentes/pacienteHistorial.components';
import type { HistorialPacientesPageProps } from './types/historialPacientesPageProps.type';

export const HistorialPacientesPage = ({ doctorId }: HistorialPacientesPageProps) => (
  <PacienteHistorialComponents doctorId={doctorId} />
);
