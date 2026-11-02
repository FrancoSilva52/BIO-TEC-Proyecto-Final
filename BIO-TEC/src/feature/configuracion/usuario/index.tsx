import { useEffect, useState } from 'react';
import { Alert, Button, Paper, Text } from '@mantine/core';
import { Check, Pencil } from 'lucide-react';
import { BackButtonComponent } from '../../../components/navigation/backButton.component';
import type { AuthenticatedUser } from '../../inicio/login/types/authenticatedUser.type';
import { FormularioRegistroComponents } from '../../inicio/registro/components/formularioRegistro.components';
import { obtenerPerfilMedico } from '../../inicio/registro/services/registro.service';
import type { PerfilMedico } from '../../inicio/registro/types/perfilMedico.type';
import type { ConfiguracionUsuarioPageProps } from './types/configuracionUsuarioPageProps.type';
import { ESTILOS_APLICACION, CLAVE_ESTILO_APLICACION } from '../estilos/const/estilos.const';
import '../../../styles/configuracion/configuracion.css';

export const ConfiguracionUsuarioPage = ({
  usuario,
  alActualizarPerfil,
}: ConfiguracionUsuarioPageProps) => {
  const [perfil, actualizarPerfil] = useState<PerfilMedico | null>(null);
  const [cargando, actualizarCarga] = useState(true);
  const [errorCarga, actualizarErrorCarga] = useState('');
  const [editandoPerfil, actualizarEdicionPerfil] = useState(false);
  const [estiloActivo, actualizarEstiloActivo] = useState(() => {
    const guardado = localStorage.getItem(CLAVE_ESTILO_APLICACION);
    return ESTILOS_APLICACION.some((estilo) => estilo.id === guardado)
      ? guardado!
      : ESTILOS_APLICACION[0].id;
  });

  useEffect(() => {
    let vigente = true;
    actualizarCarga(true);
    actualizarErrorCarga('');

    obtenerPerfilMedico(usuario.id)
      .then((perfilCargado) => {
        if (vigente) {
          actualizarPerfil(perfilCargado);
          if (!perfilCargado) actualizarErrorCarga('No se encontró el perfil médico.');
        }
      })
      .catch((error: unknown) => {
        console.error('No se pudo cargar el perfil médico:', error);
        if (vigente) actualizarErrorCarga('No se pudieron cargar los datos del perfil.');
      })
      .finally(() => {
        if (vigente) actualizarCarga(false);
      });

    return () => {
      vigente = false;
    };
  }, [usuario.id]);

  useEffect(() => {
    document.documentElement.dataset.estilo = estiloActivo;
    localStorage.setItem(CLAVE_ESTILO_APLICACION, estiloActivo);
  }, [estiloActivo]);

  const sincronizarPerfilActualizado = (usuarioActualizado: AuthenticatedUser) => {
    alActualizarPerfil(usuarioActualizado);
    void obtenerPerfilMedico(usuarioActualizado.id)
      .then(actualizarPerfil)
      .catch((error: unknown) => {
        console.error('No se pudo refrescar el perfil médico:', error);
      });
  };

  if (editandoPerfil && perfil) {
    return (
      <FormularioRegistroComponents
        modo="edicion"
        medicoId={usuario.id}
        perfilInicial={perfil}
        alActualizarPerfil={sincronizarPerfilActualizado}
        alCancelar={() => actualizarEdicionPerfil(false)}
      />
    );
  }

  return (
    <main className="settings-page">
      <BackButtonComponent fallbackTo="/" />
      <p className="patients-page__eyebrow">BIO-TEC</p>
      <h1 className="settings-page__title">Configuración</h1>

      {errorCarga && <Alert color="red" mb="md">{errorCarga}</Alert>}

      <div className="settings-page__grid">
        <Paper className="settings-panel" withBorder>
          <div className="settings-panel__heading">
            <div>
              <h2>Perfil de Usuario</h2>
              <Text size="sm" c="dimmed">
                {perfil ? `${perfil.nombre} ${perfil.apellido}` : cargando ? 'Cargando perfil…' : usuario.fullName}
              </Text>
            </div>
            <Button
              type="button"
              leftSection={<Pencil size={16} aria-hidden="true" />}
              onClick={() => actualizarEdicionPerfil(true)}
              disabled={cargando || !perfil}
            >
              Editar Perfil
            </Button>
          </div>
        </Paper>

        <Paper className="settings-panel settings-panel--style" withBorder>
          <h2>Estilo</h2>
          <div className="settings-style-options" role="radiogroup" aria-label="Estilo de la aplicación">
            {ESTILOS_APLICACION.map((estilo) => {
              const seleccionado = estiloActivo === estilo.id;
              return (
                <button
                  key={estilo.id}
                  type="button"
                  className={`settings-style-swatch${seleccionado ? ' settings-style-swatch--selected' : ''}`}
                  style={{ background: estilo.degradado }}
                  role="radio"
                  aria-checked={seleccionado}
                  aria-label={estilo.nombre}
                  title={estilo.descripcion}
                  onClick={() => actualizarEstiloActivo(estilo.id)}
                >
                  {seleccionado && <Check size={18} aria-hidden="true" />}
                </button>
              );
            })}
          </div>
          <Text size="sm" c="dimmed">
            {ESTILOS_APLICACION.find((estilo) => estilo.id === estiloActivo)?.nombre}
          </Text>
        </Paper>
      </div>
    </main>
  );
};
