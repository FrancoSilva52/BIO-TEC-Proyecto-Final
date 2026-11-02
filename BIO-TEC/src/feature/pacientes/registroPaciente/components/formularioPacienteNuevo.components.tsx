import { useState, type FormEvent } from 'react';
import { Alert, Button, Group, Select, Stack, Switch, Text, Textarea, TextInput, Title } from '@mantine/core';
import { actualizarPaciente, crearPaciente } from '../../perfilPaciente/services/pacientes.repository';
import type { Paciente } from '../../perfilPaciente/types/paciente.type';
import { PACIENTE_NUEVO_INICIAL } from '../const/pacientes.const';
import {
  obtenerFechaActual,
  validarDatosPaciente,
} from '../services/validacionPaciente.service';
import type { FormularioPacienteNuevoComponentsProps } from '../types/formularioPacienteNuevoComponentsProps.type';
import type { ValoresFormularioPaciente } from '../types/valoresFormularioPaciente.type';
import type { SexoPaciente } from '../../perfilPaciente/types/sexoPaciente.type';
import { plantillasAnalisis } from '../../../formularios/services/plantillasAnalisis.data';

export const FormularioPacienteNuevoComponents = ({
  doctorId,
  contexto,
  modo = 'crear',
  pacienteInicial,
  alGuardar,
  alCancelar,
}: FormularioPacienteNuevoComponentsProps) => {
  const [valores, actualizarValores] = useState<ValoresFormularioPaciente>(() =>
    pacienteInicial
      ? {
          nombre: pacienteInicial.nombre,
          apellido: pacienteInicial.apellido,
          dni: pacienteInicial.dni,
          fechaNacimiento: pacienteInicial.fechaNacimiento,
          sexo: pacienteInicial.sexo ?? '',
          telefono: pacienteInicial.telefono,
          localidad: pacienteInicial.localidad,
          provincia: pacienteInicial.provincia,
          poseeObraSocial: Boolean(pacienteInicial.obraSocial),
          obraSocial: pacienteInicial.obraSocial,
          grupoSanguineo: pacienteInicial.grupoSanguineo,
          puedeDonarSangre: pacienteInicial.puedeDonarSangre,
          observaciones: pacienteInicial.observaciones,
        }
      : PACIENTE_NUEVO_INICIAL,
  );
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
      const datosPaciente = {
        doctorId,
        nombre: valores.nombre,
        apellido: valores.apellido,
        dni: valores.dni,
        fechaNacimiento: valores.fechaNacimiento,
        sexo: valores.sexo as SexoPaciente,
        telefono: valores.telefono,
        localidad: valores.localidad,
        provincia: valores.provincia,
        obraSocial: valores.poseeObraSocial ? valores.obraSocial : '',
        grupoSanguineo: valores.grupoSanguineo,
        puedeDonarSangre: valores.puedeDonarSangre,
        observaciones: valores.observaciones,
      };
      const paciente: Paciente = modo === 'editar' && pacienteInicial
        ? await actualizarPaciente(pacienteInicial.id, datosPaciente)
        : await crearPaciente(datosPaciente);
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
        {modo === 'editar' ? 'Editar paciente' : 'Nuevo paciente'}
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
          <Select
            label="Sexo"
            data={['Masculino', 'Femenino', 'Otro']}
            value={valores.sexo || null}
            onChange={(sexo) => actualizarValores((actuales) => ({
              ...actuales,
              sexo: (sexo as SexoPaciente | null) ?? '',
            }))}
            required
            allowDeselect={false}
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

        <Select
          label="Grupo sanguíneo (opcional)"
          placeholder="Seleccionar grupo sanguíneo"
          data={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']}
          value={valores.grupoSanguineo || null}
          onChange={(grupoSanguineo) => cambiarCampo('grupoSanguineo', grupoSanguineo ?? '')}
          clearable
          searchable
        />

        <Switch
          label="Puede donar sangre"
          checked={valores.puedeDonarSangre}
          onChange={(evento) => actualizarValores((actuales) => ({
            ...actuales,
            puedeDonarSangre: evento.currentTarget.checked,
          }))}
        />

        <Textarea
          label="Observaciones relevantes (opcional)"
          value={valores.observaciones}
          onChange={(evento) => cambiarCampo('observaciones', evento.currentTarget.value)}
          autosize
          minRows={3}
          maxRows={6}
        />

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
            {modo === 'editar' ? 'Guardar cambios' : 'Registrar paciente'}
          </Button>
        </Group>
      </form>
    </section>
  );
};
