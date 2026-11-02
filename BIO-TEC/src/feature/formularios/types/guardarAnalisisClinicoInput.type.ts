import type { ResultadoAnalisisParaGuardar } from './resultadoAnalisisParaGuardar.type';

export type GuardarAnalisisClinicoInput = {
  pacienteId: string;
  profesionalId: string;
  plantillaId: string;
  nombrePlantilla: string;
  versionPlantilla: string;
  resultados: ResultadoAnalisisParaGuardar[];
};