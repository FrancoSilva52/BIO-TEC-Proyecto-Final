import type { Paciente } from '../../perfilPaciente/types/paciente.type';
import type { ContextoRegistroPaciente } from './contextoRegistroPaciente.type';

export type FormularioPacienteNuevoComponentsProps = {
  doctorId: string;
  contexto: ContextoRegistroPaciente;
  modo?: 'crear' | 'editar';
  pacienteInicial?: Paciente;
  alGuardar: (paciente: Paciente, plantillaId: string | null) => void;
  alCancelar: () => void;
};