import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { Alert, Badge, Button, Modal, Select, Table, Text, TextInput } from '@mantine/core';
import { Eye, Printer, Search, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formateoDia } from '../../../../const/formateo.const';
import { BackButtonComponent } from '../../../../components/navigation/backButton.component';
import '../../../../styles/historial/pacienteHistorial.css';
import { listAnalysisHistory } from '../data/historial.repository';
import type { AnalisisHistorial } from '../types/analisisHistorial.interface';

type SortOption = 'newest' | 'oldest';

type PacienteHistorialComponentsProps = {
  doctorId: string;
};

const normalizeSearchText = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');

export const PacienteHistorialComponents = ({
  doctorId,
}: PacienteHistorialComponentsProps) => {
  const [analyses, setAnalyses] = useState<AnalisisHistorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalisisHistorial | null>(null);

  useEffect(() => {
    let isCurrent = true;
    setAnalyses([]);
    setLoadError('');
    setIsLoading(true);

    listAnalysisHistory()
      .then((loadedAnalyses) => {
        if (isCurrent) setAnalyses(loadedAnalyses);
      })
      .catch((error: unknown) => {
        console.error('No se pudo cargar el historial de análisis:', error);
        if (isCurrent) setLoadError('No se pudo cargar el historial desde la base local.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const filteredAnalyses = useMemo(() => {
    const normalizedQuery = normalizeSearchText(submittedQuery.trim());
    const filtered = analyses.filter((analysis) =>
      normalizeSearchText(
        `${analysis.pacienteNombre} ${analysis.pacienteApellido} ${analysis.doctor}`,
      ).includes(normalizedQuery),
    );

    return filtered.sort((first, second) => {
      const dateOrder = first.fecha.localeCompare(second.fecha);
      if (dateOrder !== 0) return sortBy === 'newest' ? -dateOrder : dateOrder;

      return (
        first.pacienteApellido.localeCompare(second.pacienteApellido, 'es', {
          sensitivity: 'base',
        }) ||
        first.pacienteNombre.localeCompare(second.pacienteNombre, 'es', {
          sensitivity: 'base',
        })
      );
    });
  }, [analyses, submittedQuery, sortBy]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedQuery(query);
  };

  return (
    <section className="analysis-history" aria-labelledby="analysis-history-title">
      <BackButtonComponent fallbackTo="/" />

      <div className="analysis-history__heading">
        <div>
          <p className="analysis-history__eyebrow">BIO-TEC / Historial</p>
          <h1 id="analysis-history-title">Historial de análisis</h1>
          <p className="analysis-history__description">
            Análisis registrados, pacientes y profesionales responsables.
          </p>
        </div>
        <Text className="analysis-history__count" size="sm">
          {filteredAnalyses.length} análisis
        </Text>
      </div>

      <form className="analysis-history__toolbar" onSubmit={handleSearch} role="search">
        <Select
          label="Ordenar por"
          aria-label="Ordenar análisis"
          value={sortBy}
          onChange={(value) => {
            if (value === 'newest' || value === 'oldest') setSortBy(value);
          }}
          data={[
            { value: 'newest', label: 'Más recientes primero' },
            { value: 'oldest', label: 'Más antiguos primero' },
          ]}
          allowDeselect={false}
          comboboxProps={{ withinPortal: true }}
        />
        <TextInput
          className="analysis-history__search"
          label="Buscar paciente o doctor"
          placeholder="Nombre y/o apellido"
          leftSection={<Search size={16} aria-hidden="true" />}
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          autoComplete="off"
        />
        <Button type="submit" leftSection={<Search size={16} aria-hidden="true" />}>
          Buscar
        </Button>
      </form>

      <Alert className="analysis-history__demo-warning" color="blue" variant="light">
        Base local de demostración. Los resultados no tienen validez clínica.
      </Alert>
      {loadError && <Alert color="red" mb="md">{loadError}</Alert>}

      <div className="analysis-history__table-wrap">
        <Table.ScrollContainer minWidth={1050} type="native">
          <Table className="analysis-history__table" highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Fecha</Table.Th>
                <Table.Th>Paciente</Table.Th>
                <Table.Th>Plantilla</Table.Th>
                <Table.Th>Estado</Table.Th>
                <Table.Th>Localidad</Table.Th>
                <Table.Th>Doctor</Table.Th>
                <Table.Th className="analysis-history__actions-heading">Acciones</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredAnalyses.map((analysis) => (
                <Table.Tr key={analysis.id}>
                  <Table.Td>{formateoDia(analysis.fecha)}</Table.Td>
                  <Table.Td className="analysis-history__patient">
                    {analysis.pacienteApellido}, {analysis.pacienteNombre}
                  </Table.Td>
                  <Table.Td className="analysis-history__template">
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
                  <Table.Td>
                    {analysis.localidad || 'No informada'}
                    {analysis.provincia ? `, ${analysis.provincia}` : ''}
                  </Table.Td>
                  <Table.Td>{analysis.doctor}</Table.Td>
                  <Table.Td className="analysis-history__actions-cell">
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
              {filteredAnalyses.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={7}>
                    <div className="analysis-history__empty">
                      <Text fw={600}>
                        {isLoading ? 'Cargando análisis…' : 'No hay análisis para mostrar'}
                      </Text>
                      <Text size="sm" c="dimmed">
                        {isLoading
                          ? 'Consultando la base de datos local.'
                          : submittedQuery
                            ? 'Probá con otro nombre o apellido de paciente.'
                            : 'Los análisis registrados aparecerán acá.'}
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
        classNames={{ content: 'analysis-history__modal-content' }}
      >
        {selectedAnalysis && (
          <>
            <div className="analysis-history__printable">
              <p className="analysis-history__print-brand">BIO-TEC · DEMOSTRACIÓN</p>
              <Text size="sm" c="dimmed">
                Paciente: {selectedAnalysis.pacienteNombre} {selectedAnalysis.pacienteApellido}
              </Text>
              <Text size="sm" c="dimmed">
                Fecha: {formateoDia(selectedAnalysis.fecha)} · Plantilla v
                {selectedAnalysis.versionPlantilla}
              </Text>
              <Text size="sm" c="dimmed">
                Doctor: {selectedAnalysis.doctor} · Localidad:{' '}
                {selectedAnalysis.localidad || 'No informada'}
                {selectedAnalysis.provincia ? `, ${selectedAnalysis.provincia}` : ''}
              </Text>
              <Alert className="analysis-history__demo-warning" color="blue" variant="light">
                Valores de muestra sin validez clínica. No utilizar para diagnóstico ni tratamiento.
              </Alert>
              {selectedAnalysis.resultados.length > 0 ? (
                <Table className="analysis-history__results-table">
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
                <Text className="analysis-history__processing" c="dimmed">
                  Este análisis todavía está en proceso y no tiene resultados disponibles.
                </Text>
              )}
            </div>
            <div className="analysis-history__modal-actions">
              {selectedAnalysis.patientDoctorId === doctorId && (
                <Button
                  component={Link}
                  to={`/pacientes/${encodeURIComponent(selectedAnalysis.patientId)}`}
                  variant="light"
                  leftSection={<UserRound size={16} aria-hidden="true" />}
                >
                  Ver paciente
                </Button>
              )}
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
