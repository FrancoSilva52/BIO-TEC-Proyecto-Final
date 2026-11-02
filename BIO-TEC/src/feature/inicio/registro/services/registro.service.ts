import { getDatabase } from '../../../../lib/database';
import { createPasswordCredentials } from '../../login/services/auth.service';
import type { AuthenticatedUser } from '../../login/types/authenticatedUser.type';
import type { ActualizarPerfilMedicoInput } from '../types/actualizarPerfilMedicoInput.type';
import type { FilaPerfilMedico } from '../types/filaPerfilMedico.type';
import type { PerfilMedico } from '../types/perfilMedico.type';
import type { RegistroMedicoInput } from '../types/registroMedicoInput.type';

export class DatosMedicoDuplicadosError extends Error {
  constructor() {
    super('El correo electrónico o DNI ya está registrado.');
    this.name = 'DatosMedicoDuplicadosError';
  }
}

export const obtenerPerfilMedico = async (medicoId: string): Promise<PerfilMedico | null> => {
  const database = await getDatabase();
  const filas = await database.select<FilaPerfilMedico[]>(
    `SELECT id, username, full_name, dni, area, institution, phone, email,
            profile_photo_data_url
     FROM users
     WHERE id = $1 AND is_active = 1
     LIMIT 1`,
    [medicoId],
  );
  const fila = filas[0];
  if (!fila) return null;

  const [nombre = '', ...partesApellido] = fila.full_name.trim().split(/\s+/);
  return {
    id: fila.id,
    nombre,
    apellido: partesApellido.join(' '),
    dni: fila.dni,
    area: fila.area,
    institucion: fila.institution,
    telefono: fila.phone,
    email: fila.email,
    profilePhotoDataUrl: fila.profile_photo_data_url,
  };
};

export const actualizarPerfilMedico = async (
  input: ActualizarPerfilMedicoInput,
): Promise<AuthenticatedUser> => {
  const database = await getDatabase();
  const email = input.email.trim().toLocaleLowerCase('es');
  const dni = input.dni.trim();
  const duplicados = await database.select<{ id: string }[]>(
    `SELECT id FROM users
     WHERE (email = $1 COLLATE NOCASE OR dni = $2 COLLATE NOCASE)
       AND id <> $3
     LIMIT 1`,
    [email, dni, input.id],
  );

  if (duplicados.length > 0) throw new DatosMedicoDuplicadosError();

  const nombreCompleto = `${input.nombre.trim()} ${input.apellido.trim()}`.trim();
  const password = input.password?.trim();

  try {
    if (password) {
      const credenciales = await createPasswordCredentials(password);
      await database.execute(
        `UPDATE users SET username = $1, full_name = $2, dni = $3, area = $4,
           institution = $5, phone = $6, email = $7, profile_photo_data_url = $8,
           password_hash = $9, password_salt = $10, password_iterations = $11
         WHERE id = $12 AND is_active = 1`,
        [
          email,
          nombreCompleto,
          dni,
          input.area.trim(),
          input.institucion.trim(),
          input.telefono.trim(),
          email,
          input.profilePhotoDataUrl,
          credenciales.passwordHash,
          credenciales.passwordSalt,
          credenciales.passwordIterations,
          input.id,
        ],
      );
    } else {
      await database.execute(
        `UPDATE users SET username = $1, full_name = $2, dni = $3, area = $4,
           institution = $5, phone = $6, email = $7, profile_photo_data_url = $8
         WHERE id = $9 AND is_active = 1`,
        [
          email,
          nombreCompleto,
          dni,
          input.area.trim(),
          input.institucion.trim(),
          input.telefono.trim(),
          email,
          input.profilePhotoDataUrl,
          input.id,
        ],
      );
    }
  } catch (error) {
    if (String(error).includes('UNIQUE constraint failed')) {
      throw new DatosMedicoDuplicadosError();
    }
    throw error;
  }

  return {
    id: input.id,
    username: email,
    fullName: nombreCompleto,
    profilePhotoDataUrl: input.profilePhotoDataUrl,
  };
};

export const registrarMedico = async (input: RegistroMedicoInput) => {
  const database = await getDatabase();
  const email = input.email.trim().toLocaleLowerCase('es');
  const dni = input.dni.trim();
  const duplicates = await database.select<{ id: string }[]>(
    `SELECT id FROM users
     WHERE email = $1 COLLATE NOCASE OR dni = $2 COLLATE NOCASE
     LIMIT 1`,
    [email, dni],
  );

  if (duplicates.length > 0) throw new DatosMedicoDuplicadosError();

  const credentials = await createPasswordCredentials(input.password);
  const fullName = `${input.nombre.trim()} ${input.apellido.trim()}`;

  try {
    await database.execute(
      `INSERT INTO users (
        id, username, full_name, description, password_hash, password_salt,
        password_iterations, email, dni, phone, area, institution, profile_photo_data_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        crypto.randomUUID(),
        email,
        fullName,
        input.area.trim(),
        credentials.passwordHash,
        credentials.passwordSalt,
        credentials.passwordIterations,
        email,
        dni,
        input.telefono.trim(),
        input.area.trim(),
        input.institucion.trim(),
        input.profilePhotoDataUrl,
      ],
    );
  } catch (error) {
    if (String(error).includes('UNIQUE constraint failed')) {
      throw new DatosMedicoDuplicadosError();
    }
    throw error;
  }
};
