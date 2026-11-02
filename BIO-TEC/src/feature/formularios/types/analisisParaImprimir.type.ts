export type AnalisisParaImprimir = {
  institucion: string;
  paciente: string;
  profesional: string;
  fecha: string;
  plantilla: string;
  secciones: {
    nombre: string;
    resultados: {
      parametro: string;
      resultado: string;
      unidad: string;
      referencia: string;
    }[];
  }[];
};
