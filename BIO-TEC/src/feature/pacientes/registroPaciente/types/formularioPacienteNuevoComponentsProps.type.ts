import type { Paciente } from '../../types/paciente.type';
import type { ContextoRegistroPaciente } from './contextoRegistroPaciente.type';

export type FormularioPacienteNuevoComponentsProps = {
  doctorId: string;
  contexto: ContextoRegistroPaciente;
  alGuardar: (paciente: Paciente, plantillaId: string | null) => void;
  alCancelar: () => void;
};