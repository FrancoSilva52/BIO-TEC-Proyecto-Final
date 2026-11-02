import type { ParametroAnalisis } from './parametroAnalisis.type';

export type ParametrosFormularioProps = {
  parametros: ParametroAnalisis[];
  valores: Record<string, string>;
  alCambiarValor: (parametroId: string, valor: string) => void;
  alGuardar: () => void;
};