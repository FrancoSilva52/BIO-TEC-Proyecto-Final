import type { Paciente } from '../../pacientes/types/paciente.type';
import type { PlantillaAnalisis } from './plantillaAnalisis.type';

export type DiccionarioFormulariosComponentsProps = {
  plantilla: PlantillaAnalisis;
  paciente: Paciente;
  valores: Record<string, string>;
  alCambiarValor: (parametroId: string, valor: string) => void;
  alGuardar: () => void;
};