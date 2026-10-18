export type EstadoAnalisis = 'Disponible' | 'En proceso';

export interface ResultadoAnalisis {
  parametro: string;
  resultado: string;
  unidad: string;
  referencia: string;
}

export interface AnalisisClinico {
  id: string;
  patientId: string;
  fecha: string;
  plantilla: string;
  versionPlantilla: string;
  estado: EstadoAnalisis;
  resultados: ResultadoAnalisis[];
}