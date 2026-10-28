
import { useEffect, useState } from 'react';
import { Badge, Paper, Text } from '@mantine/core';
import { useNavigate, useParams } from 'react-router-dom';
import { BackButtonComponent } from '../../../components/navigation/backButton.component';
import { AnalisisPacienteComponent } from '../../historial/analisis';
import { getPatientById } from '../data/pacientes.repository';
import type { Paciente } from '../type/paciente.interface';

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

type PerfilPacienteComponentsProps = {
  doctorId: string;
};

export const PerfilPacienteComponents = ({ doctorId }: PerfilPacienteComponentsProps) => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Paciente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isCurrent = true;
    setPatient(null);
    setLoadError('');
    setIsLoading(true);

    if (!patientId) {
      setIsLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    getPatientById(patientId, doctorId)
      .then((loadedPatient) => {
        if (isCurrent) setPatient(loadedPatient);
      })
      .catch((error: unknown) => {
        console.error('No se pudo cargar el paciente:', error);
        if (isCurrent) setLoadError('No se pudo cargar el perfil desde la base local.');
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [doctorId, patientId]);

  return (
    <section className="patients-page patients-profile" aria-labelledby="patient-profile-title">
      <BackButtonComponent fallbackTo="/pacientes" label="Volver a pacientes" />

      {isLoading ? (
        <Text c="dimmed">Cargando perfil del paciente…</Text>
      ) : loadError ? (
        <div className="patients-profile__not-found">
          <p className="patients-page__eyebrow">BIO-TEC / Pacientes</p>
          <h1 id="patient-profile-title">No se pudo cargar el perfil</h1>
          <p className="patients-page__description">{loadError}</p>
        </div>
      ) : patient ? (
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
              doctorId={doctorId}
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
