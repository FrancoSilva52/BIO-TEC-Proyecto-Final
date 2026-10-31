
import { Paper, Text, Title } from '@mantine/core';
import type { Paciente } from '../../pacientes/type/paciente.interface';
import type { PlantillaAnalisis } from '../data/plantillasAnalisis.data';
import { HemogramaBasicoComponents } from './plantillas/hemogramaBasico.components';
import { ParametrosFormularioComponents } from './parametrosFormulario.components';

type DiccionarioFormulariosComponentsProps = {
  plantilla: PlantillaAnalisis;
  paciente: Paciente;
  valores: Record<string, string>;
  alCambiarValor: (parametroId: string, valor: string) => void;
  alGuardar: () => void;
};

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
