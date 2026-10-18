export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fechaNacimiento: string;
  telefono: string;
  localidad: string;
  provincia: string;
  obraSocial: string;
  grupoSanguineo: string;
  puedeDonarSangre: boolean;
  observaciones: string;
  createdAt: string;
};