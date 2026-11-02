import type { AnalisisHistorial } from './analisisHistorial.type';

export type AnalysisHistoryRow = {
  analysis_id: string;
  patient_id: string;
  patient_doctor_id: string;
  paciente_nombre: string;
  paciente_apellido: string;
  localidad: string;
  provincia: string;
  doctor: string;
  institucion: string;
  fecha: string;
  plantilla_nombre: string;
  plantilla_version: string;
  estado: AnalisisHistorial['estado'];
  parametro: string | null;
  resultado: string | null;
  unidad: string | null;
  rango_referencia: string | null;
};