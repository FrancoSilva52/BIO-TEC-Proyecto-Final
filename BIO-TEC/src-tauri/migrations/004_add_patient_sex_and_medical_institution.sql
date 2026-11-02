ALTER TABLE patients
ADD COLUMN sexo TEXT CHECK (sexo IN ('Masculino', 'Femenino', 'Otro'));

ALTER TABLE users
ADD COLUMN institution TEXT NOT NULL DEFAULT '';