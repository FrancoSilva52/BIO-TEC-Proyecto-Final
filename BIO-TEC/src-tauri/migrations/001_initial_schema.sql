CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL UNIQUE COLLATE NOCASE,
  full_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  password_iterations INTEGER NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE patients (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  nombre TEXT NOT NULL,
  apellido TEXT NOT NULL,
  dni TEXT NOT NULL,
  fecha_nacimiento TEXT NOT NULL,
  telefono TEXT NOT NULL DEFAULT '',
  localidad TEXT NOT NULL DEFAULT '',
  provincia TEXT NOT NULL DEFAULT '',
  obra_social TEXT NOT NULL DEFAULT '',
  grupo_sanguineo TEXT NOT NULL DEFAULT '',
  puede_donar_sangre INTEGER NOT NULL DEFAULT 0 CHECK (puede_donar_sangre IN (0, 1)),
  observaciones TEXT NOT NULL DEFAULT '',
  created_at TEXT NOT NULL,
  UNIQUE (doctor_id, dni)
);

CREATE INDEX idx_patients_doctor_name
  ON patients (doctor_id, apellido COLLATE NOCASE, nombre COLLATE NOCASE);

CREATE TABLE analysis_templates (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL DEFAULT '',
  version TEXT NOT NULL,
  activa INTEGER NOT NULL DEFAULT 1 CHECK (activa IN (0, 1)),
  UNIQUE (nombre, version)
);

CREATE TABLE clinical_analyses (
  id TEXT PRIMARY KEY,
  patient_id TEXT NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  template_id TEXT NOT NULL REFERENCES analysis_templates(id) ON DELETE RESTRICT,
  performed_by_user_id TEXT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  fecha TEXT NOT NULL,
  plantilla_nombre TEXT NOT NULL,
  plantilla_version TEXT NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('Disponible', 'En proceso')),
  descripcion TEXT NOT NULL DEFAULT ''
);

CREATE INDEX idx_clinical_analyses_patient_date
  ON clinical_analyses (patient_id, fecha DESC);

CREATE TABLE analysis_results (
  id TEXT PRIMARY KEY,
  analysis_id TEXT NOT NULL REFERENCES clinical_analyses(id) ON DELETE CASCADE,
  parametro TEXT NOT NULL,
  resultado TEXT NOT NULL,
  unidad TEXT NOT NULL DEFAULT '',
  rango_referencia TEXT NOT NULL DEFAULT '',
  descripcion TEXT NOT NULL DEFAULT ''
);

INSERT INTO users (
  id, username, full_name, description, password_hash, password_salt, password_iterations
) VALUES (
  'd9634d6a-9af6-4e36-9169-2eb2a20b7f31',
  'usuario',
  'Usuario de prueba',
  'Cuenta local de demostración',
  '4be193d37608b9b33d806bdffa798775c5f513083594e1cb18329f9494e13792',
  '4fece9dd65ec035c9b4b6f535d33d07b',
  310000
);

INSERT INTO analysis_templates (id, nombre, descripcion, version) VALUES
  ('template-demo-hemograma-v1', 'Hemograma completo', 'Plantilla ficticia para pruebas de interfaz.', '1.0'),
  ('template-demo-bioquimico-v1', 'Perfil bioquímico básico', 'Plantilla ficticia para pruebas de interfaz.', '1.0'),
  ('template-demo-rutina-v1', 'Control de rutina', 'Plantilla ficticia para pruebas de interfaz.', '1.0'),
  ('template-demo-ejemplo-v1', 'Análisis de ejemplo', 'Plantilla ficticia para pruebas de interfaz.', '1.0');

INSERT INTO patients (
  id, doctor_id, nombre, apellido, dni, fecha_nacimiento, telefono,
  localidad, provincia, obra_social, grupo_sanguineo, puede_donar_sangre,
  observaciones, created_at
) VALUES
  ('paciente-demo-001', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Lucía', 'Benítez', 'TEST-0001', '1992-04-18', '+54 11 5555-0101', 'La Plata', 'Buenos Aires', 'OSDE', 'A+', 1, 'Dato ficticio de demostración.', '2025-05-14T10:30:00.000Z'),
  ('paciente-demo-002', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Mateo', 'Cabrera', 'TEST-0002', '1987-11-03', '+54 341 5555-0102', 'Rosario', 'Santa Fe', 'IAPOS', 'O+', 0, 'Dato ficticio de demostración.', '2025-08-02T14:15:00.000Z'),
  ('paciente-demo-003', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Camila', 'Fernández', 'TEST-0003', '2001-06-22', '+54 351 5555-0103', 'Córdoba', 'Córdoba', 'Apross', 'B+', 0, 'Dato ficticio de demostración.', '2025-09-21T09:00:00.000Z'),
  ('paciente-demo-004', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Tomás', 'Giménez', 'TEST-0004', '1979-02-09', '+54 261 5555-0104', 'Mendoza', 'Mendoza', 'Swiss Medical', 'AB+', 0, 'Dato ficticio de demostración.', '2025-06-10T12:45:00.000Z'),
  ('paciente-demo-005', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Valentina', 'López', 'TEST-0005', '1995-09-30', '+54 381 5555-0105', 'San Miguel de Tucumán', 'Tucumán', 'Prevención Salud', 'O-', 0, 'Dato ficticio de demostración.', '2025-10-03T16:20:00.000Z'),
  ('paciente-demo-006', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Joaquín', 'Martínez', 'TEST-0006', '1968-12-14', '+54 223 5555-0106', 'Mar del Plata', 'Buenos Aires', 'PAMI', 'A-', 0, 'Dato ficticio de demostración.', '2025-04-28T11:10:00.000Z'),
  ('paciente-demo-007', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Mora', 'Pereyra', 'TEST-0007', '1999-01-27', '+54 299 5555-0107', 'Neuquén', 'Neuquén', 'OSPE', 'AB-', 0, 'Dato ficticio de demostración.', '2025-09-02T08:40:00.000Z'),
  ('paciente-demo-008', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', 'Santiago', 'Suárez', 'TEST-0008', '1983-07-11', '+54 387 5555-0108', 'Salta', 'Salta', 'Medifé', 'O+', 0, 'Dato ficticio de demostración.', '2025-07-19T13:05:00.000Z');

INSERT INTO clinical_analyses (
  id, patient_id, template_id, performed_by_user_id, fecha,
  plantilla_nombre, plantilla_version, estado, descripcion
) VALUES
  ('analisis-demo-001', 'paciente-demo-001', 'template-demo-hemograma-v1', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', '2025-10-08', 'Hemograma completo', '1.0', 'Disponible', 'Registro ficticio; no usar para decisiones clínicas.'),
  ('analisis-demo-002', 'paciente-demo-001', 'template-demo-bioquimico-v1', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', '2025-06-14', 'Perfil bioquímico básico', '1.0', 'Disponible', 'Registro ficticio; no usar para decisiones clínicas.'),
  ('analisis-demo-003', 'paciente-demo-002', 'template-demo-rutina-v1', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', '2025-09-02', 'Control de rutina', '1.0', 'Disponible', 'Registro ficticio; no usar para decisiones clínicas.'),
  ('analisis-demo-004', 'paciente-demo-003', 'template-demo-ejemplo-v1', 'd9634d6a-9af6-4e36-9169-2eb2a20b7f31', '2025-10-01', 'Análisis de ejemplo', '1.0', 'En proceso', 'Registro ficticio; no usar para decisiones clínicas.');

INSERT INTO analysis_results (
  id, analysis_id, parametro, resultado, unidad, rango_referencia, descripcion
) VALUES
  ('resultado-demo-001', 'analisis-demo-001', 'Parámetro de demostración', 'Dato de muestra', '-', 'Sin referencia clínica', 'Resultado ficticio.'),
  ('resultado-demo-002', 'analisis-demo-001', 'Resultado de ejemplo', 'No disponible', '-', 'Sin referencia clínica', 'Resultado ficticio.'),
  ('resultado-demo-003', 'analisis-demo-002', 'Parámetro de demostración', 'Dato de muestra', '-', 'Sin referencia clínica', 'Resultado ficticio.'),
  ('resultado-demo-004', 'analisis-demo-003', 'Parámetro de demostración', 'Dato de muestra', '-', 'Sin referencia clínica', 'Resultado ficticio.');