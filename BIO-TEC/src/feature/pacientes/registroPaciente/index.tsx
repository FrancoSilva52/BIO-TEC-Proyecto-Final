import { useEffect, useState } from 'react';
import { Alert, Text } from '@mantine/core';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { BackButtonComponent } from '../../../components/navigation/backButton.component';
import type { Paciente } from '../perfilPaciente/types/paciente.type';
import { getPatientById } from '../perfilPaciente/services/pacientes.repository';
import type { RegistroPacientePageProps } from './types/registroPacientePageProps.type';
import { FormularioPacienteNuevoComponents } from './components/formularioPacienteNuevo.components';
import type { ContextoRegistroPaciente } from './types/contextoRegistroPaciente.type';
import '../../../styles/pacientes/pacientes.css';

const obtenerContextoRegistro = (estado: unknown): ContextoRegistroPaciente => {
  if (!estado || typeof estado !== 'object') return { origen: 'pacientes' };

  const contexto = estado as Partial<ContextoRegistroPaciente>;
  if (contexto.origen !== 'analisis' && contexto.origen !== 'pacientes') {
    return { origen: 'pacientes' };
  }

  return {
    origen: contexto.origen,
    ...(typeof contexto.pacienteId === 'string' ? { pacienteId: contexto.pacienteId } : {}),
    ...(typeof contexto.plantillaId === 'string' ? { plantillaId: contexto.plantillaId } : {}),
  };
};

export const RegistroPacientePage = ({ doctorId, modo = 'crear' }: RegistroPacientePageProps) => {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const { patientId } = useParams();
  const [pacienteInicial, actualizarPacienteInicial] = useState<Paciente | null>(null);
  const [cargandoPaciente, actualizarCargaPaciente] = useState(modo === 'editar');
  const [errorCarga, actualizarErrorCarga] = useState('');
  const contexto = modo === 'editar' ? { origen: 'pacientes' as const } : obtenerContextoRegistro(ubicacion.state);

  useEffect(() => {
    if (modo !== 'editar') return;

    let vigente = true;
    actualizarCargaPaciente(true);
    actualizarErrorCarga('');

    if (!patientId) {
      actualizarErrorCarga('No se indicó qué paciente editar.');
      actualizarCargaPaciente(false);
      return () => {
        vigente = false;
      };
    }

    getPatientById(patientId, doctorId)
      .then((paciente) => {
        if (vigente) {
          actualizarPacienteInicial(paciente);
          if (!paciente) actualizarErrorCarga('El paciente no existe o no está disponible para este médico.');
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudo cargar el paciente para editar:', error);
        if (vigente) actualizarErrorCarga('No se pudieron cargar los datos del paciente.');
      })
      .finally(() => {
        if (vigente) actualizarCargaPaciente(false);
      });

    return () => {
      vigente = false;
    };
  }, [doctorId, modo, patientId]);

  const volverAlOrigen = () => {
    if (modo === 'editar' && patientId) {
      navegar(`/pacientes/${encodeURIComponent(patientId)}`, { replace: true });
      return;
    }
    if (contexto.origen !== 'analisis') {
      navegar('/pacientes', { replace: true });
      return;
    }

    const parametros = new URLSearchParams();
    if (contexto.pacienteId) parametros.set('patientId', contexto.pacienteId);
    if (contexto.plantillaId) parametros.set('templateId', contexto.plantillaId);
    const consulta = parametros.size ? `?${parametros.toString()}` : '';
    navegar(`/formularios/paciente${consulta}`, { replace: true });
  };

  const continuarDespuesDelRegistro = (paciente: Paciente, plantillaId: string | null) => {
    if (modo === 'editar') {
      navegar(`/pacientes/${encodeURIComponent(paciente.id)}`, { replace: true });
      return;
    }
    if (contexto.origen !== 'analisis') {
      navegar(`/pacientes/${encodeURIComponent(paciente.id)}`, { replace: true });
      return;
    }

    const parametros = new URLSearchParams({ patientId: paciente.id });
    if (plantillaId) parametros.set('templateId', plantillaId);
    navegar(`/formularios/paciente?${parametros.toString()}`, { replace: true });
  };

  if (modo === 'editar' && cargandoPaciente) {
    return (
      <section className="patients-page patient-registration-page">
        <Text c="dimmed">Cargando datos del paciente…</Text>
      </section>
    );
  }

  if (modo === 'editar' && (!pacienteInicial || errorCarga)) {
    return (
      <section className="patients-page patient-registration-page">
        <BackButtonComponent fallbackTo="/pacientes" label="Volver a pacientes" />
        <Alert color="red">{errorCarga || 'No se encontró el paciente solicitado.'}</Alert>
      </section>
    );
  }

  return (
    <FormularioPacienteNuevoComponents
      doctorId={doctorId}
      contexto={contexto}
      modo={modo}
      pacienteInicial={pacienteInicial ?? undefined}
      alGuardar={continuarDespuesDelRegistro}
      alCancelar={volverAlOrigen}
    />
  );
};
