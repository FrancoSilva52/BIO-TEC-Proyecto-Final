import type { SexoPaciente } from './sexoPaciente.type';

export type PatientRow = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  sexo: SexoPaciente | null;
  telefono: string;
  localidad: string;
  provincia: string;
  obra_social: string;
  grupo_sanguineo: string;
  puede_donar_sangre: number;
  observaciones: string;
  created_at: string;
};