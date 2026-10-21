import React, { useEffect, useMemo, useState } from "react";
import {
  FiBarChart2,
  FiCalendar,
  FiClock,
  FiDatabase,
  FiDownload,
  FiFilter,
  FiHelpCircle,
  FiPieChart,
  FiRefreshCw,
  FiSearch,
  FiX,
} from "react-icons/fi";
import useExportarRequisiciones from "../../hooks/useExportarRequisiciones";
import { formatearStatusRequisicion } from "../../helpers/FuncionesHelpers";
import { exportarReporteStatusAExcel } from "../../services/excelService";
import clienteAxios from "../../config/clienteAxios";

const coloresStatus = [
  "#2563EB",
  "#059669",
  "#D97706",
  "#7C3AED",
  "#DC2626",
  "#0891B2",
  "#4F46E5",
  "#64748B",
  "#16A34A",
  "#EA580C",
];

const nombresTiempos = {
  creadaAprobada: "Creada a aprobada",
  creadaRechazada: "Creada a rechazada",
  esperandoAutorizacionAutorizada: "Esperando autorizacion a autorizada",
  aprobadaProveedorPreparandoEnvio: "Aprobada a proveedor preparando envio",
  creadaConcluida: "Creada a concluida",
};

const getStatusColor = (status) => {
  const colores = {
    creada: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
    rechazada: "border-red-100 bg-red-50 text-red-700",
    cotizando: "border-[#DBEAFE] bg-[#DBEAFE]/60 text-[#1E40AF]",
    aprobada: "border-emerald-100 bg-emerald-50 text-emerald-700",
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
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

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
                  <button
                    type="button"
                    onClick={() => setMostrarAyuda(true)}
                    className="inline-flex min-h-[32px] items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
                  >
                    <FiHelpCircle className="h-3.5 w-3.5" />
                  Como leer el reporte
                  </button>
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

      {mostrarAyuda && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 px-4 py-6">
          <div className="w-full max-w-2xl overflow-hidden rounded-lg bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-6 py-5">
              <div>
                <h3 className="text-lg font-semibold text-[#334155]">
                  Como leer este reporte
                </h3>
                <p className="mt-1 text-sm text-[#64748B]">
                  La tabla muestra cuanto tardo cada requisicion en avanzar entre etapas clave.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMostrarAyuda(false)}
                aria-label="Cerrar ayuda"
                title="Cerrar ayuda"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#E2E8F0] text-[#64748B] transition hover:bg-[#F8FAFC] hover:text-[#334155]"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 px-6 py-5 text-sm text-[#334155]">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                <p className="font-semibold text-[#334155]">Tiempos por requisicion</p>
                <p className="mt-1">
                  Cada celda calcula la diferencia entre la fecha inicial y la fecha final del tramo correspondiente.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#334155]">Pendiente</p>
                <p className="mt-1 leading-6">
                  Una requisicion aparece como pendiente cuando todavia no ha llegado al status final de ese tramo.
                </p>
              </div>

              <div>
                <p className="font-semibold text-[#334155]">Inicio y fin de cada tramo</p>
                <p className="mt-1 leading-6">
                  Para tramos que empiezan en creada se usa la fecha de creacion de la requisicion. Para los demas, se usa la fecha registrada en el historial cuando cambia al status inicial y al status final.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const ReportesRequisiciones = () => {
  const { requisiciones, cargando, error, obtenerRequisiciones } =
    useExportarRequisiciones();
  const [reporteActivo, setReporteActivo] = useState("status");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const requisicionesFiltradas = useMemo(() => {
    if (!fechaInicio && !fechaFin) return requisiciones;

    return requisiciones.filter((req) => {
      if (!req.fechaHora) return false;

      const fechaReq = new Date(req.fechaHora);
      const inicio = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : null;
      const fin = fechaFin ? new Date(`${fechaFin}T23:59:59`) : null;

      if (inicio && fechaReq < inicio) return false;
      if (fin && fechaReq > fin) return false;

      return true;
    });
  }, [requisiciones, fechaInicio, fechaFin]);

  const resumenStatus = useMemo(() => {
    const total = requisicionesFiltradas.length;
    const conteo = requisicionesFiltradas.reduce((acc, req) => {
      const status = req.status || "sin status";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(conteo)
      .map(([status, cantidad]) => ({
        status,
        statusFormateado: formatearStatusRequisicion(status),
        cantidad,
        porcentaje: total > 0 ? (cantidad / total) * 100 : 0,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .map((item, index) => ({
        ...item,
        color: coloresStatus[index % coloresStatus.length],
      }));
  }, [requisicionesFiltradas]);

  const totalRequisiciones = requisicionesFiltradas.length;
  const totalStatus = resumenStatus.length;
  const statusPrincipal = resumenStatus[0];
  const statusTop = resumenStatus.slice(0, 3);
  const totalTop = statusTop.reduce((total, item) => total + item.cantidad, 0);
  const porcentajeTop = statusTop.reduce((total, item) => total + item.porcentaje, 0);
  const statusRestantes = Math.max(totalStatus - statusTop.length, 0);
  const totalRestante = Math.max(totalRequisiciones - totalTop, 0);
  const porcentajeRestante = Math.max(100 - porcentajeTop, 0);
  const resumenStatusPrincipales = resumenStatus.slice(0, 6);
  const resumenStatusRestantes = resumenStatus.slice(6);
  const porcentajeAcumulado = resumenStatus.reduce(
    (total, item) => total + item.porcentaje,
    0
  );
  const formatearNumero = (numero) =>
    Number(numero || 0).toLocaleString("es-MX");

  const donutGradient =
    totalRequisiciones > 0
      ? `conic-gradient(${resumenStatus
          .reduce((segmentos, item) => {
            const inicio = segmentos.cursor;
            const fin = inicio + item.porcentaje;
            segmentos.partes.push(`${item.color} ${inicio}% ${fin}%`);
            segmentos.cursor = fin;
            return segmentos;
          }, { cursor: 0, partes: [] })
          .partes.join(", ")})`
      : "conic-gradient(#E2E8F0 0% 100%)";

  const campoBase =
    "w-full rounded-lg border border-[#E2E8F0] bg-white px-3.5 py-2.5 text-sm text-[#334155] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]";

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
  };

  const handleExportar = () => {
    if (totalRequisiciones === 0) return;

    exportarReporteStatusAExcel(
      resumenStatus,
      totalRequisiciones,
      "reporte-status-requisiciones"
    );
  };

  const esReporteStatus = reporteActivo === "status";

  return (
    <div className="w-full px-4 py-3 sm:px-6 lg:px-8 2xl:px-10">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiPieChart className="h-3.5 w-3.5" />
                Reportes
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#334155] sm:text-3xl">
                {esReporteStatus ? "Porcentaje por status" : "Tiempos por proceso"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                {esReporteStatus
                  ? "Consulta la distribucion de requisiciones por status y exporta el resumen ejecutivo."
                  : "Analiza cuanto tarda cada requisicion en avanzar entre etapas clave."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs text-[#64748B]">
                  {esReporteStatus ? "Requisiciones" : "Reporte"}
                </p>
                <p className="text-2xl font-semibold text-[#334155]">
                  {esReporteStatus ? totalRequisiciones : "Tiempos"}
                </p>
              </div>
              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
                <p className="text-xs text-[#64748B]">
                  {esReporteStatus ? "Suma" : "Tramos"}
                </p>
                <p className="text-2xl font-semibold text-[#334155]">
                  {esReporteStatus
                    ? `${totalRequisiciones > 0 ? porcentajeAcumulado.toFixed(2) : "0.00"}%`
                    : "5"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-5 py-4 sm:px-6">
          <div className="inline-flex rounded-lg border border-[#E2E8F0] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={() => setReporteActivo("status")}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                esReporteStatus
                  ? "bg-[#2563EB] text-white"
                  : "text-[#64748B] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
              }`}
            >
              <FiPieChart className="h-4 w-4" />
              Porcentaje por status
            </button>
            <button
              type="button"
              onClick={() => setReporteActivo("tiempos")}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                !esReporteStatus
                  ? "bg-[#2563EB] text-white"
                  : "text-[#64748B] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
              }`}
            >
              <FiClock className="h-4 w-4" />
              Tiempos por proceso
            </button>
          </div>
        </div>

        {esReporteStatus ? (
          <>
        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="flex items-end">
              <button
                type="button"
                onClick={limpiarFiltros}
                className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
              >
                <FiFilter className="h-4 w-4" />
                Limpiar filtros
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:min-w-[300px]">
            <button
              type="button"
              onClick={obtenerRequisiciones}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
            >
              <FiRefreshCw className="h-4 w-4" />
              Actualizar
            </button>

            <button
              type="button"
              onClick={handleExportar}
              disabled={totalRequisiciones === 0}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B82F6] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#64748B]"
            >
              <FiDownload className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </div>

        {cargando ? (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-10 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
              <FiRefreshCw className="h-5 w-5 animate-spin" />
            </div>
            <p className="font-semibold text-slate-700">Cargando requisiciones...</p>
          </div>
        ) : (
          <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#64748B]">Total analizado</p>
                    <p className="mt-1 text-3xl font-semibold text-[#334155]">
                      {totalRequisiciones}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                    <FiDatabase className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#64748B]">Status encontrados</p>
                    <p className="mt-1 text-3xl font-semibold text-[#334155]">
                      {totalStatus}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <FiBarChart2 className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#64748B]">Concentracion top 3</p>
                    <p className="mt-1 text-2xl font-semibold text-[#334155]">
                      {totalRequisiciones > 0 ? porcentajeTop.toFixed(2) : "0.00"}%
                    </p>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <FiPieChart className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>

            {totalRequisiciones > 0 ? (
              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(520px,1fr)_390px]">
                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                  <div className="border-b border-[#E2E8F0] px-5 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-lg font-semibold text-[#334155]">
                          Distribucion visual
                        </h2>
                        <p className="mt-1 text-sm text-[#64748B]">
                          Participacion de cada status sobre el total analizado.
                        </p>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                        <FiPieChart className="h-3.5 w-3.5" />
                        Dona
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                      <div className="grid gap-x-6 gap-y-3 lg:grid-cols-[330px_1fr] lg:items-center">
                        <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center">
                          <div className="absolute inset-x-8 bottom-5 h-8 rounded-full bg-[#0F172A]/10 blur-xl" />
                          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-[#F8FAFC] to-[#E2E8F0] shadow-[0_22px_48px_rgba(15,23,42,0.16)]" />
                          <div
                            className="relative flex h-72 w-72 items-center justify-center rounded-full p-4 shadow-[inset_0_2px_8px_rgba(255,255,255,0.85),inset_0_-18px_26px_rgba(15,23,42,0.16)] ring-1 ring-white/80"
                            style={{ background: donutGradient }}
                          >
                            <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.45),transparent_32%),linear-gradient(145deg,rgba(255,255,255,0.18),rgba(15,23,42,0.08))]" />
                            <div className="relative flex h-44 w-44 flex-col items-center justify-center rounded-full border border-white bg-white text-center shadow-[0_16px_32px_rgba(15,23,42,0.16),inset_0_1px_0_rgba(255,255,255,0.9)]">
                              <div className="absolute inset-3 rounded-full border border-[#E2E8F0]" />
                              <p className="relative text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                                Total analizado
                              </p>
                              <p className="relative mt-1 text-4xl font-semibold text-[#334155]">
                                {formatearNumero(totalRequisiciones)}
                              </p>
                              <p className="relative mt-1 text-xs font-medium text-[#64748B]">
                                {totalStatus} status
                              </p>
                            </div>
                          </div>
                          <div className="absolute left-10 top-9 h-14 w-24 rotate-[-28deg] rounded-full bg-white/35 blur-md" />
                          <div className="absolute right-8 top-16 h-4 w-4 rounded-full bg-white/70 shadow-sm" />
                          <div className="absolute bottom-16 left-9 h-2.5 w-2.5 rounded-full bg-white/60 shadow-sm" />
                          <div className="absolute right-0 top-7 rounded-lg border border-[#E2E8F0] bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                              Distribucion
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-[#1E40AF]">
                              100%
                            </p>
                          </div>
                          <div className="absolute bottom-6 left-3 rounded-lg border border-[#E2E8F0] bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#64748B]">
                              Vista
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-[#334155]">
                              {fechaInicio || fechaFin ? "Filtrada" : "General"}
                            </p>
                          </div>
                        </div>

                      <div>
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-semibold text-[#334155]">
                              Status del reporte
                            </h3>
                            <p className="mt-1 text-xs text-[#64748B]">
                              Distribucion completa por status y porcentaje.
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-[#DBEAFE] bg-white px-2.5 py-1 text-xs font-semibold text-[#1E40AF]">
                            {totalStatus} status
                          </span>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          {resumenStatusPrincipales.map((item) => (
                            <div
                              key={item.status}
                              className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-2">
                                  <span
                                    className="h-3 w-3 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span
                                    tabIndex={0}
                                    className="group relative min-w-0 outline-none"
                                  >
                                    <span className="block truncate text-sm font-semibold text-[#334155]">
                                      {item.statusFormateado}
                                    </span>
                                    <span className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-20 hidden w-max max-w-[260px] rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold leading-snug text-[#334155] shadow-lg group-hover:block group-focus:block">
                                      {item.statusFormateado}
                                    </span>
                                  </span>
                                </div>
                                <div className="shrink-0 text-right">
                                  <p className="text-sm font-semibold text-[#334155]">
                                    {item.porcentaje.toFixed(2)}%
                                  </p>
                                  <p className="text-xs text-[#64748B]">
                                    {formatearNumero(item.cantidad)}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${item.porcentaje}%`,
                                    backgroundColor: item.color,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {resumenStatusRestantes.length > 0 && (
                        <div className="lg:col-span-2">
                          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                            {resumenStatusRestantes.map((item) => (
                              <div key={item.status} className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex min-w-0 items-center gap-2">
                                    <span
                                      className="h-3 w-3 shrink-0 rounded-full"
                                      style={{ backgroundColor: item.color }}
                                    />
                                    <span
                                      tabIndex={0}
                                      className="group relative min-w-0 outline-none"
                                    >
                                      <span className="block truncate text-sm font-semibold text-[#334155]">
                                        {item.statusFormateado}
                                      </span>
                                      <span className="pointer-events-none absolute left-0 top-[calc(100%+8px)] z-20 hidden w-max max-w-[260px] rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold leading-snug text-[#334155] shadow-lg group-hover:block group-focus:block">
                                        {item.statusFormateado}
                                      </span>
                                    </span>
                                  </div>
                                  <div className="shrink-0 text-right">
                                    <p className="text-sm font-semibold text-[#334155]">
                                      {item.porcentaje.toFixed(2)}%
                                    </p>
                                    <p className="text-xs text-[#64748B]">
                                      {formatearNumero(item.cantidad)}
                                    </p>
                                  </div>
                                </div>
                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${item.porcentaje}%`,
                                      backgroundColor: item.color,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
                  <div className="border-b border-[#E2E8F0] px-5 py-4">
                    <h2 className="text-lg font-semibold text-[#334155]">
                      Lectura ejecutiva
                    </h2>
                    <p className="mt-1 text-sm text-[#64748B]">
                      Resumen de concentracion sin duplicar la leyenda.
                    </p>
                  </div>

                  <div className="space-y-5 p-5">
                    <div className="rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                        Status con mayor peso
                      </p>
                      <div className="mt-3 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span
                            className="h-4 w-4 shrink-0 rounded-full"
                            style={{ backgroundColor: statusPrincipal?.color || "#64748B" }}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-[#334155]">
                              {statusPrincipal?.statusFormateado || "Sin datos"}
                            </p>
                            <p className="mt-1 text-xs font-medium text-[#64748B]">
                              {formatearNumero(statusPrincipal?.cantidad || 0)} requisiciones
                            </p>
                          </div>
                        </div>
                        <p className="shrink-0 text-lg font-bold text-[#1E40AF]">
                          {statusPrincipal ? statusPrincipal.porcentaje.toFixed(2) : "0.00"}%
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-[#334155]">
                          Top 3 por volumen
                        </h3>
                        <span className="text-xs font-semibold text-[#64748B]">
                          {porcentajeTop.toFixed(2)}%
                        </span>
                      </div>

                      <div className="space-y-3">
                        {statusTop.map((item) => (
                          <div
                            key={item.status}
                            className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    className="h-3 w-3 shrink-0 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <p className="truncate text-sm font-semibold text-[#334155]">
                                    {item.statusFormateado}
                                  </p>
                                </div>
                                <p className="mt-1 text-xs font-medium text-[#64748B]">
                                  {formatearNumero(item.cantidad)} requisiciones
                                </p>
                              </div>
                              <p className="shrink-0 text-sm font-bold text-[#2563EB]">
                                {item.porcentaje.toFixed(2)}%
                              </p>
                            </div>

                            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${item.porcentaje}%`,
                                  backgroundColor: item.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#334155]">
                            Resto del reporte
                          </p>
                          <p className="mt-1 text-xs font-medium text-[#64748B]">
                            {formatearNumero(statusRestantes)} status con{" "}
                            {formatearNumero(totalRestante)} requisiciones
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-[#64748B]">
                          {porcentajeRestante.toFixed(2)}%
                        </p>
                      </div>
                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
                        <div
                          className="h-full rounded-full bg-[#64748B]"
                          style={{ width: `${porcentajeRestante}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-lg border border-dashed border-[#E2E8F0] bg-white px-5 py-10 text-center">
                <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                  <FiSearch className="h-5 w-5" />
                </div>
                <p className="font-semibold text-[#64748B]">
                  No hay requisiciones para calcular porcentajes con los filtros seleccionados.
                </p>
              </div>
            )}
          </div>
        )}
          </>
        ) : (
          <ReporteTiemposRequisiciones />
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

export default ReportesRequisiciones;
