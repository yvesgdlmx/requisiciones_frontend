import { Link } from "react-router-dom";
import ReportePorcentajesStatus from "./ReportePorcentajesStatus";
import "./ExportarRequisiciones.css";
import React, { useEffect, useMemo, useState } from "react";
import {
  FiClock,
  FiHelpCircle,
  FiChevronRight,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import useExportarRequisiciones from "../../hooks/useExportarRequisiciones";
import { formatearStatusRequisicion } from "../../helpers/FuncionesHelpers";
import clienteAxios from "../../config/clienteAxios";

const nombresTiempos = {
  creadaCotizando: "Creada a cotizando",
  creadaRechazada: "Creada a rechazada",
  esperandoAutorizacionAutorizada: "Esperando autorizacion a autorizada",
  cotizandoProveedorPreparandoEnvio: "Cotizando a proveedor preparando envio",
  creadaConcluida: "Creada a concluida",
};

const getStatusColor = (status) => {
  const colores = {
    creada: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
    rechazada: "border-red-100 bg-red-50 text-red-700",
    cotizando: "border-[#DBEAFE] bg-[#DBEAFE]/60 text-[#1E40AF]",
    "esperando autorizacion": "border-amber-100 bg-amber-50 text-amber-700",
    autorizada: "border-cyan-100 bg-cyan-50 text-cyan-700",
    "proceso de pago": "border-pink-100 bg-pink-50 text-pink-700",
    "proveedor preparando envio": "border-indigo-100 bg-indigo-50 text-indigo-700",
    "proveedor preparando envío": "border-indigo-100 bg-indigo-50 text-indigo-700",
    "proveedor preparando envÃ­o": "border-indigo-100 bg-indigo-50 text-indigo-700",
    "proveedor preparando envÃƒÂ­o": "border-indigo-100 bg-indigo-50 text-indigo-700",
    "liberacion aduanal": "border-violet-100 bg-violet-50 text-violet-700",
    "proceso de entrega": "border-orange-100 bg-orange-50 text-orange-700",
    "entregada parcial": "border-teal-100 bg-teal-50 text-teal-700",
    concluida: "border-emerald-100 bg-emerald-50 text-emerald-800",
    cancelada: "border-red-100 bg-red-50 text-red-800",
  };

  return colores[status] || "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]";
};

const ReporteTiemposRequisiciones = () => {
  const registrosPorPagina = 10;
  const [reporte, setReporte] = useState({
    totalRequisiciones: 0,
    metricas: [],
    requisiciones: [],
  });
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerReporteTiempos = async () => {
    try {
      setCargando(true);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.get("/requisiciones/reportes/tiempos", config);

      setReporte({
        totalRequisiciones: data.totalRequisiciones || 0,
        metricas: data.metricas || [],
        requisiciones: data.requisiciones || [],
      });
      setError(null);
    } catch (error) {
      console.error("Error al obtener reporte de tiempos:", error);
      setError(error.response?.data?.msg || "Error al obtener reporte de tiempos");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    obtenerReporteTiempos();
  }, []);

  const requisicionesFiltradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) return reporte.requisiciones;

    return reporte.requisiciones.filter((req) => {
      const valores = [
        req.folio,
        req.solicitante,
        req.area,
        req.statusActual,
        req.objetivo,
      ];

      return valores.some((valor) => String(valor || "").toLowerCase().includes(texto));
    });
  }, [reporte.requisiciones, busqueda]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(requisicionesFiltradas.length / registrosPorPagina)
  );
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(
    indiceInicial + registrosPorPagina,
    requisicionesFiltradas.length
  );
  const requisicionesPaginadas = requisicionesFiltradas.slice(
    indiceInicial,
    indiceFinal
  );

  const paginasVisibles = useMemo(() => {
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);

    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  }, [paginaActual, totalPaginas]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, reporte.requisiciones]);

  const formatearFechaMexico = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const renderTiempo = (tiempo) => {
    const completado = tiempo?.completado;

    return (
      <span
        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
          completado
            ? "border-emerald-100 bg-emerald-50 text-emerald-700"
            : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]"
        }`}
      >
        {tiempo?.texto || "Pendiente"}
      </span>
    );
  };

  return (
    <>
      <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="relative max-w-2xl">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Buscar por folio, solicitante, area o status..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full rounded-lg border border-[#E2E8F0] bg-white px-11 py-3 text-sm text-[#334155] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
          />
        </div>

        <button
          type="button"
          onClick={obtenerReporteTiempos}
          className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
        >
          <FiRefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mx-6 mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-10 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
            <FiRefreshCw className="h-5 w-5 animate-spin" />
          </div>
          <p className="font-semibold text-slate-700">Calculando tiempos...</p>
        </div>
      ) : (
        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-6">
          <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
            <div className="border-b border-[#E2E8F0] px-5 py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#334155]">
                    Detalle por requisicion
                  </h2>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Los tiempos pendientes indican que la requisicion todavia no completa ese tramo.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                    <FiClock className="h-3.5 w-3.5" />
                    {requisicionesFiltradas.length} registros
                  </span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-[1280px] divide-y divide-[#E2E8F0]">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Folio
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Solicitante
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Status actual
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                      Fecha creada
                    </th>
                    {Object.entries(nombresTiempos).map(([clave, nombre]) => (
                      <th key={clave} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                        {nombre}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {requisicionesPaginadas.map((req) => (
                    <tr key={req.id} className="transition hover:bg-[#F8FAFC]">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-[#334155]">{req.folio}</p>
                        <p className="text-xs text-[#64748B]">{req.area || "Sin area"}</p>
                      </td>
                      <td className="px-5 py-4 text-sm font-medium text-[#334155]">
                        {req.solicitante || "Sin solicitante"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                            req.statusActual
                          )}`}
                        >
                          {formatearStatusRequisicion(req.statusActual)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-[#64748B]">
                        {formatearFechaMexico(req.fechaCreada)}
                      </td>
                      {Object.keys(nombresTiempos).map((clave) => (
                        <td key={clave} className="px-5 py-4">
                          {renderTiempo(req.tiempos?.[clave])}
                        </td>
                      ))}
                    </tr>
                  ))}

                  {requisicionesFiltradas.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-5 py-10 text-center">
                        <p className="font-semibold text-[#64748B]">
                          No hay requisiciones para mostrar con la busqueda actual.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {requisicionesFiltradas.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#64748B]">
                  Mostrando{" "}
                  <span className="font-semibold text-[#334155]">
                    {indiceInicial + 1}
                  </span>
                  {" "}a{" "}
                  <span className="font-semibold text-[#334155]">
                    {indiceFinal}
                  </span>
                  {" "}de{" "}
                  <span className="font-semibold text-[#334155]">
                    {requisicionesFiltradas.length}
                  </span>
                  {" "}requisiciones
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                    disabled={paginaActual === 1}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Anterior
                  </button>

                  <div className="hidden items-center gap-1 sm:flex">
                    {paginasVisibles.map((pagina) => (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() => setPaginaActual(pagina)}
                        className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
                          pagina === paginaActual
                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                            : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
                        }`}
                      >
                        {pagina}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setPaginaActual((pagina) => Math.min(totalPaginas, pagina + 1))}
                    disabled={paginaActual === totalPaginas}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </>
  );
};

const ReportesRequisiciones = () => {
  const { requisiciones, cargando, error, obtenerRequisiciones } = useExportarRequisiciones();
  const [reporteActivo, setReporteActivo] = useState("status");
  const esStatus = reporteActivo === "status";

  return (
    <div className="export-page status-page">
      <header className="export-header">
        <div>
          <h1>{esStatus ? "Porcentaje por status" : "Tiempos por proceso"}</h1>
          <nav className="export-breadcrumb" aria-label="Ruta de navegación">
            <Link to="/requisiciones">Requisiciones</Link><FiChevronRight aria-hidden="true" />
            <span>Reportes</span>
          </nav>
        </div>
        <div className="export-header-actions">
          <span className="export-format"><span /> Reportes</span>
          <Link className="export-button" to="/requisiciones/ayuda"><FiHelpCircle /> Ayuda</Link>
        </div>
      </header>
      <div className="export-tabs" role="group" aria-label="Tipo de reporte">
        <button type="button" className={esStatus ? "is-active" : ""} aria-pressed={esStatus} onClick={() => setReporteActivo("status")}>Porcentaje por status</button>
        <button type="button" className={!esStatus ? "is-active" : ""} aria-pressed={!esStatus} onClick={() => setReporteActivo("tiempos")}>Tiempos por proceso</button>
      </div>
      <div hidden={!esStatus}>
        <ReportePorcentajesStatus requisiciones={requisiciones} cargando={cargando} error={error} actualizar={obtenerRequisiciones} />
      </div>
      {!esStatus && <ReporteTiemposRequisiciones />}
    </div>
  );
};

export default ReportesRequisiciones;
