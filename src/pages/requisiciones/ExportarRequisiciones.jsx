import React from "react";
import useExportarRequisiciones from "../../hooks/useExportarRequisiciones";
import { exportarRequisicionesAExcel } from "../../services/excelService";

const ExportarRequisiciones = () => {
  const {
    requisiciones,
    requisicionesFiltradas,
    cargando,
    error,
    modoExportacion,
    setModoExportacion,
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
    folio,
    setFolio,
    statusFiltro,
    setStatusFiltro,
    statusDisponibles,
    obtenerRequisiciones,
  } = useExportarRequisiciones();

  const puedeExportar = requisicionesFiltradas.length > 0;

  const formatearFechaMexico = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const obtenerSolicitante = (req) => {
    if (req.usuario) {
      return `${req.usuario.nombre || ""} ${req.usuario.apellido || ""}`.trim();
    }

    return req.solicitante || "Sin solicitante";
  };

  const capitalizar = (texto) => {
    if (!texto) return "Sin dato";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const getStatusColor = (status) => {
    const colores = {
      creada: "bg-gray-100 text-gray-800",
      rechazada: "bg-red-100 text-red-800",
      cotizando: "bg-blue-100 text-blue-800",
      aprobada: "bg-green-100 text-green-800",
      "esperando autorizacion": "bg-yellow-100 text-yellow-800",
      autorizada: "bg-cyan-100 text-cyan-800",
      "proceso de pago": "bg-pink-100 text-pink-800",
      "proveedor preparando envío": "bg-indigo-100 text-indigo-800",
      "liberacion aduanal": "bg-purple-100 text-purple-800",
      "proceso de entrega": "bg-orange-100 text-orange-800",
      "entregada parcial": "bg-teal-100 text-teal-800",
      concluida: "bg-green-200 text-green-900",
      cancelada: "bg-red-200 text-red-900",
    };

    return colores[status] || "bg-gray-100 text-gray-800";
  };

  const resumenStatus = requisicionesFiltradas.reduce((acc, req) => {
    const status = req.status || "sin status";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const totalArticulos = requisicionesFiltradas.reduce((total, req) => {
    return total + (Array.isArray(req.articulos) ? req.articulos.length : 0);
  }, 0);

  const totalConMonto = requisicionesFiltradas.filter((req) => req.monto).length;
  const totalConProveedor = requisicionesFiltradas.filter((req) => req.proveedor).length;
  const totalInternacionales = requisicionesFiltradas.filter(
    (req) => req.tipoCompra === "internacional"
  ).length;
  const totalConArchivos = requisicionesFiltradas.filter(
    (req) => Array.isArray(req.archivos) && req.archivos.length > 0
  ).length;

  const getNombreArchivo = () => {
    const statusTexto = statusFiltro
      ? `-${statusFiltro.replaceAll(" ", "-")}`
      : "";

    if (modoExportacion === "todas") return `requisiciones-todas${statusTexto}`;
    if (modoExportacion === "folio") return `requisicion-${folio || "folio"}${statusTexto}`;
    if (modoExportacion === "rango") {
      return `requisiciones-${fechaInicio || "inicio"}-${fechaFin || "fin"}${statusTexto}`;
    }

    return `requisiciones${statusTexto}`;
  };

  const handleExportar = () => {
    if (!puedeExportar) return;

    exportarRequisicionesAExcel(
      requisicionesFiltradas,
      getNombreArchivo()
    );
  };

  const getFiltroAplicado = () => {
    const filtroStatus = statusFiltro
      ? ` | Status: ${capitalizar(statusFiltro)}`
      : "";

    if (modoExportacion === "todas") return `Todas las requisiciones${filtroStatus}`;
    if (modoExportacion === "folio") {
      return folio ? `Folio: ${folio}${filtroStatus}` : `Folio pendiente${filtroStatus}`;
    }
    if (modoExportacion === "rango") {
      if (!fechaInicio || !fechaFin) return `Rango pendiente${filtroStatus}`;
      return `${fechaInicio} a ${fechaFin}${filtroStatus}`;
    }

    return statusFiltro ? `Status: ${capitalizar(statusFiltro)}` : "Sin filtro";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-500 text-center">
        Exportar Requisiciones
      </h2>

      <p className="text-center mb-6 text-gray-500">
        Descarga requisiciones en Excel por rango de fechas, folio o listado completo
      </p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Tipo de descarga
            </label>
            <select
              value={modoExportacion}
              onChange={(e) => setModoExportacion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todas">Todas</option>
              <option value="rango">Por rango de fecha</option>
              <option value="folio">Por folio</option>
            </select>
          </div>

          {modoExportacion === "rango" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Fecha inicio
                </label>
                <input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Fecha fin
                </label>
                <input
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          {modoExportacion === "folio" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Folio
              </label>
              <input
                type="text"
                value={folio}
                onChange={(e) => setFolio(e.target.value)}
                placeholder="Ej. C26-00001"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Status
            </label>
            <select
              value={statusFiltro}
              onChange={(e) => setStatusFiltro(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los status</option>
              {statusDisponibles.map((status) => (
                <option key={status} value={status}>
                  {capitalizar(status)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={obtenerRequisiciones}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition-colors shadow"
            >
              Actualizar
            </button>

            <button
              type="button"
              onClick={handleExportar}
              disabled={!puedeExportar}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded transition-colors shadow"
            >
              Descargar
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-5">
          <p className="text-center text-gray-500 py-8">
            Cargando requisiciones...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
              <p className="text-sm text-gray-500">Total disponibles</p>
              <p className="text-2xl font-bold text-gray-700">
                {requisiciones.length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
              <p className="text-sm text-gray-500">Registros a exportar</p>
              <p className="text-2xl font-bold text-green-700">
                {requisicionesFiltradas.length}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
              <p className="text-sm text-gray-500">Articulos incluidos</p>
              <p className="text-2xl font-bold text-blue-700">
                {totalArticulos}
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-md">
              <p className="text-sm text-gray-500">Modo</p>
              <p className="text-xl font-bold text-blue-700 capitalize">
                {modoExportacion}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl shadow-md p-5">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Resumen del archivo
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-1">
                      Nombre estimado
                    </p>
                    <p className="text-sm font-semibold text-gray-700 break-all">
                      {getNombreArchivo()}-{new Date().toISOString().split("T")[0]}.xlsx
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-1">
                      Filtro aplicado
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {getFiltroAplicado()}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-1">
                      Hojas incluidas
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      Requisiciones y Articulos
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs uppercase font-semibold text-gray-500 mb-1">
                      Fecha de descarga
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {formatearFechaMexico(new Date())}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="border border-blue-100 bg-blue-50 rounded-lg p-3">
                    <p className="text-xs text-blue-700">Con monto</p>
                    <p className="text-xl font-bold text-blue-800">{totalConMonto}</p>
                  </div>
                  <div className="border border-green-100 bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-700">Con proveedor</p>
                    <p className="text-xl font-bold text-green-800">{totalConProveedor}</p>
                  </div>
                  <div className="border border-purple-100 bg-purple-50 rounded-lg p-3">
                    <p className="text-xs text-purple-700">Internacionales</p>
                    <p className="text-xl font-bold text-purple-800">{totalInternacionales}</p>
                  </div>
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">Con archivos</p>
                    <p className="text-xl font-bold text-gray-700">{totalConArchivos}</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {!puedeExportar && (
            <p className="text-center text-gray-400">
              No hay requisiciones para exportar con los filtros seleccionados.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ExportarRequisiciones;
