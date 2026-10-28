import type { AnalisisClinico } from '../../analisis/types/analisis.interface';

export interface AnalisisHistorial extends AnalisisClinico {
  patientDoctorId: string;
  pacienteNombre: string;
  pacienteApellido: string;
  localidad: string;
  provincia: string;
  doctor: string;
}
