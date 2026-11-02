import type { ParametroAnalisis } from './parametroAnalisis.type';

export type PlantillaAnalisis = {
  id: string;
  nombre: string;
  version: string;
  disponible: boolean;
  parametros: ParametroAnalisis[];
};