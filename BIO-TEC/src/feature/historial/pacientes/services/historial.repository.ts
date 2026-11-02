import { getDatabase } from '../../../../lib/database';
import { ResultadoAnalisis } from '../../analisis/types/resultadoAnalisis.type';
import type { AnalisisHistorial } from '../types/analisisHistorial.type';
import type { AnalysisHistoryRow } from '../types/analysisHistoryRow.type';

export const listAnalysisHistory = async (): Promise<AnalisisHistorial[]> => {
  const database = await getDatabase();
  const rows = await database.select<AnalysisHistoryRow[]>(
    `SELECT a.id AS analysis_id, a.patient_id, p.doctor_id AS patient_doctor_id,
            p.nombre AS paciente_nombre, p.apellido AS paciente_apellido,
            p.localidad, p.provincia, u.full_name AS doctor, a.fecha,
            a.plantilla_nombre, a.plantilla_version, a.estado,
            r.parametro, r.resultado, r.unidad, r.rango_referencia
     FROM clinical_analyses a
     JOIN patients p ON p.id = a.patient_id
     JOIN users u ON u.id = a.performed_by_user_id
     LEFT JOIN analysis_results r ON r.analysis_id = a.id
     ORDER BY a.fecha DESC, p.apellido COLLATE NOCASE, p.nombre COLLATE NOCASE, r.id`,
  );

  const analysesById = new Map<string, AnalisisHistorial>();

  for (const row of rows) {
    let analysis = analysesById.get(row.analysis_id);
    if (!analysis) {
      analysis = {
        id: row.analysis_id,
        patientId: row.patient_id,
        patientDoctorId: row.patient_doctor_id,
        pacienteNombre: row.paciente_nombre,
        pacienteApellido: row.paciente_apellido,
        localidad: row.localidad,
        provincia: row.provincia,
        doctor: row.doctor,
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
