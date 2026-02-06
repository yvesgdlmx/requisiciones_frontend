import * as XLSX from 'xlsx';

export const exportarHistorialAExcel = (historial, nombreArchivo = 'historial-gastos') => {
  // Función para obtener símbolo de moneda
  const getSimboloMoneda = (moneda) => {
    const simbolos = {
      MXN: "$",
      USD: "$",
      EUR: "€",
    };
    return simbolos[moneda] || "$";
  };

  // Función para formatear monto con moneda
  const formatearMontoConMoneda = (cantidad, moneda = "MXN") => {
    const monto = formatearMonto(cantidad);
    const simbolo = getSimboloMoneda(moneda);
    return `${simbolo}${monto} ${moneda}`;
  };

  // Preparar datos formateados - MISMO ORDEN QUE LA TABLA
  const datosFormateados = historial.map((item) => ({
    'Categoría': item.categoriaNombre || 'Sin categoría',
    'Status': item.statusRequisicion ? item.statusRequisicion.charAt(0).toUpperCase() + item.statusRequisicion.slice(1) : 'Sin status',
    'Presupuesto Total': formatearMontoConMoneda(item.presupuestoTotal, item.moneda),
    'Monto Gastado': formatearMontoConMoneda(item.montoGastado, item.moneda),
    'Saldo Disponible': formatearMontoConMoneda(item.saldoDisponible, item.moneda),
    'Fecha Monto': formatearSoloFecha(item.fechaGasto),
    'Hora Monto': formatearSoloHora(item.fechaGasto),
    'Período (días)': item.diasPeriodo,
    'Fecha Inicio': formatearSoloFecha(item.fechaInicioPeriodo),
    'Hora Inicio': formatearSoloHora(item.fechaInicioPeriodo),
    'Fecha Fin': formatearSoloFecha(item.fechaFinPeriodo),
    'Hora Fin': formatearSoloHora(item.fechaFinPeriodo),
    'Moneda': item.moneda || 'MXN',
    'Comprador': item.usuarioComprador || 'Sin Comprador',
  }));

  // Crear workbook y worksheet
  const worksheet = XLSX.utils.json_to_sheet(datosFormateados);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');

  // Ajustar ancho de columnas - ORDEN ACTUALIZADO
  worksheet['!cols'] = [
    { wch: 20 }, // Categoría
    { wch: 18 }, // Status
    { wch: 18 }, // Presupuesto Total
    { wch: 18 }, // Monto Gastado
    { wch: 18 }, // Saldo Disponible
    { wch: 15 }, // Fecha Monto
    { wch: 12 }, // Hora Monto
    { wch: 12 }, // Período (días)
    { wch: 15 }, // Fecha Inicio
    { wch: 12 }, // Hora Inicio
    { wch: 15 }, // Fecha Fin
    { wch: 12 }, // Hora Fin
    { wch: 10 }, // Moneda
    { wch: 20 }, // Comprador
  ];

  // Descargar archivo
  XLSX.writeFile(workbook, `${nombreArchivo}-${new Date().toISOString().split('T')[0]}.xlsx`);
};

// Funciones auxiliares de formateo
const formatearMonto = (cantidad) => {
  return parseFloat(cantidad).toLocaleString('es-MX', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatearSoloFecha = (fecha) => {
  if (!fecha) return 'Sin fecha';
  return new Date(fecha).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const formatearSoloHora = (fecha) => {
  if (!fecha) return 'Sin hora';
  return new Date(fecha).toLocaleTimeString('es-MX', {
    hour: '2-digit',
    minute: '2-digit',
  });
};