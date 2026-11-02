import { useLocation, useNavigate } from 'react-router-dom';
import type { Paciente } from '../types/paciente.type';
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

export const RegistroPacientePage = ({ doctorId }: RegistroPacientePageProps) => {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const contexto = obtenerContextoRegistro(ubicacion.state);

  const volverAlOrigen = () => {
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
    if (contexto.origen !== 'analisis') {
      navegar(`/pacientes/${encodeURIComponent(paciente.id)}`, { replace: true });
      return;
    }

    const parametros = new URLSearchParams({ patientId: paciente.id });
    if (plantillaId) parametros.set('templateId', plantillaId);
    navegar(`/formularios/paciente?${parametros.toString()}`, { replace: true });
  };

  return (
    <FormularioPacienteNuevoComponents
      doctorId={doctorId}
      contexto={contexto}
      alGuardar={continuarDespuesDelRegistro}
      alCancelar={volverAlOrigen}
    />
  );
};
