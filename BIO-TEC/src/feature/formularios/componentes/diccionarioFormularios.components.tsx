
import { Paper, Text, Title } from '@mantine/core';
import type { DiccionarioFormulariosComponentsProps } from '../types/diccionarioFormulariosComponentsProps.type';
import { HemogramaBasicoComponents } from './plantillas/hemogramaBasico.components';
import { ParametrosFormularioComponents } from './parametrosFormulario.components';

export const DiccionarioFormulariosComponents = ({
  plantilla,
  paciente,
  valores,
  alCambiarValor,
  alGuardar,
}: DiccionarioFormulariosComponentsProps) => (
  <Paper className="analysis-form-page__body" withBorder p="lg">
    <Text c="dimmed" size="sm">
      Paciente: {paciente.apellido}, {paciente.nombre}
    </Text>
    <Title order={2} mt="xs">{plantilla.nombre}</Title>
    {plantilla.id === 'hemograma' ? (
      <HemogramaBasicoComponents
        parametros={plantilla.parametros}
        valores={valores}
        alCambiarValor={alCambiarValor}
        alGuardar={alGuardar}
      />
    ) : (
      <ParametrosFormularioComponents
        parametros={plantilla.parametros}
        valores={valores}
        alCambiarValor={alCambiarValor}
        alGuardar={alGuardar}
      />
    )}
  </Paper>
);
