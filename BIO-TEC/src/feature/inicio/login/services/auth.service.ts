import { getDatabase } from '../../../../lib/database';

export interface AuthenticatedUser {
  id: string;
  username: string;
  fullName: string;
}

type UserCredentialRow = {
  id: string;
  username: string;
  full_name: string;
  password_hash: string;
  password_salt: string;
  password_iterations: number;
  is_active: number;
};

const hexToBytes = (value: string) => {
  const bytes = new Uint8Array(value.length / 2);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Number.parseInt(value.slice(index * 2, index * 2 + 2), 16);
  }
  return bytes;
};

const derivePasswordHash = async (password: string, salt: Uint8Array, iterations: number) => {
  const saltBuffer = new ArrayBuffer(salt.byteLength);
  new Uint8Array(saltBuffer).set(salt);
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBuffer, iterations, hash: 'SHA-256' },
    key,
    256,
  );

  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hashesMatch = (first: string, second: string) => {
  if (first.length !== second.length) return false;

  let difference = 0;
  for (let index = 0; index < first.length; index += 1) {
    difference |= first.charCodeAt(index) ^ second.charCodeAt(index);
  }

  return difference === 0;
};

export const authenticateUser = async (
  username: string,
  password: string,
): Promise<AuthenticatedUser | null> => {
  const database = await getDatabase();
  const users = await database.select<UserCredentialRow[]>(
    `SELECT id, username, full_name, password_hash, password_salt, password_iterations, is_active
     FROM users
     WHERE username = $1 COLLATE NOCASE
     LIMIT 1`,
    [username.trim()],
  );
  const user = users[0];

  if (!user || user.is_active !== 1) return null;

  const candidateHash = await derivePasswordHash(
    password,
    hexToBytes(user.password_salt),
    user.password_iterations,
  );

  if (!hashesMatch(candidateHash, user.password_hash)) return null;

  return { id: user.id, username: user.username, fullName: user.full_name };
};