import { FormEvent, useEffect, useRef, useState } from 'react';
import { Alert, Badge, Button, Modal, Table, Text, TextInput } from '@mantine/core';
import { Eye, Printer, Search } from 'lucide-react';
import { listAnalysesByPatient } from '../services/analisis.repository';
import type { AnalisisClinico } from '../types/analisisClinico.type';
import { obtenerDatosProfesionalImpresion } from '../../../formularios/services/analisisFormulario.repository';
import {
  imprimirAnalisis as imprimirDocumentoAnalisis,
  prepararSeccionesImpresion,
} from '../../../formularios/services/imprimirAnalisis.service';
import { HojaImpresionAnalisisComponents } from '../../../formularios/componentes/hojaImpresionAnalisis.components';
import { formateoDia } from '../../../../const/formateo.const';
import '../../../../styles/historial/analisisPaciente.css';
import { AnalisisPacienteProps } from '../types/analisisPacienteProps.type';

export const AnalisisPacienteComponent = ({
  patientId,
  doctorId,
  nombrePaciente,
  onCreateAnalysis,
}: AnalisisPacienteProps) => {
  const [analysesFromDatabase, setAnalysesFromDatabase] = useState<AnalisisClinico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalisisClinico | null>(null);
  const [datosProfesional, setDatosProfesional] = useState({
    institucion: 'Análisis Clínicos de Salud',
    nombre: 'No informado',
  });
  const hojaImpresionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrent = true;
    setAnalysesFromDatabase([]);
    setLoadError('');
    setIsLoading(true);

    listAnalysesByPatient(patientId, doctorId)
      .then((loadedAnalyses) => {
        if (isCurrent) setAnalysesFromDatabase(loadedAnalyses);
      })
      .catch((error: unknown) => {
        console.error('No se pudieron cargar los análisis:', error);
        if (isCurrent) setLoadError('No se pudo cargar el historial desde la base local.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [doctorId, patientId]);

  useEffect(() => {
    let isCurrent = true;
    obtenerDatosProfesionalImpresion(doctorId)
      .then((datos) => {
        if (isCurrent) setDatosProfesional(datos);
      })
      .catch((error: unknown) => {
        console.error('No se pudieron cargar los datos profesionales para imprimir:', error);
      });

    return () => {
      isCurrent = false;
    };
  }, [doctorId]);

  const analyses = analysesFromDatabase
    .filter((analysis) =>
      `${analysis.plantilla} ${analysis.fecha} ${analysis.estado}`
        .toLocaleLowerCase('es')
        .includes(submittedQuery.trim().toLocaleLowerCase('es')),
    )
    .sort((first, second) => second.fecha.localeCompare(first.fecha));

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedQuery(query);
  };

  return (
    <section className="patient-analysis" aria-labelledby="patient-analysis-title">
      <div className="patient-analysis__toolbar">
        <form className="patient-analysis__search" onSubmit={handleSearch} role="search">
          <TextInput
            label="Buscar análisis"
            placeholder="Plantilla o fecha"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            autoComplete="off"
          />
          <Button type="submit" leftSection={<Search size={16} aria-hidden="true" />}>
            Buscar
          </Button>
        </form>
        <Button className="patient-analysis__new" onClick={onCreateAnalysis}>
          Nuevo análisis clínico
        </Button>
      </div>

      <div className="patient-analysis__heading">
        <div>
          <h2 id="patient-analysis-title">Análisis clínicos</h2>
          <Text size="sm" c="dimmed">
            {analyses.length} {analyses.length === 1 ? 'registro' : 'registros'}
          </Text>
        </div>
      </div>

      {loadError && <Alert color="red" mb="md">{loadError}</Alert>}

      <div className="patient-analysis__table-wrap">
        <Table.ScrollContainer minWidth={650} type="native">
          <Table className="patient-analysis__table" highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Plantilla</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th className="patient-analysis__actions-heading">Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {analyses.map((analysis) => (
                <Table.Tr key={analysis.id}>
                  <Table.Td>{formateoDia(analysis.fecha)}</Table.Td>
                  <Table.Td className="patient-analysis__template">
                    {analysis.plantilla}
                    <Text component="span" size="xs" c="dimmed">
                      {' '}(v{analysis.versionPlantilla})
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Badge
                      variant="light"
                      color={analysis.estado === 'Disponible' ? 'blue' : 'gray'}
                    >
                      {analysis.estado}
                    </Badge>
                  </Table.Td>
                  <Table.Td className="patient-analysis__actions-cell">
                    <Button
                      variant="light"
                      size="xs"
                      leftSection={<Eye size={15} aria-hidden="true" />}
                      onClick={() => setSelectedAnalysis(analysis)}
                    >
                      Ver análisis
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
              {analyses.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={4}>
                    <div className="patient-analysis__empty">
                      <Text fw={600}>
                        {isLoading ? 'Cargando análisis…' : 'No hay análisis para mostrar'}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {isLoading
                          ? 'Consultando la base de datos local.'
                          : submittedQuery
                            ? 'Probá con otra plantilla o fecha.'
                            : 'Los análisis registrados para este paciente aparecerán acá.'}
                      </Text>
                    </div>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>

      <Modal
        opened={selectedAnalysis !== null}
        onClose={() => setSelectedAnalysis(null)}
        title={selectedAnalysis?.plantilla ?? 'Resultado del análisis'}
        centered
        size="xl"
        classNames={{ content: 'patient-analysis__modal-content', body: 'analysis-print-modal-body' }}
      >
        {selectedAnalysis && (
          <>
            <div ref={hojaImpresionRef} className="patient-analysis__printable analysis-print-preview">
              <HojaImpresionAnalisisComponents
                analisis={{
                  institucion: datosProfesional.institucion,
                  paciente: nombrePaciente,
                  profesional: datosProfesional.nombre,
                  fecha: formateoDia(selectedAnalysis.fecha),
                  plantilla: selectedAnalysis.plantilla,
                  secciones: prepararSeccionesImpresion(
                    selectedAnalysis.plantilla,
                    selectedAnalysis.resultados,
                  ),
                }}
              />
              <Alert className="patient-analysis__demo-warning" color="blue" variant="light">
                Valores de muestra sin validez clínica. No utilizar para diagnóstico ni tratamiento.
              </Alert>
              {selectedAnalysis.resultados.length === 0 && (
                <Text className="patient-analysis__processing" c="dimmed">
                  Este análisis todavía está en proceso y no tiene resultados disponibles.
                </Text>
              )}
            </div>
            <div className="patient-analysis__modal-actions">
              <Button
                leftSection={<Printer size={16} aria-hidden="true" />}
                disabled={selectedAnalysis.estado !== 'Disponible'}
                onClick={() => imprimirDocumentoAnalisis(
                  hojaImpresionRef.current?.querySelector<HTMLElement>('.analysis-print-sheet') ?? null,
                )}
              >
                Imprimir
              </Button>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
};