export type ContextoRegistroPaciente = {
  origen: 'pacientes' | 'analisis';
  pacienteId?: string;
  plantillaId?: string;
};