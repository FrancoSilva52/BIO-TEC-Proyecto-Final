import { getDatabase } from '../../../../lib/database';
import type { DatosNuevoPaciente } from '../../registroPaciente/types/datosNuevoPaciente.type';
import type { Paciente } from '../types/paciente.type';
import type { PatientRow } from '../types/patientRow.type';

const mapPatient = (row: PatientRow): Paciente => ({
  id: row.id,
  nombre: row.nombre,
  apellido: row.apellido,
  dni: row.dni,
  fechaNacimiento: row.fecha_nacimiento,
  sexo: row.sexo,
  telefono: row.telefono,
  localidad: row.localidad,
  provincia: row.provincia,
  obraSocial: row.obra_social,
  grupoSanguineo: row.grupo_sanguineo,
  puedeDonarSangre: row.puede_donar_sangre === 1,
  observaciones: row.observaciones,
  createdAt: row.created_at,
});

const normalizarDni = (dni: string) => dni.replace(/[^a-zA-Z0-9]/g, '').toLocaleUpperCase('es');

export const crearPaciente = async (datos: DatosNuevoPaciente): Promise<Paciente> => {
  const database = await getDatabase();
  const dni = normalizarDni(datos.dni);
  const pacientesExistentes = await database.select<{ dni: string }[]>(
    'SELECT dni FROM patients WHERE doctor_id = $1',
    [datos.doctorId],
  );

  if (!dni || pacientesExistentes.some((paciente) => normalizarDni(paciente.dni) === dni)) {
    throw new Error('DUPLICATE_DNI');
  }

  const paciente: Paciente = {
    id: crypto.randomUUID(),
    nombre: datos.nombre.trim(),
    apellido: datos.apellido.trim(),
    dni,
    fechaNacimiento: datos.fechaNacimiento,
    sexo: datos.sexo,
    telefono: datos.telefono.trim(),
    localidad: datos.localidad.trim(),
    provincia: datos.provincia.trim(),
    obraSocial: datos.obraSocial.trim(),
    grupoSanguineo: datos.grupoSanguineo.trim(),
    puedeDonarSangre: datos.puedeDonarSangre,
    observaciones: datos.observaciones.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    await database.execute(
      `INSERT INTO patients (
         id, doctor_id, nombre, apellido, dni, fecha_nacimiento, sexo, telefono,
         localidad, provincia, obra_social, grupo_sanguineo, puede_donar_sangre,
         observaciones, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
      [
        paciente.id,
        datos.doctorId,
        paciente.nombre,
        paciente.apellido,
        paciente.dni,
        paciente.fechaNacimiento,
        paciente.sexo,
        paciente.telefono,
        paciente.localidad,
        paciente.provincia,
        paciente.obraSocial,
        paciente.grupoSanguineo,
        Number(paciente.puedeDonarSangre),
        paciente.observaciones,
        paciente.createdAt,
      ],
    );
  } catch (error) {
    const mensajeError = error instanceof Error ? error.message : String(error);
    if (mensajeError.includes('UNIQUE constraint failed: patients.doctor_id, patients.dni')) {
      throw new Error('DUPLICATE_DNI');
    }
    throw error;
  }

  return paciente;
};

export const actualizarPaciente = async (
  pacienteId: string,
  datos: DatosNuevoPaciente,
): Promise<Paciente> => {
  const database = await getDatabase();
  const dni = normalizarDni(datos.dni);
  const pacientesExistentes = await database.select<{ dni: string }[]>(
    'SELECT dni FROM patients WHERE doctor_id = $1 AND id <> $2',
    [datos.doctorId, pacienteId],
  );

  if (!dni || pacientesExistentes.some((paciente) => normalizarDni(paciente.dni) === dni)) {
    throw new Error('DUPLICATE_DNI');
  }

  try {
    const resultado = await database.execute(
      `UPDATE patients SET
         nombre = $1, apellido = $2, dni = $3, fecha_nacimiento = $4, sexo = $5,
         telefono = $6, localidad = $7, provincia = $8, obra_social = $9,
         grupo_sanguineo = $10, puede_donar_sangre = $11, observaciones = $12
       WHERE id = $13 AND doctor_id = $14`,
      [
        datos.nombre.trim(),
        datos.apellido.trim(),
        dni,
        datos.fechaNacimiento,
        datos.sexo,
        datos.telefono.trim(),
        datos.localidad.trim(),
        datos.provincia.trim(),
        datos.obraSocial.trim(),
        datos.grupoSanguineo.trim(),
        Number(datos.puedeDonarSangre),
        datos.observaciones.trim(),
        pacienteId,
        datos.doctorId,
      ],
    );

    if (resultado.rowsAffected === 0) throw new Error('PATIENT_NOT_FOUND');
  } catch (error) {
    const mensajeError = error instanceof Error ? error.message : String(error);
    if (mensajeError.includes('UNIQUE constraint failed: patients.doctor_id, patients.dni')) {
      throw new Error('DUPLICATE_DNI');
    }
    throw error;
  }

  const pacienteActualizado = await getPatientById(pacienteId, datos.doctorId);
  if (!pacienteActualizado) throw new Error('PATIENT_NOT_FOUND');
  return pacienteActualizado;
};

export const listPatients = async (doctorId: string): Promise<Paciente[]> => {
  const database = await getDatabase();
  const rows = await database.select<PatientRow[]>(
    `SELECT id, nombre, apellido, dni, fecha_nacimiento, sexo, telefono, localidad,
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
    `SELECT id, nombre, apellido, dni, fecha_nacimiento, sexo, telefono, localidad,
            provincia, obra_social, grupo_sanguineo, puede_donar_sangre,
            observaciones, created_at
     FROM patients
     WHERE id = $1 AND doctor_id = $2
     LIMIT 1`,
    [patientId, doctorId],
  );

  return rows[0] ? mapPatient(rows[0]) : null;
};