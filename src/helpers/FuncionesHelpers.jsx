// Función que capitaliza la primera letra de cada palabra en el texto
const capitalizeWords = (texto) => {
  if (typeof texto !== "string") {
    // Puedes optar por retornar una cadena vacía o convertir el valor a string
    return "";
  }
  return texto
    .split(' ')
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
};
export { capitalizeWords }

export const esRequisicionInactiva = (fechaCambioStatus, status) => {
  const estadosFinales = ['concluida', 'cancelada', 'rechazada' ];
  if(estadosFinales.includes(status)) return false;

  const ahora = new Date();
  const fechaCambio = new Date(fechaCambioStatus);
  const diferencia = ahora - fechaCambio;
  const horas48 = 48 * 60 * 60 * 1000;

  return diferencia > horas48
};