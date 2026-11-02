import type { DatosNuevoPaciente } from './datosNuevoPaciente.type';

export type ValoresFormularioPaciente = Omit<DatosNuevoPaciente, 'doctorId' | 'sexo'> & {
  sexo: DatosNuevoPaciente['sexo'] | '';
  poseeObraSocial: boolean;
};