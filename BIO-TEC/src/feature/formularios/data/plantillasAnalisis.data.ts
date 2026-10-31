export type ParametroAnalisis = {
  id: string;
  nombre: string;
  seccion: string;
  unidad: string;
  referencia: string;
  tipo: 'numero' | 'texto';
};

export type PlantillaAnalisis = {
  id: string;
  nombre: string;
  version: string;
  disponible: boolean;
  parametros: ParametroAnalisis[];
};

const referenciaNoIndicada = 'No indicada en el informe';

export const plantillasAnalisis: PlantillaAnalisis[] = [
  {
    id: 'orina-completa',
    nombre: 'Orina completa',
    version: '1.0',
    disponible: true,
    parametros: [
      { id: 'color', nombre: 'Color', seccion: 'Examen físico', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
      { id: 'aspecto', nombre: 'Aspecto', seccion: 'Examen físico', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
      { id: 'densidad', nombre: 'Densidad', seccion: 'Examen físico', unidad: '', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'ph', nombre: 'pH', seccion: 'Examen físico', unidad: '', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'proteinas', nombre: 'Proteínas', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'glucosa', nombre: 'Glucosa', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'cetonas', nombre: 'Cetonas', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'bilirrubina', nombre: 'Bilirrubina', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'urobilinogeno', nombre: 'Urobilinógeno', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'hemoglobina-orina', nombre: 'Hemoglobina', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'nitritos', nombre: 'Nitritos', seccion: 'Examen químico', unidad: '', referencia: 'No contiene', tipo: 'texto' },
      { id: 'sedimento', nombre: 'Sedimento / células epiteliales', seccion: 'Sedimento', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
      { id: 'observaciones-orina', nombre: 'Observaciones', seccion: 'Sedimento', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
    ],
  },
  {
    id: 'examen-quimico-basico',
    nombre: 'Examen químico básico',
    version: '1.0',
    disponible: true,
    parametros: [
      { id: 'glucemia', nombre: 'Glucemia', seccion: 'Química básica', unidad: 'mg%', referencia: '70–100', tipo: 'numero' },
      { id: 'urea', nombre: 'Urea', seccion: 'Química básica', unidad: 'mg%', referencia: '10–50', tipo: 'numero' },
      { id: 'colesterol', nombre: 'Colesterol', seccion: 'Química básica', unidad: 'mg%', referencia: 'Hasta 200', tipo: 'numero' },
      { id: 'uricemia', nombre: 'Uricemia', seccion: 'Química básica', unidad: 'mg%', referencia: 'H: 2,5–6,0; M: 2,5–5,0', tipo: 'numero' },
      { id: 'trigliceridos', nombre: 'Triglicéridos', seccion: 'Química básica', unidad: 'mg%', referencia: 'Deseable: menor de 150', tipo: 'numero' },
      { id: 'calcemia', nombre: 'Calcemia', seccion: 'Química básica', unidad: 'mg%', referencia: '8,5–10,5', tipo: 'numero' },
      { id: 'creatinina', nombre: 'Creatinina', seccion: 'Función renal', unidad: 'mg/l', referencia: 'H: 7–13; M: 6–11', tipo: 'numero' },
      { id: 'got', nombre: 'GOT (AST)', seccion: 'Enzimas', unidad: 'U/l', referencia: 'H: hasta 38; M: hasta 32', tipo: 'numero' },
      { id: 'gpt', nombre: 'GPT (ALT)', seccion: 'Enzimas', unidad: 'U/l', referencia: 'H: hasta 41; M: hasta 31', tipo: 'numero' },
      { id: 'fosfatasa-alcalina', nombre: 'Fosfatasa alcalina', seccion: 'Enzimas', unidad: 'U/l', referencia: 'Adultos: 65–300; referencia pediátrica no legible', tipo: 'numero' },
      { id: 'bilirrubina-directa', nombre: 'Bilirrubina directa', seccion: 'Bilirrubinas', unidad: 'mg%', referencia: 'Hasta 2', tipo: 'numero' },
      { id: 'bilirrubina-indirecta', nombre: 'Bilirrubina indirecta', seccion: 'Bilirrubinas', unidad: 'mg%', referencia: 'Hasta 10', tipo: 'numero' },
      { id: 'bilirrubina-total', nombre: 'Bilirrubina total', seccion: 'Bilirrubinas', unidad: 'mg%', referencia: 'Hasta 125 (suero/plasma)', tipo: 'numero' },
      { id: 'amilasa', nombre: 'Amilasa', seccion: 'Enzimas', unidad: 'U/l', referencia: '230–460', tipo: 'numero' },
      { id: 'ldh', nombre: 'LDH', seccion: 'Enzimas', unidad: 'U/l', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'gamma-gt', nombre: 'Gamma GT', seccion: 'Enzimas', unidad: 'U/l', referencia: 'H: 11–50; M: 7–32', tipo: 'numero' },
      { id: 'albumina', nombre: 'Albúmina', seccion: 'Proteínas', unidad: 'g/dl', referencia: '3,5–4,8', tipo: 'numero' },
      { id: 'proteinas-totales', nombre: 'Proteínas totales', seccion: 'Proteínas', unidad: 'g/dl', referencia: '6,1–7,9', tipo: 'numero' },
      { id: 'hdl', nombre: 'HDL colesterol', seccion: 'Lípidos', unidad: 'mg%', referencia: 'Mayor de 40', tipo: 'numero' },
      { id: 'ldl', nombre: 'LDL colesterol', seccion: 'Lípidos', unidad: 'mg%', referencia: 'Menor de 130', tipo: 'numero' },
      { id: 'cpk', nombre: 'CPK', seccion: 'Enzimas', unidad: 'U/l', referencia: 'Varones: hasta 195; mujeres: hasta 170', tipo: 'numero' },
      { id: 'observaciones-quimica', nombre: 'Observaciones', seccion: 'Otros', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
    ],
  },
  {
    id: 'hemograma',
    nombre: 'Hemograma',
    version: '1.0',
    disponible: true,
    parametros: [
      { id: 'hematies', nombre: 'Hematíes', seccion: 'Serie roja', unidad: '/mm³', referencia: 'M: 3.600.000–5.000.000; H: 4.500.000–5.500.000', tipo: 'numero' },
      { id: 'hemoglobina', nombre: 'Hemoglobina', seccion: 'Serie roja', unidad: 'g/dl', referencia: '12–16', tipo: 'numero' },
      { id: 'hematocrito', nombre: 'Hematocrito', seccion: 'Serie roja', unidad: '%', referencia: 'H: 42–52; M: 37–48', tipo: 'numero' },
      { id: 'vcm', nombre: 'V.C.M.', seccion: 'Índices hematimétricos', unidad: 'fl', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'hcm', nombre: 'H.C.M.', seccion: 'Índices hematimétricos', unidad: 'pg', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'chcm', nombre: 'C.H.C.M.', seccion: 'Índices hematimétricos', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'leucocitos', nombre: 'Leucocitos', seccion: 'Serie blanca', unidad: '/mm³', referencia: '5.000–9.000', tipo: 'numero' },
      { id: 'neutrofilos-cayados', nombre: 'Neutrófilos en cayados', seccion: 'Fórmula leucocitaria', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'neutrofilos', nombre: 'Neutrófilos', seccion: 'Fórmula leucocitaria', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'eosinofilos', nombre: 'Eosinófilos', seccion: 'Fórmula leucocitaria', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'basofilos', nombre: 'Basófilos', seccion: 'Fórmula leucocitaria', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'linfocitos', nombre: 'Linfocitos', seccion: 'Fórmula leucocitaria', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'monocitos', nombre: 'Monocitos', seccion: 'Fórmula leucocitaria', unidad: '%', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'eritrosedimentacion-primera-hora', nombre: 'Eritrosedimentación, primera hora', seccion: 'Otros parámetros', unidad: 'mm', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'eritrosedimentacion-segunda-hora', nombre: 'Eritrosedimentación, segunda hora', seccion: 'Otros parámetros', unidad: 'mm', referencia: referenciaNoIndicada, tipo: 'numero' },
      { id: 'proteina-c-reactiva', nombre: 'Proteína C reactiva (látex)', seccion: 'Otros parámetros', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
      { id: 'plaquetas', nombre: 'Plaquetas', seccion: 'Otros parámetros', unidad: '/mm³', referencia: '150.000–400.000', tipo: 'numero' },
      { id: 'observaciones-hemograma', nombre: 'Observaciones', seccion: 'Otros parámetros', unidad: '', referencia: referenciaNoIndicada, tipo: 'texto' },
    ],
  },
  {
    id: 'coagulograma-basico',
    nombre: 'Coagulograma básico',
    version: '1.0',
    disponible: false,
    parametros: [],
  },
];