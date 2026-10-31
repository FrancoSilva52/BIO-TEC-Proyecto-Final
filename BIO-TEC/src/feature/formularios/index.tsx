import { FormulariosAnalisisComponents } from './componentes/formularioAnalisis.components';

type FormulariosPageProps = {
  doctorId: string;
};

export const FormulariosPage = ({ doctorId }: FormulariosPageProps) => (
  <FormulariosAnalisisComponents doctorId={doctorId} />
);
