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
        timeZone: "UTC"
    });
};

const formatearSoloHora = (fecha) => {
    if (!fecha) return 'Sin hora';
    return new Date(fecha).toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: "UTC"
    });
};

export const exportarRequisicionesAExcel = (
    requisiciones,
    nombreArchivo = "requisiciones"
) => {
    const formatearFechaMexico = (fecha) => {
        if (!fecha) return "Sin fecha";

        return new Date(fecha).toLocaleString("es-MX", {
            timeZone: "America/Mexico_City",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
        });
    }

    const obtenerSolicitante = (req) => {
        if (req.usuario) {
            return `${req.usuario.nombre || ""} ${req.usuario.apellido || ""}`.trim();
        }

        return req.solicitante || "Sin solicitante";
    }

    const formatearArchivos = (archivos) => {
        if (!Array.isArray(archivos) || archivos.length === 0) return "";

        return archivos
            .map((archivo) => {
                if (typeof archivo === "string") return archivo;
                return archivo.url || "";
            })
            .filter(Boolean)
            .join(" | ")
    }

    const formatearLinks = (links) => {
        if (!Array.isArray(links) || links.length === 0) return "";
        return links.filter(Boolean).join(" | ")
    }

    const datosRequisiciones = requisiciones.map((req) => ({
        Folio: req.folio || "",
        Fecha: formatearFechaMexico(req.fechaHora),
        Solicitante: obtenerSolicitante(req),
        Email: req.usuario?.email || "",
        Area: req.area || "",
        Objetivo: req.objetivo || "",
        Prioridad: req.prioridad || "",
        Status: req.status || "",
        Comprador: req.comprador || "",
        Proveedor: req.proveedor || "",
        "Tipo de compra": req.tipoCompra || "",
        Monto: req.monto || "",
        ETA: formatearFechaMexico(req.eta),
        "Numero orden compra": req.numeroOrdenCompra || "",
        Cotizacion: req.cotizacion || "",
        "Numero guia": req.numeroGuia || "",
        "numero orden venta": req.numeroOrdenVenta || "",
        Factura: req.factura || "",
        Categoria: req.categoria?.nombre || "",
        Comentario: req.comentario || "",
        "Comentario autorizador": req.comentarioAutorizador || "",
        Links: formatearLinks(req.links),
        Archivos: formatearArchivos(req.archivos),
    }));

    const datosArticulos = requisiciones.flatMap((req) => {
        const articulos = Array.isArray(req.articulos) ? req.articulos : [];

        if (articulos.length === 0) {
            return [
                {
                    Folio: req.folio || "",
                    "Numero parte": "",
                    Cantidad: "",
                    Unidad: "",
                    Descripcion: "Sin articulos",
                },
            ]
        }

        return articulos.map((articulo) => ({
            Folio: req.folio || "",
            "Numero parte": articulo.numeroParte || "",
            Cantidad: articulo.cantidad || "",
            Unidad: articulo.unidadMedida || "",
            Descripcion: articulo.descripcion || ""
        }))
    })

    const workbook = XLSX.utils.book_new();

    const hojaRequisiciones = XLSX.utils.json_to_sheet(datosRequisiciones);
    hojaRequisiciones["!cols"] = [
        { wch: 16 },
        { wch: 24 },
        { wch: 24 },
        { wch: 28 },
        { wch: 18 },
        { wch: 40 },
        { wch: 14 },
        { wch: 24 },
        { wch: 24 },
        { wch: 24 },
        { wch: 18 },
        { wch: 16 },
        { wch: 24 },
        { wch: 22 },
        { wch: 18 },
        { wch: 18 },
        { wch: 22 },
        { wch: 18 },
        { wch: 20 },
        { wch: 40 },
        { wch: 40 },
        { wch: 50 },
        { wch: 50 },
    ];

    const hojaArticulos = XLSX.utils.json_to_sheet(datosArticulos);
    hojaArticulos["!cols"] = [
        { wch: 16 },
        { wch: 18 },
        { wch: 12 },
        { wch: 16 },
        { wch: 60 },
    ];

    XLSX.utils.book_append_sheet(workbook, hojaRequisiciones, "Requisiciones");
    XLSX.utils.book_append_sheet(workbook, hojaArticulos, "Articulos");

    XLSX.writeFile(
        workbook,
        `${nombreArchivo}-${new Date().toISOString().split("T")[0]}.xlsx`
    )
}
