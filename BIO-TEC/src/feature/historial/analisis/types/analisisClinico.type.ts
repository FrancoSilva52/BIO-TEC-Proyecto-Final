import type { EstadoAnalisis } from './estadoAnalisis.type';
import type { ResultadoAnalisis } from './resultadoAnalisis.type';

export interface AnalisisClinico {
  id: string;
  patientId: string;
  fecha: string;
  plantilla: string;
  versionPlantilla: string;
  estado: EstadoAnalisis;
  resultados: ResultadoAnalisis[];
}