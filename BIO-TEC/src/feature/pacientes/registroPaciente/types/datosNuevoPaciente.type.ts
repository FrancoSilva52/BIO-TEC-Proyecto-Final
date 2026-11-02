import type { SexoPaciente } from '../../perfilPaciente/types/sexoPaciente.type';

export type DatosNuevoPaciente = {
  doctorId: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  sexo: SexoPaciente;
  telefono: string;
  localidad: string;
  provincia: string;
  obraSocial: string;
  grupoSanguineo: string;
  puedeDonarSangre: boolean;
  observaciones: string;
};