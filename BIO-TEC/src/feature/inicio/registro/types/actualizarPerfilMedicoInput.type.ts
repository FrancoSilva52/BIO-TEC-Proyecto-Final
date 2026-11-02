export type ActualizarPerfilMedicoInput = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  area: string;
  institucion: string;
  telefono: string;
  email: string;
  profilePhotoDataUrl: string;
  password?: string;
};