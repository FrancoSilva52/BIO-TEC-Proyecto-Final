import { getDatabase } from '../../../lib/database';
import type { Paciente } from '../type/paciente.interface';

type PatientRow = {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  fecha_nacimiento: string;
  telefono: string;
  localidad: string;
  provincia: string;
  obra_social: string;
  grupo_sanguineo: string;
  puede_donar_sangre: number;
  observaciones: string;
  created_at: string;
};

const mapPatient = (row: PatientRow): Paciente => ({
  id: row.id,
  nombre: row.nombre,
  apellido: row.apellido,
  dni: row.dni,
  fechaNacimiento: row.fecha_nacimiento,
  telefono: row.telefono,
  localidad: row.localidad,
  provincia: row.provincia,
  obraSocial: row.obra_social,
  grupoSanguineo: row.grupo_sanguineo,
  puedeDonarSangre: row.puede_donar_sangre === 1,
  observaciones: row.observaciones,
  createdAt: row.created_at,
});

export const listPatients = async (doctorId: string): Promise<Paciente[]> => {
  const database = await getDatabase();
  const rows = await database.select<PatientRow[]>(
    `SELECT id, nombre, apellido, dni, fecha_nacimiento, telefono, localidad,
            provincia, obra_social, grupo_sanguineo, puede_donar_sangre,
            observaciones, created_at
     FROM patients
     WHERE doctor_id = $1
     ORDER BY apellido COLLATE NOCASE, nombre COLLATE NOCASE`,
    [doctorId],
  );

  return rows.map(mapPatient);
};

export const getPatientById = async (
  patientId: string,
  doctorId: string,
): Promise<Paciente | null> => {
  const database = await getDatabase();
  const rows = await database.select<PatientRow[]>(
    `SELECT id, nombre, apellido, dni, fecha_nacimiento, telefono, localidad,
            provincia, obra_social, grupo_sanguineo, puede_donar_sangre,
            observaciones, created_at
     FROM patients
     WHERE id = $1 AND doctor_id = $2
     LIMIT 1`,
    [patientId, doctorId],
  );

  return rows[0] ? mapPatient(rows[0]) : null;
};