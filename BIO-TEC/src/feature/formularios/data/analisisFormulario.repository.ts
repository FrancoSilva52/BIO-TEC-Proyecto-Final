import { getDatabase } from '../../../lib/database';

type ResultadoAnalisisParaGuardar = {
  parametro: string;
  resultado: string;
  unidad: string;
  referencia: string;
};

type GuardarAnalisisClinicoInput = {
  pacienteId: string;
  profesionalId: string;
  plantillaId: string;
  nombrePlantilla: string;
  versionPlantilla: string;
  resultados: ResultadoAnalisisParaGuardar[];
};

export const guardarAnalisisClinico = async ({
  pacienteId,
  profesionalId,
  plantillaId,
  nombrePlantilla,
  versionPlantilla,
  resultados,
}: GuardarAnalisisClinicoInput): Promise<void> => {
  const resultadosCompletos = resultados.filter((resultado) => resultado.resultado.trim());
  if (resultadosCompletos.length === 0) {
    throw new Error('El análisis debe contener al menos un resultado.');
  }

  const baseDatos = await getDatabase();
  const pacientesAutorizados = await baseDatos.select<{ id: string }[]>(
    'SELECT id FROM patients WHERE id = $1 AND doctor_id = $2 LIMIT 1',
    [pacienteId, profesionalId],
  );
  const plantillasActivas = await baseDatos.select<{ id: string }[]>(
    'SELECT id FROM analysis_templates WHERE id = $1 AND activa = 1 LIMIT 1',
    [plantillaId],
  );

  if (pacientesAutorizados.length === 0) {
    throw new Error('El paciente no pertenece al profesional autenticado.');
  }
  if (plantillasActivas.length === 0) {
    throw new Error('La plantilla seleccionada no está disponible.');
  }

  const analisisId = crypto.randomUUID();
  const fecha = new Date().toISOString().slice(0, 10);
  let analisisCreado = false;

  try {
    await baseDatos.execute(
      `INSERT INTO clinical_analyses (
        id, patient_id, template_id, performed_by_user_id, fecha,
        plantilla_nombre, plantilla_version, estado, descripcion
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        analisisId,
        pacienteId,
        plantillaId,
        profesionalId,
        fecha,
        nombrePlantilla,
        versionPlantilla,
        'Disponible',
        'Análisis registrado desde el formulario local.',
      ],
    );
    analisisCreado = true;

    for (const [indice, resultado] of resultadosCompletos.entries()) {
      await baseDatos.execute(
        `INSERT INTO analysis_results (
          id, analysis_id, parametro, resultado, unidad, rango_referencia, descripcion
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          `${analisisId}-resultado-${String(indice + 1).padStart(3, '0')}`,
          analisisId,
          resultado.parametro,
          resultado.resultado.trim(),
          resultado.unidad,
          resultado.referencia,
          '',
        ],
      );
    }
  } catch (error) {
    if (analisisCreado) {
      try {
        await baseDatos.execute(
          'DELETE FROM analysis_results WHERE analysis_id = $1',
          [analisisId],
        );
        await baseDatos.execute('DELETE FROM clinical_analyses WHERE id = $1', [analisisId]);
      } catch (errorReversion) {
        console.error('No se pudo limpiar el análisis incompleto:', errorReversion);
      }
    }
    throw error;
  }
};