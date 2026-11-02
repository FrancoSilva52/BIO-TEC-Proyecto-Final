import type { SexoPaciente } from './sexoPaciente.type';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  sexo: SexoPaciente | null;
  telefono: string;
  localidad: string;
  provincia: string;
  obraSocial: string;
  grupoSanguineo: string;
  puedeDonarSangre: boolean;
  observaciones: string;
  createdAt: string;
}