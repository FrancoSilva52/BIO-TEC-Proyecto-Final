import type { ValoresFormularioPaciente } from '../types/valoresFormularioPaciente.type';

const FECHA_MINIMA_NACIMIENTO = '1900-01-01';

export const obtenerFechaActual = (fecha = new Date()) => {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const dia = String(fecha.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
};

const fechaEsValida = (valor: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const [anio, mes, dia] = valor.split('-').map(Number);
  const fecha = new Date(anio, mes - 1, dia);
  return fecha.getFullYear() === anio && fecha.getMonth() === mes - 1 && fecha.getDate() === dia;
};

export const calcularEdad = (fechaNacimiento: string, hoy = new Date()): number | null => {
  if (!fechaEsValida(fechaNacimiento)) return null;
  if (
    fechaNacimiento < FECHA_MINIMA_NACIMIENTO ||
    fechaNacimiento > obtenerFechaActual(hoy)
  ) {
    return null;
  }

  const [anio, mes, dia] = fechaNacimiento.split('-').map(Number);
  let edad = hoy.getFullYear() - anio;
  if (hoy.getMonth() + 1 < mes || (hoy.getMonth() + 1 === mes && hoy.getDate() < dia)) {
    edad -= 1;
  }
  return edad;
};

export const validarDatosPaciente = (
  valores: ValoresFormularioPaciente,
  hoy = new Date(),
): string | null => {
  if (!valores.nombre.trim() || !valores.apellido.trim()) {
    return 'Completá el nombre y el apellido del paciente.';
  }
  if (!valores.dni.replace(/[^a-zA-Z0-9]/g, '').trim()) {
    return 'Ingresá un DNI válido.';
  }
  if (!fechaEsValida(valores.fechaNacimiento)) {
    return 'Ingresá una fecha de nacimiento válida.';
  }
  if (!valores.sexo) return 'Seleccioná el sexo del paciente.';
  if (valores.fechaNacimiento < FECHA_MINIMA_NACIMIENTO || valores.fechaNacimiento > obtenerFechaActual(hoy)) {
    return 'La fecha debe estar entre el 1/1/1900 y el día de hoy.';
  }
  if (!valores.provincia.trim() || !valores.localidad.trim()) {
    return 'Completá la provincia y la localidad.';
  }
  if (valores.poseeObraSocial && !valores.obraSocial.trim()) {
    return 'Indicá el nombre de la obra social.';
  }
  return null;
};