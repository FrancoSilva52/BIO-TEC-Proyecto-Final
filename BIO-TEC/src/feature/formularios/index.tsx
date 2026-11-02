import { FormulariosAnalisisComponents } from './componentes/formularioAnalisis.components';
import type { FormulariosPageProps } from './types/formulariosPageProps.type';

export const FormulariosPage = ({ doctorId }: FormulariosPageProps) => (
  <FormulariosAnalisisComponents doctorId={doctorId} />
);
