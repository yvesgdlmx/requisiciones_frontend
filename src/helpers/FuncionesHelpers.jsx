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