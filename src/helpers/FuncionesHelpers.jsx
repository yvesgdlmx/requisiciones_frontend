export const capitalizeWords = (texto) => {
  if (typeof texto !== "string") {
    return "";
  }

  return texto
    .split(" ")
    .map((palabra) => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(" ");
};

const statusConAcentos = {
  "esperando autorizacion": "esperando autorizaci\u00f3n",
  "proveedor preparando envio": "proveedor preparando env\u00edo",
  "proveedor preparando env\u00edo": "proveedor preparando env\u00edo",
  "proveedor preparando envÃ­o": "proveedor preparando env\u00edo",
  "proveedor preparando envÃƒÂ­o": "proveedor preparando env\u00edo",
  "liberacion aduanal": "liberaci\u00f3n aduanal",
};

export const normalizarStatusRequisicion = (status) => {
  if (typeof status !== "string") return "";

  const statusLimpio = status
    .toLowerCase()
    .replaceAll("Ã­", "\u00ed")
    .replaceAll("ÃƒÂ­", "\u00ed")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return statusLimpio;
};

export const formatearStatusRequisicion = (status) => {
  if (typeof status !== "string") return "";
  const statusNormalizado = normalizarStatusRequisicion(status);
  return capitalizeWords(statusConAcentos[statusNormalizado] || status);
};

export const esRequisicionInactiva = (fechaCambioStatus, status) => {
  const estadosFinales = ["concluida", "cancelada", "rechazada"];
  if (estadosFinales.includes(status)) return false;

  const ahora = new Date();
  const fechaCambio = new Date(fechaCambioStatus);
  const diferencia = ahora - fechaCambio;
  const horas48 = 48 * 60 * 60 * 1000;

  return diferencia > horas48;
};
