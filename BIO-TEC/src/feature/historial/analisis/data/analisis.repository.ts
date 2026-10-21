import { getDatabase } from '../../../../lib/database';
import type { AnalisisClinico, ResultadoAnalisis } from '../types/analisis.interface';

type AnalysisResultRow = {
  analysis_id: string;
  patient_id: string;
  fecha: string;
  plantilla_nombre: string;
  plantilla_version: string;
  estado: AnalisisClinico['estado'];
  parametro: string | null;
  resultado: string | null;
  unidad: string | null;
  rango_referencia: string | null;
};

export const listAnalysesByPatient = async (
  patientId: string,
  doctorId: string,
): Promise<AnalisisClinico[]> => {
  const database = await getDatabase();
  const rows = await database.select<AnalysisResultRow[]>(
    `SELECT a.id AS analysis_id, a.patient_id, a.fecha, a.plantilla_nombre,
            a.plantilla_version, a.estado, r.parametro, r.resultado, r.unidad,
            r.rango_referencia
     FROM clinical_analyses a
     JOIN patients p ON p.id = a.patient_id
     LEFT JOIN analysis_results r ON r.analysis_id = a.id
     WHERE a.patient_id = $1 AND p.doctor_id = $2
     ORDER BY a.fecha DESC, r.id`,
    [patientId, doctorId],
  );

  const analysesById = new Map<string, AnalisisClinico>();

  for (const row of rows) {
    let analysis = analysesById.get(row.analysis_id);
    if (!analysis) {
      analysis = {
        id: row.analysis_id,
        patientId: row.patient_id,
        fecha: row.fecha,
        plantilla: row.plantilla_nombre,
        versionPlantilla: row.plantilla_version,
        estado: row.estado,
        resultados: [],
      };
      analysesById.set(row.analysis_id, analysis);
    }

    if (row.parametro !== null) {
      const result: ResultadoAnalisis = {
        parametro: row.parametro,
        resultado: row.resultado ?? '',
        unidad: row.unidad ?? '',
        referencia: row.rango_referencia ?? '',
      };
      analysis.resultados.push(result);
    }
  }

  return [...analysesById.values()];
};