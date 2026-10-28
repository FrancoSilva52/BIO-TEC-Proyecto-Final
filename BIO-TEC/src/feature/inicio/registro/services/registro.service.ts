import { getDatabase } from '../../../../lib/database';
import { createPasswordCredentials } from '../../login/services/auth.service';

export type RegistroMedicoInput = {
  nombre: string;
  apellido: string;
  dni: string;
  area: string;
  telefono: string;
  email: string;
  profilePhotoDataUrl: string;
  password: string;
};

export class DatosMedicoDuplicadosError extends Error {
  constructor() {
    super('El correo electrónico o DNI ya está registrado.');
    this.name = 'DatosMedicoDuplicadosError';
  }
}

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
        password_iterations, email, dni, phone, area, profile_photo_data_url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
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
