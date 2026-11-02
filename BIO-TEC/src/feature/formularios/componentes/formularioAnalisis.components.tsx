

import { useEffect, useRef, useState } from 'react';
import { Alert, Button, Group, Modal, Select, Stack, Text, Title } from '@mantine/core';
import { Printer } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BackButtonComponent } from '../../../components/navigation/backButton.component';
import { listPatients as listarPacientes } from '../../pacientes/perfilPaciente/services/pacientes.repository';
import type { Paciente } from '../../pacientes/perfilPaciente/types/paciente.type';
import type { FormulariosAnalisisComponentsProps } from '../types/formulariosAnalisisComponentsProps.type';
import { plantillasAnalisis } from '../services/plantillasAnalisis.data';
import {
  guardarAnalisisClinico,
  obtenerDatosProfesionalImpresion,
} from '../services/analisisFormulario.repository';
import {
  imprimirAnalisis as imprimirDocumentoAnalisis,
  prepararSeccionesImpresion,
} from '../services/imprimirAnalisis.service';
import { DiccionarioFormulariosComponents } from './diccionarioFormularios.components';
import { HojaImpresionAnalisisComponents } from './hojaImpresionAnalisis.components';
import type { AnalisisParaImprimir } from '../types/analisisParaImprimir.type';
import '../../../styles/formularios/formularios.css';

export const FormulariosAnalisisComponents = ({ doctorId }: FormulariosAnalisisComponentsProps) => {
  const [parametrosUrl] = useSearchParams();
  const navegar = useNavigate();
  const pacienteIdInicial = parametrosUrl.get('patientId');
  const plantillaIdInicial = parametrosUrl.get('templateId');
  const hojaImpresionRef = useRef<HTMLDivElement>(null);
  const [pacientes, actualizarPacientes] = useState<Paciente[]>([]);
  const [pacienteSeleccionado, actualizarPacienteSeleccionado] = useState<string | null>(null);
  const [plantillaSeleccionada, actualizarPlantillaSeleccionada] = useState<string | null>(null);
  const [valores, actualizarValores] = useState<Record<string, string>>({});
  const [cargandoPacientes, actualizarCargaPacientes] = useState(true);
  const [errorCarga, actualizarErrorCarga] = useState('');
  const [errorGuardado, actualizarErrorGuardado] = useState('');
  const [mensajeExito, actualizarMensajeExito] = useState('');
  const [formularioIniciado, actualizarFormularioIniciado] = useState(false);
  const [modalConfirmacionAbierto, actualizarModalConfirmacion] = useState(false);
  const [guardando, actualizarGuardando] = useState(false);
  const [analisisGuardado, actualizarAnalisisGuardado] = useState<AnalisisParaImprimir | null>(null);

  useEffect(() => {
    let vigente = true;
    actualizarCargaPacientes(true);
    actualizarErrorCarga('');

    listarPacientes(doctorId)
      .then((pacientesCargados) => {
        if (!vigente) return;
        actualizarPacientes(pacientesCargados);
        actualizarPacienteSeleccionado(
          pacienteIdInicial && pacientesCargados.some((paciente) => paciente.id === pacienteIdInicial)
            ? pacienteIdInicial
            : null,
        );
        actualizarPlantillaSeleccionada(
          plantillaIdInicial && plantillasAnalisis.some(
            (plantilla) => plantilla.id === plantillaIdInicial && plantilla.disponible,
          )
            ? plantillaIdInicial
            : null,
        );
      })
      .catch((error: unknown) => {
        console.error('No se pudieron cargar los pacientes:', error);
        if (vigente) actualizarErrorCarga('No se pudieron cargar los pacientes desde la base local.');
      })
      .finally(() => {
        if (vigente) actualizarCargaPacientes(false);
      });

    return () => {
      vigente = false;
    };
  }, [doctorId, pacienteIdInicial, plantillaIdInicial]);

  const iniciarFormulario = () => {
    const plantilla = plantillasAnalisis.find((opcion) => opcion.id === plantillaSeleccionada);
    if (!pacienteSeleccionado || !plantilla?.disponible) return;
    actualizarValores({});
    actualizarErrorGuardado('');
    actualizarMensajeExito('');
    actualizarAnalisisGuardado(null);
    actualizarFormularioIniciado(true);
  };

  const cancelarFormulario = () => {
    if (pacienteIdInicial) {
      navegar(`/pacientes/${encodeURIComponent(pacienteIdInicial)}`);
      return;
    }

    navegar('/');
  };

  const cambiarValor = (parametroId: string, valor: string) => {
    actualizarValores((valoresActuales) => ({ ...valoresActuales, [parametroId]: valor }));
  };

  const cambiarPaciente = (pacienteId: string | null) => {
    actualizarPacienteSeleccionado(pacienteId);
    actualizarFormularioIniciado(false);
    actualizarValores({});
    actualizarErrorGuardado('');
    actualizarMensajeExito('');
    actualizarAnalisisGuardado(null);
  };

  const confirmarGuardado = async () => {
    const paciente = pacientes.find((opcion) => opcion.id === pacienteSeleccionado);
    const plantilla = plantillasAnalisis.find((opcion) => opcion.id === plantillaSeleccionada);
    const resultados = plantilla?.parametros.filter((parametro) => valores[parametro.id]?.trim());

    if (!paciente || !plantilla?.disponible || !resultados?.length) {
      actualizarModalConfirmacion(false);
      return;
    }

    actualizarGuardando(true);
    actualizarErrorGuardado('');

    try {
      const resultadosGuardados = resultados.map((parametro) => ({
        parametro: parametro.nombre,
        resultado: valores[parametro.id].trim(),
        unidad: parametro.unidad,
        referencia: parametro.referencia,
      }));

      const datosProfesional = await obtenerDatosProfesionalImpresion(doctorId);
      await guardarAnalisisClinico({
        pacienteId: paciente.id,
        profesionalId: doctorId,
        plantillaId: plantilla.id,
        nombrePlantilla: plantilla.nombre,
        versionPlantilla: plantilla.version,
        resultados: resultadosGuardados,
      });
      actualizarMensajeExito('El análisis se guardó correctamente y ya está disponible en el historial.');
      actualizarAnalisisGuardado({
        institucion: datosProfesional.institucion,
        paciente: `${paciente.apellido}, ${paciente.nombre}`,
        profesional: datosProfesional.nombre,
        fecha: new Date().toLocaleDateString('es-AR'),
        plantilla: plantilla.nombre,
        secciones: prepararSeccionesImpresion(plantilla.nombre, resultadosGuardados),
      });
      actualizarFormularioIniciado(false);
    } catch (error) {
      console.error('No se pudo guardar el análisis:', error);
      actualizarErrorGuardado('No se pudo guardar el análisis en la base local. Revisá los datos e intentá nuevamente.');
    } finally {
      actualizarGuardando(false);
    }
  };

  const pacienteElegido = pacientes.find((paciente) => paciente.id === pacienteSeleccionado);
  const plantillaElegida = plantillasAnalisis.find(
    (plantilla) => plantilla.id === plantillaSeleccionada,
  );

  const cerrarModalConfirmacion = () => {
    actualizarModalConfirmacion(false);
    if (analisisGuardado) {
      actualizarPlantillaSeleccionada(null);
      actualizarValores({});
      actualizarAnalisisGuardado(null);
      actualizarMensajeExito('');
    }
  };


  return (
    <section className="analysis-form-page" aria-labelledby="analysis-form-title">
      <BackButtonComponent fallbackTo="/" />
      <Stack gap="lg">
        <div className="analysis-form-page__heading">
          <div>
            <Text c="dimmed" size="sm">BIO-TEC / Análisis clínicos</Text>
            <Title id="analysis-form-title" order={1}>Nuevo análisis clínico</Title>
          </div>
          {!formularioIniciado && (
            <Button
              type="button"
              variant="default"
              onClick={() => navegar('/pacientes/nuevo', {
                state: {
                  origen: 'analisis',
                  pacienteId: pacienteSeleccionado ?? undefined,
                  plantillaId: plantillaSeleccionada ?? undefined,
                },
              })}
            >
              Nuevo paciente
            </Button>
          )}
        </div>

        {errorCarga && <Alert color="red">{errorCarga}</Alert>}
        {errorGuardado && <Alert color="red">{errorGuardado}</Alert>}
        {mensajeExito && <Alert color="green">{mensajeExito}</Alert>}

        <div className="analysis-form-page__selectors">
          <Select
            label="Paciente"
            placeholder={cargandoPacientes ? 'Cargando pacientes...' : 'Buscar por nombre o DNI'}
            data={pacientes.map((paciente) => ({
              value: paciente.id,
              label: `${paciente.apellido}, ${paciente.nombre} · DNI ${paciente.dni}`,
            }))}
            value={pacienteSeleccionado}
            onChange={cambiarPaciente}
            searchable
            clearable
            nothingFoundMessage="No se encontraron pacientes"
            disabled={cargandoPacientes || Boolean(errorCarga)}
            comboboxProps={{ withinPortal: true }}
            required
          />
          <Select
            label="Plantilla del análisis"
            placeholder="Buscar o seleccionar plantilla"
            data={plantillasAnalisis.map((plantilla) => ({
              value: plantilla.id,
              label: plantilla.disponible ? plantilla.nombre : `${plantilla.nombre} (próximamente)`,
              disabled: !plantilla.disponible,
            }))}
            value={plantillaSeleccionada}
            onChange={(valor) => {
              actualizarPlantillaSeleccionada(valor);
              actualizarFormularioIniciado(false);
              actualizarValores({});
              actualizarErrorGuardado('');
              actualizarMensajeExito('');
            }}
            searchable
            clearable
            nothingFoundMessage="No se encontraron plantillas"
            comboboxProps={{ withinPortal: true }}
            required
          />
        </div>

        <Group justify="flex-end">
          <Button type="button" variant="default" onClick={cancelarFormulario}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={iniciarFormulario}
            disabled={
              !pacienteSeleccionado || !plantillaElegida?.disponible || cargandoPacientes
            }
          >
            Iniciar formulario
          </Button>
        </Group>

        {formularioIniciado && pacienteElegido && plantillaElegida && (
          <DiccionarioFormulariosComponents
            plantilla={plantillaElegida}
            paciente={pacienteElegido}
            valores={valores}
            alCambiarValor={cambiarValor}
            alGuardar={() => actualizarModalConfirmacion(true)}
          />
        )}
      </Stack>

      <Modal
        opened={modalConfirmacionAbierto}
        onClose={cerrarModalConfirmacion}
        title={analisisGuardado ? 'Análisis guardado' : 'Confirmar análisis'}
        centered
        size="xl"
        classNames={{ body: 'analysis-print-modal-body' }}
      >
        {analisisGuardado ? (
          <>
            <Text size="sm" mb="md">El análisis se guardó correctamente.</Text>
            <div ref={hojaImpresionRef} className="analysis-print-preview">
              <HojaImpresionAnalisisComponents analisis={analisisGuardado} />
            </div>
            <Group justify="flex-end" mt="lg" className="analysis-print-actions">
              <Button
                type="button"
                variant="default"
                onClick={() => imprimirDocumentoAnalisis(
                  hojaImpresionRef.current?.querySelector<HTMLElement>('.analysis-print-sheet') ?? null,
                )}
                leftSection={<Printer size={16} aria-hidden="true" />}
              >
                Imprimir formulario
              </Button>
              <Button type="button" onClick={cerrarModalConfirmacion}>
                Cerrar
              </Button>
            </Group>
          </>
        ) : (
          <>
            <Text size="sm">
              Se guardarán los resultados ingresados para {pacienteElegido?.nombre}{' '}
              {pacienteElegido?.apellido}. Los campos vacíos no se incluirán.
            </Text>
            {errorGuardado && <Alert color="red" mt="md">{errorGuardado}</Alert>}
            <Group justify="flex-end" mt="lg">
              <Button
                type="button"
                variant="default"
                onClick={() => actualizarModalConfirmacion(false)}
                disabled={guardando}
              >
                Cancelar
              </Button>
              <Button type="button" onClick={confirmarGuardado} loading={guardando}>
                Confirmar y guardar
              </Button>
            </Group>
          </>
        )}
      </Modal>
    </section>
  );
};
