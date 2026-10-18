import { Alert, Button } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export const NuevoAnalisisPlaceholderComponent = () => {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');
  const backTo = patientId
    ? `/pacientes/${encodeURIComponent(patientId)}`
    : '/pacientes';

  return (
    <section className="patients-page patient-analysis-create" aria-labelledby="new-analysis-title">
      <Button
        component={Link}
        to={backTo}
        variant="subtle"
        leftSection={<ArrowLeft size={16} aria-hidden="true" />}
      >
        Volver
      </Button>
      <div className="patient-analysis-create__content">
        <p className="patients-page__eyebrow">BIO-TEC / Formularios</p>
        <h1 id="new-analysis-title">Nuevo análisis clínico</h1>
        <Alert color="blue" variant="light">
          La selección de plantillas y la carga del análisis se incorporarán más adelante.
        </Alert>
      </div>
    </section>
  );
};