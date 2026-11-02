import type { HojaImpresionAnalisisProps } from '../types/hojaImpresionAnalisisProps.type';
import '../../../styles/formularios/formularios.css';

export const HojaImpresionAnalisisComponents = ({ analisis }: HojaImpresionAnalisisProps) => (
  <article className="analysis-print-sheet">
    <header className="analysis-print-sheet__header">
      <h1>{analisis.institucion || 'Análisis Clínicos de Salud'}</h1>
      <div className="analysis-print-sheet__metadata">
        <span><strong>Paciente:</strong> {analisis.paciente}</span>
        <span><strong>Dr/a:</strong> {analisis.profesional}</span>
        <span><strong>Fecha:</strong> {analisis.fecha}</span>
      </div>
      <h2>{analisis.plantilla}</h2>
    </header>
    {analisis.secciones.map((seccion) => {
      const tieneReferencias = seccion.resultados.some((resultado) => {
        const referencia = resultado.referencia.trim().toLocaleLowerCase('es');
        return referencia !== '' && referencia !== 'no indicada en el informe';
      });

      return (
        <section className="analysis-print-sheet__section" key={seccion.nombre}>
          <h3>{seccion.nombre}</h3>
          <table>
            <thead>
              <tr>
                <th>Parámetro</th>
                <th>Resultado</th>
                {tieneReferencias && <th>Valor referencia</th>}
              </tr>
            </thead>
            <tbody>
              {seccion.resultados.map((resultado) => (
                <tr key={resultado.parametro}>
                  <td>{resultado.parametro}</td>
                  <td>
                    {resultado.resultado || '—'}
                    {resultado.unidad ? ` ${resultado.unidad}` : ''}
                  </td>
                  {tieneReferencias && <td>{resultado.referencia || '—'}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      );
    })}
  </article>
);