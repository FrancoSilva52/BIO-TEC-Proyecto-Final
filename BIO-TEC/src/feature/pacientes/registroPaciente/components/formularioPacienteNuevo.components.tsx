import { useState, type FormEvent } from 'react';
import { Alert, Button, Group, Select, Stack, Switch, Text, TextInput, Title } from '@mantine/core';
import { crearPaciente } from '../../services/pacientes.repository';
import { PACIENTE_NUEVO_INICIAL } from '../const/pacientes.const';
import {
  obtenerFechaActual,
  validarDatosPaciente,
} from '../services/validacionPaciente.service';
import type { FormularioPacienteNuevoComponentsProps } from '../types/formularioPacienteNuevoComponentsProps.type';
import type { ValoresFormularioPaciente } from '../types/valoresFormularioPaciente.type';
import { plantillasAnalisis } from '../../../formularios/services/plantillasAnalisis.data';

export const FormularioPacienteNuevoComponents = ({
  doctorId,
  contexto,
  alGuardar,
  alCancelar,
}: FormularioPacienteNuevoComponentsProps) => {
  const [valores, actualizarValores] = useState<ValoresFormularioPaciente>(PACIENTE_NUEVO_INICIAL);
  const [plantillaSeleccionada, actualizarPlantilla] = useState<string | null>(
    contexto.plantillaId ?? null,
  );
  const [errorRegistro, actualizarErrorRegistro] = useState('');
  const [guardando, actualizarGuardado] = useState(false);

  const cambiarCampo = (
    campo: Exclude<keyof ValoresFormularioPaciente, 'poseeObraSocial'>,
    valor: string,
  ) => {
    actualizarValores((actuales) => ({ ...actuales, [campo]: valor }));
  };

  const hacerRegistroPaciente = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault();
    const errorValidacion = validarDatosPaciente(valores);
    const plantillaValida = plantillasAnalisis.some(
      (plantilla) => plantilla.id === plantillaSeleccionada && plantilla.disponible,
    );

    if (errorValidacion) {
      actualizarErrorRegistro(errorValidacion);
      return;
    }
    if (contexto.origen === 'analisis' && !plantillaValida) {
      actualizarErrorRegistro('Seleccioná una plantilla disponible para continuar con el análisis.');
      return;
    }

    actualizarGuardado(true);
    actualizarErrorRegistro('');

    try {
      const paciente = await crearPaciente({
        doctorId,
        nombre: valores.nombre,
        apellido: valores.apellido,
        dni: valores.dni,
        fechaNacimiento: valores.fechaNacimiento,
        telefono: valores.telefono,
        localidad: valores.localidad,
        provincia: valores.provincia,
        obraSocial: valores.poseeObraSocial ? valores.obraSocial : '',
      });
      alGuardar(paciente, contexto.origen === 'analisis' ? plantillaSeleccionada : null);
    } catch (error) {
      console.error('No se pudo registrar el paciente:', error);
      actualizarErrorRegistro(
        error instanceof Error && error.message === 'DUPLICATE_DNI'
          ? 'Ya existe un paciente con ese DNI para este médico.'
          : 'No se pudo guardar el paciente. Revisá los datos e intentá nuevamente.',
      );
    } finally {
      actualizarGuardado(false);
    }
  };

  return (
    <section className="patients-page patient-registration-page" aria-labelledby="patient-registration-title">
      <Title id="patient-registration-title" order={1} className="patients-page__title">
        Nuevo paciente
      </Title>

      {contexto.origen === 'analisis' && (
        <Text c="dimmed" size="sm">
          El paciente se agregará al análisis cuando termines el registro.
        </Text>
      )}

      <form className="patient-registration__form" onSubmit={hacerRegistroPaciente}>
        <div className="patient-registration__grid">
          <TextInput
            label="Nombre"
            value={valores.nombre}
            onChange={(evento) => cambiarCampo('nombre', evento.currentTarget.value)}
            autoComplete="given-name"
            required
          />
          <TextInput
            label="Apellido"
            value={valores.apellido}
            onChange={(evento) => cambiarCampo('apellido', evento.currentTarget.value)}
            autoComplete="family-name"
            required
          />
          <TextInput
            label="DNI"
            value={valores.dni}
            onChange={(evento) => cambiarCampo('dni', evento.currentTarget.value)}
            inputMode="numeric"
            autoComplete="off"
            required
          />
          <TextInput
            label="Fecha de nacimiento"
            type="date"
            min="1900-01-01"
            max={obtenerFechaActual()}
            value={valores.fechaNacimiento}
            onChange={(evento) => cambiarCampo('fechaNacimiento', evento.currentTarget.value)}
            required
          />
          <TextInput
            label="Provincia"
            value={valores.provincia}
            onChange={(evento) => cambiarCampo('provincia', evento.currentTarget.value)}
            autoComplete="address-level1"
            required
          />
          <TextInput
            label="Localidad"
            value={valores.localidad}
            onChange={(evento) => cambiarCampo('localidad', evento.currentTarget.value)}
            autoComplete="address-level2"
            required
          />
          <TextInput
            label="Teléfono (opcional)"
            value={valores.telefono}
            onChange={(evento) => cambiarCampo('telefono', evento.currentTarget.value)}
            autoComplete="tel"
          />
        </div>

        <Stack gap="xs">
          <Switch
            label="Posee obra social"
            checked={valores.poseeObraSocial}
            onChange={(evento) => {
              const poseeObraSocial = evento.currentTarget.checked;
              actualizarValores((actuales) => ({
                ...actuales,
                poseeObraSocial,
                obraSocial: poseeObraSocial ? actuales.obraSocial : '',
              }));
            }}
          />
          {valores.poseeObraSocial && (
            <TextInput
              label="Obra social"
              value={valores.obraSocial}
              onChange={(evento) => cambiarCampo('obraSocial', evento.currentTarget.value)}
              required
            />
          )}
        </Stack>

        {contexto.origen === 'analisis' && (
          <Select
            label="Plantilla del análisis"
            placeholder="Buscar o seleccionar plantilla"
            data={plantillasAnalisis.map((plantilla) => ({
              value: plantilla.id,
              label: plantilla.disponible ? plantilla.nombre : `${plantilla.nombre} (próximamente)`,
              disabled: !plantilla.disponible,
            }))}
            value={plantillaSeleccionada}
            onChange={actualizarPlantilla}
            searchable
            clearable
            nothingFoundMessage="No se encontraron plantillas"
            comboboxProps={{ withinPortal: true }}
            required
          />
        )}

        {errorRegistro && <Alert color="red">{errorRegistro}</Alert>}

        <Group justify="flex-end" className="patient-registration__actions">
          <Button type="button" variant="default" onClick={alCancelar} disabled={guardando}>
            Cancelar
          </Button>
          <Button type="submit" loading={guardando}>
            Registrar paciente
          </Button>
        </Group>
      </form>
    </section>
  );
};
