import React from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiDatabase,
  FiDownload,
  FiFileText,
  FiFilter,
  FiHash,
  FiPackage,
  FiPaperclip,
  FiRefreshCw,
  FiSearch,
  FiTruck,
} from "react-icons/fi";
import useExportarRequisiciones from "../../hooks/useExportarRequisiciones";
import { exportarRequisicionesAExcel } from "../../services/excelService";
import { formatearStatusRequisicion } from "../../helpers/FuncionesHelpers";

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
  const fechaDescarga = new Date();

  const formatearFechaMexico = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const capitalizar = (texto) => {
    if (!texto) return "Sin dato";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

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

  const campoBase =
    "w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]";

  const metricasPrincipales = [
    {
      label: "Disponibles",
      value: requisiciones.length,
      icon: FiDatabase,
      color: "text-[#0F172A]",
    },
    {
      label: "A exportar",
      value: requisicionesFiltradas.length,
      icon: FiCheckCircle,
      color: "text-emerald-700",
    },
    {
      label: "Artículos",
      value: totalArticulos,
      icon: FiPackage,
      color: "text-[#2563EB]",
    },
    {
      label: "Modo",
      value: capitalizar(modoExportacion),
      icon: FiFilter,
      color: "text-[#0F172A]",
    },
  ];

  const detalleArchivo = [
    {
      label: "Nombre estimado",
      value: `${getNombreArchivo()}-${fechaDescarga.toISOString().split("T")[0]}.xlsx`,
    },
    {
      label: "Filtro aplicado",
      value: getFiltroAplicado(),
    },
    {
      label: "Hojas incluidas",
      value: "Requisiciones y Artículos",
    },
    {
      label: "Fecha de descarga",
      value: formatearFechaMexico(fechaDescarga),
    },
  ];

  const metricasArchivo = [
    {
      label: "Con monto",
      value: totalConMonto,
      icon: FiCheckCircle,
      className: "border-[#DBEAFE] bg-[#DBEAFE]/55 text-[#1E40AF]",
    },
    {
      label: "Con proveedor",
      value: totalConProveedor,
      icon: FiTruck,
      className: "border-emerald-100 bg-emerald-50 text-emerald-800",
    },
    {
      label: "Internacionales",
      value: totalInternacionales,
      icon: FiDatabase,
      className: "border-violet-100 bg-violet-50 text-violet-800",
    },
    {
      label: "Con archivos",
      value: totalConArchivos,
      icon: FiPaperclip,
      className: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiFileText className="h-3.5 w-3.5" />
                Reportería
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Exportar requisiciones
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Genera archivos Excel por rango de fechas, folio, status o listado completo.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs text-[#64748B]">Registros listos</p>
                <p className="text-2xl font-semibold text-[#0F172A]">{requisicionesFiltradas.length}</p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="text-xs text-[#64748B]">Formato</p>
                <p className="text-2xl font-semibold text-[#334155]">Excel</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-8 sm:p-9 xl:grid-cols-[1fr_auto] xl:items-end">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FiDownload className="h-4 w-4 text-slate-400" />
                Tipo de descarga
              </label>
              <select
                value={modoExportacion}
                onChange={(e) => setModoExportacion(e.target.value)}
                className={campoBase}
              >
                <option value="todas">Todas</option>
                <option value="rango">Por rango de fecha</option>
                <option value="folio">Por folio</option>
              </select>
            </div>

            {modoExportacion === "rango" && (
              <>
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FiCalendar className="h-4 w-4 text-slate-400" />
                    Fecha inicio
                  </label>
                  <input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className={campoBase}
                  />
                </div>

                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FiCalendar className="h-4 w-4 text-slate-400" />
                    Fecha fin
                  </label>
                  <input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className={campoBase}
                  />
                </div>
              </>
            )}

            {modoExportacion === "folio" && (
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FiHash className="h-4 w-4 text-slate-400" />
                  Folio
                </label>
                <input
                  type="text"
                  value={folio}
                  onChange={(e) => setFolio(e.target.value)}
                  placeholder="Ej. C26-00001"
                  className={campoBase}
                />
              </div>
            )}

            <div>
              <label className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FiFilter className="h-4 w-4 text-slate-400" />
                Status
              </label>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className={campoBase}
              >
                <option value="">Todos los status</option>
                {statusDisponibles.map((status) => (
                  <option key={status} value={status}>
                    {formatearStatusRequisicion(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:min-w-[270px]">
            <button
              type="button"
              onClick={obtenerRequisiciones}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3.5 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
            >
              <FiRefreshCw className="h-4 w-4" />
              Actualizar
            </button>

            <button
              type="button"
              onClick={handleExportar}
              disabled={!puedeExportar}
              className="inline-flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B82F6] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#64748B]"
            >
              <FiDownload className="h-4 w-4" />
              Descargar
            </button>
          </div>
        </div>

        {cargando ? (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
            </div>
            <p className="font-semibold text-slate-700">Cargando requisiciones...</p>
            <p className="mt-1 text-sm text-[#64748B]">Actualizando la información para exportar.</p>
          </div>
        ) : (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC]">
            <div className="grid grid-cols-1 gap-px border-b border-[#E2E8F0] bg-[#E2E8F0] sm:grid-cols-2 xl:grid-cols-4">
              {metricasPrincipales.map((metrica) => {
                const Icono = metrica.icon;

                return (
                  <div
                    key={metrica.label}
                    className="flex items-center justify-between gap-3 bg-white px-6 py-7"
                  >
                    <div>
                      <p className="text-sm font-medium text-[#64748B]">{metrica.label}</p>
                      <p className={`mt-1 text-2xl font-semibold ${metrica.color}`}>
                        {metrica.value}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                      <Icono className="h-5 w-5" />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-8">
              <div className="flex flex-col gap-3 pb-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#334155]">
                    Resumen del archivo
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Vista previa de los datos que se incluirán en la descarga.
                  </p>
                </div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  <FiCheckCircle className="h-3.5 w-3.5" />
                  {puedeExportar ? "Listo para exportar" : "Sin resultados"}
                </span>
              </div>

              <div className="grid overflow-hidden rounded-lg border border-[#E2E8F0] bg-white lg:grid-cols-[1.35fr_.65fr]">
                <div className="border-b border-[#E2E8F0] p-6 lg:border-b-0 lg:border-r">
                  <div className="mb-5 flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                      <FiFileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        Nombre estimado
                      </p>
                      <p className="mt-1 break-words text-base font-semibold text-[#334155]">
                        {detalleArchivo[0].value}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    {detalleArchivo.slice(1).map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg bg-[#F8FAFC] px-4 py-3"
                      >
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                          {item.label}
                        </p>
                        <p className="mt-1 break-words text-sm font-semibold text-[#334155]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="divide-y divide-[#E2E8F0] bg-[#F8FAFC]">
                  {metricasArchivo.map((metrica) => {
                    const Icono = metrica.icon;

                    return (
                      <div
                        key={metrica.label}
                        className="flex items-center justify-between gap-4 px-5 py-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-lg border ${metrica.className}`}>
                            <Icono className="h-4 w-4" />
                          </span>
                          <p className="text-sm font-semibold text-[#334155]">
                            {metrica.label}
                          </p>
                        </div>
                        <p className="text-xl font-semibold text-[#334155]">{metrica.value}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {!puedeExportar && (
                <div className="mt-5 rounded-lg border border-dashed border-[#E2E8F0] bg-white px-5 py-8 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                    <FiSearch className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-[#64748B]">
                    No hay requisiciones para exportar con los filtros seleccionados.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
    </div>
  );
};

export default ExportarRequisiciones;
