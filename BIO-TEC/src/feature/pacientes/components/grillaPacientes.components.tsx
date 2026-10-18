import { useMemo, useState, type FormEvent } from 'react';
import { Button, Select, Table, Text, TextInput } from '@mantine/core';
import { Search, UserRoundSearch } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PACIENTES_DEMO } from '../data/pacientes.mock';

type SortOption = 'name' | 'newest';

export const GrillaPacientesComponents = () => {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const navigate = useNavigate();

  const visiblePatients = useMemo(() => {
    const normalizedQuery = submittedQuery.trim().toLocaleLowerCase('es');
    const filteredPatients = PACIENTES_DEMO.filter((patient) => {
      const searchableText = [
        patient.nombre,
        patient.apellido,
        `${patient.nombre} ${patient.apellido}`,
        `${patient.apellido} ${patient.nombre}`,
        patient.dni,
        patient.localidad,
        patient.provincia,
        patient.obraSocial,
      ]
        .join(' ')
        .toLocaleLowerCase('es');

      return searchableText.includes(normalizedQuery);
    });

    return filteredPatients.sort((first, second) => {
      if (sortBy === 'newest') {
        return Date.parse(second.createdAt) - Date.parse(first.createdAt);
      }

      return (
        first.apellido.localeCompare(second.apellido, 'es', { sensitivity: 'base' }) ||
        first.nombre.localeCompare(second.nombre, 'es', { sensitivity: 'base' })
      );
    });
  }, [submittedQuery, sortBy]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmittedQuery(query);
  };

  return (
    <section className="patients-page" aria-labelledby="patients-title">
      <div className="patients-page__heading">
        <div>
          <p className="patients-page__eyebrow">BIO-TEC / Gestión clínica</p>
          <h1 id="patients-title">Pacientes</h1>
        </div>
        <Text className="patients-page__count" size="sm">
          {visiblePatients.length} {visiblePatients.length === 1 ? 'paciente' : 'pacientes'}
        </Text>
      </div>

      <form className="patients-toolbar" onSubmit={handleSearch} role="search">
        <Select
          label="Ordenar por"
          aria-label="Ordenar pacientes"
          value={sortBy}
          onChange={(value) => setSortBy((value as SortOption | null) ?? 'name')}
          data={[
            { value: 'name', label: 'Apellido: A a Z' },
            { value: 'newest', label: 'Más recientes primero' },
          ]}
          allowDeselect={false}
          comboboxProps={{ withinPortal: true }}
        />
        <TextInput
          label="Buscar paciente"
          placeholder="Nombre, DNI, localidad u obra social"
          value={query}
          onChange={(event) => setQuery(event.currentTarget.value)}
          leftSection={<UserRoundSearch size={17} aria-hidden="true" />}
          autoComplete="off"
        />
        <Button type="submit" leftSection={<Search size={16} aria-hidden="true" />}>
          Buscar
        </Button>
      </form>

      <div className="patients-table-wrap">
        <Table.ScrollContainer minWidth={820} type="native">
          <Table className="patients-table" highlightOnHover verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Nombre completo</Table.Th>
                <Table.Th>DNI</Table.Th>
                <Table.Th>Procedencia / localidad</Table.Th>
                <Table.Th>Obra social</Table.Th>
                <Table.Th className="patients-table__action-heading">Perfil</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {visiblePatients.map((patient) => (
                <Table.Tr key={patient.id}>
                  <Table.Td className="patients-table__name">
                    {patient.apellido}, {patient.nombre}
                  </Table.Td>
                  <Table.Td>{patient.dni}</Table.Td>
                  <Table.Td>
                    {patient.localidad}, {patient.provincia}
                  </Table.Td>
                  <Table.Td>{patient.obraSocial}</Table.Td>
                  <Table.Td className="patients-table__action-cell">
                    <Button
                      variant="light"
                      size="xs"
                      onClick={() => navigate(`/pacientes/${patient.id}`)}
                    >
                      Ver perfil
                    </Button>
                  </Table.Td>
                </Table.Tr>
              ))}
              {visiblePatients.length === 0 && (
                <Table.Tr>
                  <Table.Td colSpan={5}>
                    <div className="patients-table__empty">
                      <Text fw={600}>No encontramos pacientes</Text>
                      <Text size="sm" c="dimmed">
                        Probá con otro nombre, DNI, localidad u obra social.
                      </Text>
                    </div>
                  </Table.Td>
                </Table.Tr>
              )}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </div>

      <p className="patients-page__demo-note">
        Datos ficticios de demostración; todavía no se guardan en una base de datos.
      </p>
    </section>
  );
};
