import type { AnalisisClinico } from './analisisClinico.type';

export type AnalisisResultadoFila = {
  analysis_id: string;
  patient_id: string;
  fecha: string;
  plantilla_nombre: string;
  plantilla_version: string;
  estado: AnalisisClinico['estado'];
  parametro: string | null;
  resultado: string | null;
  unidad: string | null;
  rango_referencia: string | null;
};