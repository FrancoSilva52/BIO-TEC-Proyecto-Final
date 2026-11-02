import { plantillasAnalisis } from './plantillasAnalisis.data';
import type { ResultadoAnalisisImpresion } from '../types/resultadoAnalisisImpresion.type';

const ESTILOS_DOCUMENTO_IMPRESION = `
  @page { size: A4 portrait; margin: 8mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; width: 100%; color: #111; background: #fff; font-family: Arial, sans-serif; }
  .analysis-print-sheet { width: 100%; padding: 0; font-size: 12px; line-height: 1.15; }
  .analysis-print-sheet__header { margin-bottom: 10px; text-align: center; }
  .analysis-print-sheet__header h1 { margin: 0 0 8px; font-size: 14px; font-weight: 600; }
  .analysis-print-sheet__metadata { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; font-size: 12px; text-align: left; }
  .analysis-print-sheet__header h2 { margin: 10px 0 0; font-size: 12px; font-weight: 600; text-transform: uppercase; }
  .analysis-print-sheet__section { margin-top: 8px; break-inside: avoid; }
  .analysis-print-sheet__section h3 { margin: 0 0 3px; font-size: 12px; font-weight: 600; text-align: center; text-transform: uppercase; }
  .analysis-print-sheet__section table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .analysis-print-sheet__section th, .analysis-print-sheet__section td { padding: 2px 4px; border-bottom: 1px solid #d5d9de; text-align: left; vertical-align: top; }
  .analysis-print-sheet__section th { font-weight: 600; }
  .analysis-print-sheet__section tr { break-inside: avoid; }
  .analysis-print-sheet__section thead { display: table-header-group; }
`;

export const prepararSeccionesImpresion = (
  nombrePlantilla: string,
  resultadosGuardados: ResultadoAnalisisImpresion[],
) => {
  const plantilla = plantillasAnalisis.find((opcion) => opcion.nombre === nombrePlantilla);
  if (!plantilla) {
    return [{ nombre: 'Resultados', resultados: resultadosGuardados }];
  }

  const secciones = [...new Set(plantilla.parametros.map((parametro) => parametro.seccion))];
  return secciones.map((seccion) => ({
    nombre: seccion,
    resultados: plantilla.parametros
      .filter((parametro) => parametro.seccion === seccion)
      .map((parametro) => {
        const resultadoGuardado = resultadosGuardados.find(
          (resultado) => resultado.parametro === parametro.nombre,
        );

        return {
          parametro: parametro.nombre,
          resultado: resultadoGuardado?.resultado ?? '',
          unidad: parametro.unidad,
          referencia: parametro.referencia,
        };
      }),
  }));
};

export const imprimirAnalisis = (hojaImpresion: HTMLElement | null) => {
  if (!hojaImpresion) return;

  const marcoImpresion = document.createElement('iframe');
  marcoImpresion.title = 'Vista de impresión del análisis';
  marcoImpresion.setAttribute('aria-hidden', 'true');
  marcoImpresion.style.position = 'fixed';
  marcoImpresion.style.left = '-220mm';
  marcoImpresion.style.top = '0';
  marcoImpresion.style.width = '210mm';
  marcoImpresion.style.height = '297mm';
  marcoImpresion.style.border = '0';
  marcoImpresion.onload = () => {
    const ventanaImpresion = marcoImpresion.contentWindow;
    if (!ventanaImpresion) {
      marcoImpresion.remove();
      return;
    }

    ventanaImpresion.addEventListener('afterprint', () => marcoImpresion.remove(), { once: true });
    ventanaImpresion.focus();
    ventanaImpresion.print();
    window.setTimeout(() => marcoImpresion.remove(), 300000);
  };
  marcoImpresion.srcdoc = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Análisis clínico</title><style>${ESTILOS_DOCUMENTO_IMPRESION}</style></head><body>${hojaImpresion.outerHTML}</body></html>`;
  document.body.append(marcoImpresion);
};