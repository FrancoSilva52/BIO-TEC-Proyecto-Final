import type { AnalisisClinico } from '../types/analisis.interface';

export const ANALISIS_DEMO: AnalisisClinico[] = [
  {
    id: 'analisis-demo-001',
    patientId: 'paciente-demo-001',
    fecha: '2025-10-08',
    plantilla: 'Hemograma completo',
    versionPlantilla: '1.0',
    estado: 'Disponible',
    resultados: [
      { parametro: 'Parámetro de demostración', resultado: 'Dato de muestra', unidad: '-', referencia: 'Sin referencia clínica' },
      { parametro: 'Resultado de ejemplo', resultado: 'No disponible', unidad: '-', referencia: 'Sin referencia clínica' },
    ],
  },
  {
    id: 'analisis-demo-002',
    patientId: 'paciente-demo-001',
    fecha: '2025-06-14',
    plantilla: 'Perfil bioquímico básico',
    versionPlantilla: '1.0',
    estado: 'Disponible',
    resultados: [
      { parametro: 'Parámetro de demostración', resultado: 'Dato de muestra', unidad: '-', referencia: 'Sin referencia clínica' },
    ],
  },
  {
    id: 'analisis-demo-003',
    patientId: 'paciente-demo-002',
    fecha: '2025-09-02',
    plantilla: 'Control de rutina',
    versionPlantilla: '1.0',
    estado: 'Disponible',
    resultados: [
      { parametro: 'Parámetro de demostración', resultado: 'Dato de muestra', unidad: '-', referencia: 'Sin referencia clínica' },
    ],
  },
  {
    id: 'analisis-demo-004',
    patientId: 'paciente-demo-003',
    fecha: '2025-10-01',
    plantilla: 'Análisis de ejemplo',
    versionPlantilla: '1.0',
    estado: 'En proceso',
    resultados: [],
  },
];