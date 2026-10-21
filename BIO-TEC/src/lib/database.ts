import Database from '@tauri-apps/plugin-sql';

const DATABASE_URL = 'sqlite:bio_tec.db';

let databasePromise: Promise<Database> | undefined;

export const getDatabase = () => {
  databasePromise ??= Database.load(DATABASE_URL).catch((error: unknown) => {
    databasePromise = undefined;
    throw error;
  });

  return databasePromise;
};