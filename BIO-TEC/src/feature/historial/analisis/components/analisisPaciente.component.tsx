import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Modal, Table, Text, TextInput } from '@mantine/core';
import { Eye, Printer, Search } from 'lucide-react';
import { listAnalysesByPatient } from '../data/analisis.repository';
import type { AnalisisClinico } from '../types/analisis.interface';
import '../../../../styles/historial/analisisPaciente.css';
import { formateoDia } from '../../../../const/formateo.const';

type AnalisisPacienteProps = {
  patientId: string;
  doctorId: string;
  onCreateAnalysis: () => void;
};

export const AnalisisPacienteComponent = ({
  patientId,
  doctorId,
  onCreateAnalysis,
}: AnalisisPacienteProps) => {
  const [analysesFromDatabase, setAnalysesFromDatabase] = useState<AnalisisClinico[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalisisClinico | null>(null);

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

      <Alert className="patient-analysis__demo-warning" color="blue" variant="light">
        Base local de demostración. Los resultados no tienen validez clínica.
      </Alert>
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
        size="lg"
        classNames={{ content: 'patient-analysis__modal-content' }}
      >
        {selectedAnalysis && (
          <>
            <div className="patient-analysis__printable">
              <p className="patient-analysis__print-brand">BIO-TEC · DEMOSTRACIÓN</p>
              <Text size="sm" c="dimmed">
                Fecha: {formateoDia(selectedAnalysis.fecha)} · Plantilla v
                {selectedAnalysis.versionPlantilla}
              </Text>
              <Alert className="patient-analysis__demo-warning" color="blue" variant="light">
                Valores de muestra sin validez clínica. No utilizar para diagnóstico ni tratamiento.
              </Alert>
              {selectedAnalysis.resultados.length > 0 ? (
                <Table className="patient-analysis__results-table">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Parámetro</Table.Th>
                      <Table.Th>Resultado</Table.Th>
                      <Table.Th>Unidad</Table.Th>
                      <Table.Th>Referencia</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {selectedAnalysis.resultados.map((result, index) => (
                      <Table.Tr key={`${result.parametro}-${index}`}>
                        <Table.Td>{result.parametro}</Table.Td>
                        <Table.Td>{result.resultado}</Table.Td>
                        <Table.Td>{result.unidad}</Table.Td>
                        <Table.Td>{result.referencia}</Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              ) : (
                <Text className="patient-analysis__processing" c="dimmed">
                  Este análisis todavía está en proceso y no tiene resultados disponibles.
                </Text>
              )}
            </div>
            <div className="patient-analysis__modal-actions">
              <Button
                leftSection={<Printer size={16} aria-hidden="true" />}
                disabled={selectedAnalysis.estado !== 'Disponible'}
                onClick={() => window.print()}
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