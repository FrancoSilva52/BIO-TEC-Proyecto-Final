
import { Badge, Button, Paper, Text } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnalisisPacienteComponent } from '../../historial/analisisPaciente';
import { PACIENTES_DEMO } from '../data/pacientes.mock';

const calculateAge = (birthDate: string) => {
  const date = new Date(`${birthDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayHasPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

  if (!birthdayHasPassed) age -= 1;
  return age >= 0 ? age : null;
};

export const PerfilPacienteComponents = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const patient = PACIENTES_DEMO.find(({ id }) => id === patientId);

  return (
    <section className="patients-page patients-profile" aria-labelledby="patient-profile-title">
      <Button
        component={Link}
        to="/pacientes"
        variant="subtle"
        leftSection={<ArrowLeft size={16} aria-hidden="true" />}
        className="patients-profile__back"
      >
        Volver a pacientes
      </Button>

      {patient ? (
        <>
          <div className="patients-page__heading patients-profile__heading">
            <div>
              <p className="patients-page__eyebrow">BIO-TEC / Pacientes</p>
              <h1 id="patient-profile-title">
                {patient.apellido}, {patient.nombre}
              </h1>
              <p className="patients-page__description">Ficha técnica e historial de análisis</p>
            </div>
            <Text className="patients-page__demo-note">Datos de demostración</Text>
          </div>

          <div className="patient-profile__layout">
            <aside className="patient-profile__details-column">
              <Paper className="patient-profile__details" withBorder>
                <h2>Ficha técnica</h2>
                <dl className="patient-profile__fields">
                  <div>
                    <dt>Edad</dt>
                    <dd>{calculateAge(patient.fechaNacimiento) ?? 'No disponible'}</dd>
                  </div>
                  <div>
                    <dt>DNI</dt>
                    <dd>{patient.dni}</dd>
                  </div>
                  <div>
                    <dt>Teléfono</dt>
                    <dd>{patient.telefono || 'No informado'}</dd>
                  </div>
                  <div>
                    <dt>Localidad / provincia</dt>
                    <dd>{patient.localidad}, {patient.provincia}</dd>
                  </div>
                  <div>
                    <dt>Grupo sanguíneo</dt>
                    <dd>{patient.grupoSanguineo || 'No informado'}</dd>
                  </div>
                  <div>
                    <dt>Puede donar sangre</dt>
                    <dd>
                      <Badge color={patient.puedeDonarSangre ? 'blue' : 'gray'} variant="light">
                        {patient.puedeDonarSangre ? 'Sí' : 'No'}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt>Obra social</dt>
                    <dd>{patient.obraSocial || 'No informada'}</dd>
                  </div>
                </dl>
                <div className="patient-profile__observations">
                  <Text size="xs" fw={700} c="dimmed">Observaciones relevantes</Text>
                  <Text size="sm">{patient.observaciones || 'Sin observaciones.'}</Text>
                </div>
              </Paper>
            </aside>

            <AnalisisPacienteComponent
              patientId={patient.id}
              onCreateAnalysis={() =>
                navigate(`/formularios/paciente?patientId=${encodeURIComponent(patient.id)}`)
              }
            />
          </div>
        </>
      ) : (
        <div className="patients-profile__not-found">
          <p className="patients-page__eyebrow">BIO-TEC / Pacientes</p>
          <h1 id="patient-profile-title">Paciente no encontrado</h1>
          <p className="patients-page__description">
            El registro solicitado no está disponible en los datos de demostración.
          </p>
        </div>
      )}
    </section>
  );
};
