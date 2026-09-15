import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBell,
  FiClock,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";
import useAuth from "../../hooks/useAuth";
import useNotificaciones from "../../hooks/useNotificaciones";

const NOTIFICACIONES_POR_PAGINA = 10;

const Notificaciones = () => {
  const { auth } = useAuth();
  const [paginaActual, setPaginaActual] = useState(1);

  const {
    notificaciones,
    notificacionesFiltradas,
    totalNoLeidas,
    cargando,
    error,
    busqueda,
    setBusqueda,
    deletingId,
    obtenerNotificaciones,
    marcarYIr,
    handleEliminarNotificacion,
    obtenerIcono,
    obtenerColorStatus,
    formatearFecha,
  } = useNotificaciones();

  const totalPaginas = Math.max(
    1,
    Math.ceil(notificacionesFiltradas.length / NOTIFICACIONES_POR_PAGINA)
  );
  const indiceInicial = (paginaActual - 1) * NOTIFICACIONES_POR_PAGINA;
  const indiceFinal = Math.min(
    indiceInicial + NOTIFICACIONES_POR_PAGINA,
    notificacionesFiltradas.length
  );
  const notificacionesPagina = notificacionesFiltradas.slice(indiceInicial, indiceFinal);

  const paginasVisibles = useMemo(() => {
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);

    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  }, [paginaActual, totalPaginas]);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, notificacionesFiltradas.length]);

  const descripcion =
    auth.rol === "admin" || auth.rol === "superadmin"
      ? "Mantente al dia con nuevas requisiciones y actualizaciones del sistema."
      : "Mantente al dia con las actualizaciones de tus requisiciones.";

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiBell className="h-3.5 w-3.5" />
                Centro de actividad
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Notificaciones
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                {descripcion}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center">
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                <p className="text-xs text-[#64748B]">Total</p>
                <p className="text-2xl font-semibold text-[#334155]">
                  {notificaciones.length}
                </p>
              </div>
              <div className="rounded-lg border border-[#DBEAFE] bg-[#DBEAFE]/40 px-4 py-3">
                <p className="text-xs text-[#64748B]">Sin leer</p>
                <p className="text-2xl font-semibold text-[#1E40AF]">
                  {totalNoLeidas}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-6 sm:p-7 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-2xl flex-1">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Buscar por requisicion o mensaje..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-11 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
            />
          </div>

          <button
            type="button"
            onClick={obtenerNotificaciones}
            className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#64748B] shadow-sm transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
          >
            <FiRefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </div>

        {error && (
          <div className="mx-6 mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-7">
            {error}
          </div>
        )}

        <div className="border-t border-[#E2E8F0] bg-white">
          <div className="border-b border-[#E2E8F0] px-6 py-5">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#334155]">
                  Actividad reciente
                </h2>
                <p className="text-sm text-[#64748B]">
                  Alertas y cambios relacionados con requisiciones.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiClock className="h-3.5 w-3.5" />
                {notificacionesFiltradas.length} resultados
              </span>
            </div>
          </div>

          {cargando ? (
            <div className="p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                <FiRefreshCw className="h-5 w-5 animate-spin" />
              </div>
              <p className="font-semibold text-[#334155]">Cargando notificaciones...</p>
              <p className="mt-1 text-sm text-[#64748B]">Actualizando actividad reciente.</p>
            </div>
          ) : notificacionesFiltradas.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                <FiBell className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-[#334155]">No hay notificaciones</h3>
              <p className="mt-1 text-sm text-[#64748B]">
                {busqueda
                  ? "No hay notificaciones que coincidan con tu busqueda."
                  : "Las notificaciones apareceran aqui cuando haya actualizaciones."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#E2E8F0]">
              {notificacionesPagina.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => marcarYIr(n)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      marcarYIr(n);
                    }
                  }}
                  className={`group flex cursor-pointer items-start justify-between gap-4 px-6 py-5 transition ${
                    !n.leida ? "bg-[#DBEAFE]/25" : "bg-white"
                  } hover:bg-[#F8FAFC]`}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-4">
                    <div className="relative mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#2563EB]">
                      {obtenerIcono(n.tipo)}
                      {!n.leida && (
                        <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-[#2563EB]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        {n.requisicion?.folio && (
                          <span className="font-semibold text-[#334155]">
                            {n.requisicion.folio}
                          </span>
                        )}
                        {n.requisicion?.status && (
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${obtenerColorStatus(
                              n.requisicion.status
                            )}`}
                          >
                            {n.requisicion.status}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-sm text-[#64748B]">
                          <FiClock className="h-4 w-4" />
                          {formatearFecha(n.fechaCreacion)}
                        </span>
                      </div>

                      <p className="text-sm leading-6 text-[#334155]">
                        {n.mensaje}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEliminarNotificacion(n.id);
                    }}
                    disabled={deletingId === n.id}
                    className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                      deletingId === n.id
                        ? "cursor-wait bg-red-50 text-red-300"
                        : "text-[#64748B] hover:bg-red-50 hover:text-red-600"
                    }`}
                    title="Eliminar notificacion"
                    aria-busy={deletingId === n.id}
                  >
                    <FiTrash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {notificacionesFiltradas.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#64748B]">
                Mostrando <span className="font-semibold text-[#334155]">{indiceInicial + 1}</span>{" "}
                a <span className="font-semibold text-[#334155]">{indiceFinal}</span>{" "}
                de <span className="font-semibold text-[#334155]">{notificacionesFiltradas.length}</span>{" "}
                notificaciones
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPaginaActual((pagina) => Math.max(1, pagina - 1))}
                  disabled={paginaActual === 1}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FiArrowLeft className="h-4 w-4" />
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
                  <FiArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Notificaciones;
