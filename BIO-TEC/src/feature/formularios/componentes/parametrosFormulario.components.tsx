import { Button, Text, TextInput } from '@mantine/core';
import type { ParametroAnalisis } from '../data/plantillasAnalisis.data';

export type ParametrosFormularioProps = {
  parametros: ParametroAnalisis[];
  valores: Record<string, string>;
  alCambiarValor: (parametroId: string, valor: string) => void;
  alGuardar: () => void;
};

export const ParametrosFormularioComponents = ({
  parametros,
  valores,
  alCambiarValor,
  alGuardar,
}: ParametrosFormularioProps) => {
  const secciones = [...new Set(parametros.map((parametro) => parametro.seccion))];
  const hayResultados = parametros.some((parametro) => valores[parametro.id]?.trim());

  return (
    <div className="analysis-form-parameters">
      {secciones.map((seccion) => (
        <section className="analysis-form-parameters__section" key={seccion}>
          <Text className="analysis-form-parameters__section-title" fw={700}>
            {seccion}
          </Text>
          <div className="analysis-form-parameters__header" aria-hidden="true">
            <Text size="sm" fw={600}>Parámetro</Text>
            <Text size="sm" fw={600}>Resultado</Text>
            <Text size="sm" fw={600}>Valor de referencia</Text>
          </div>
          {parametros.filter((parametro) => parametro.seccion === seccion).map((parametro) => (
            <div className="analysis-form-parameters__row" key={parametro.id}>
              <Text className="analysis-form-parameters__name" fw={500}>
                {parametro.nombre}
              </Text>
              <TextInput
                type={parametro.tipo === 'numero' ? 'number' : 'text'}
                step={parametro.tipo === 'numero' ? 'any' : undefined}
                value={valores[parametro.id] ?? ''}
                onChange={(evento) => alCambiarValor(parametro.id, evento.currentTarget.value)}
                aria-label={`Resultado para ${parametro.nombre}`}
                rightSection={parametro.unidad ? <Text size="xs">{parametro.unidad}</Text> : undefined}
                rightSectionWidth={parametro.unidad ? 54 : undefined}
                autoComplete="off"
              />
              <Text className="analysis-form-parameters__reference" size="sm">
                {parametro.referencia}
              </Text>
            </div>
          ))}
        </section>
      ))}

      <div className="analysis-form-parameters__actions">
        {!hayResultados && (
          <Text size="sm" c="dimmed">
            Ingresá al menos un resultado para guardar el análisis.
          </Text>
        )}
        <Button type="button" onClick={alGuardar} disabled={!hayResultados}>
          Guardar análisis
        </Button>
      </div>
    </div>
  );
};