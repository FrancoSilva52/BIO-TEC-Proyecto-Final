import type { AnalisisClinico } from '../../analisis/types/analisisClinico.type';

export interface AnalisisHistorial extends AnalisisClinico {
  patientDoctorId: string;
  pacienteNombre: string;
  pacienteApellido: string;
  localidad: string;
  provincia: string;
  doctor: string;
}