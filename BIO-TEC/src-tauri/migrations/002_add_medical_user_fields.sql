ALTER TABLE users ADD COLUMN email TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN dni TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN phone TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN area TEXT NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN profile_photo_data_url TEXT NOT NULL DEFAULT '';

UPDATE users
SET email = 'usuario@demo.local',
    dni = 'TEST-USER-0000',
    area = 'Demostración'
WHERE username = 'usuario';

CREATE UNIQUE INDEX idx_users_email
  ON users (email COLLATE NOCASE)
  WHERE email <> '';

CREATE UNIQUE INDEX idx_users_dni
  ON users (dni COLLATE NOCASE)
  WHERE dni <> '';
