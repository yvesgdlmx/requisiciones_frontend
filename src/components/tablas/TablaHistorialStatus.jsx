import React, { useEffect, useMemo, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiClock, FiFileText } from "react-icons/fi";

const TablaHistorialStatus = ({ historial }) => {
  const registrosPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(historial.length / registrosPorPagina));
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(indiceInicial + registrosPorPagina, historial.length);
  const historialPaginado = historial.slice(indiceInicial, indiceFinal);

  const paginasVisibles = useMemo(() => {
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);

    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  }, [paginaActual, totalPaginas]);

  useEffect(() => {
    setPaginaActual(1);
  }, [historial]);

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
  };

  const capitalizar = (texto) => {
    if (!texto) return "Sin dato";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
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
      "proveedor preparando envÃ­o": "border-indigo-100 bg-indigo-50 text-indigo-700",
      "liberacion aduanal": "border-violet-100 bg-violet-50 text-violet-700",
      "proceso de entrega": "border-orange-100 bg-orange-50 text-orange-700",
      "entregada parcial": "border-teal-100 bg-teal-50 text-teal-700",
      concluida: "border-emerald-100 bg-emerald-50 text-emerald-800",
      cancelada: "border-red-100 bg-red-50 text-red-800",
    };

    return colores[status] || "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]";
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#E2E8F0] px-6 py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#334155]">
              Movimientos registrados
            </h2>
            <p className="text-sm text-[#64748B]">
              Bitacora de cambios de status por requisicion.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            <FiClock className="h-3.5 w-3.5" />
            {historial.length} registros
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Folio</th>
              <th className="px-6 py-4 text-left font-semibold">Cambio de status</th>
              <th className="px-6 py-4 text-left font-semibold">Usuario</th>
              <th className="px-6 py-4 text-left font-semibold">Rol</th>
              <th className="px-6 py-4 text-left font-semibold">Fecha cambio</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
            {historialPaginado.map((item) => (
              <tr key={item.id} className="bg-white transition hover:bg-[#F8FAFC]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                      <FiFileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#334155]">
                        {item.requisicion?.folio || "Sin folio"}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        Requisicion
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                        item.statusAnterior
                      )}`}
                    >
                      {capitalizar(item.statusAnterior)}
                    </span>
                    <FiArrowRight className="h-4 w-4 text-[#64748B]" />
                    <span
                      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
                        item.statusNuevo
                      )}`}
                    >
                      {capitalizar(item.statusNuevo)}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-5 font-medium">
                  {item.usuarioNombre || "Sin usuario"}
                </td>

                <td className="px-6 py-5">
                  <span className="inline-flex rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1 text-xs font-semibold capitalize text-[#64748B]">
                    {item.usuarioRol || "Sin rol"}
                  </span>
                </td>

                <td className="px-6 py-5 text-sm text-[#64748B]">
                  {formatearFechaMexico(item.fechaCambio)}
                </td>
              </tr>
            ))}

            {historial.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-[#334155]">
                    No hay movimientos registrados.
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Ajusta la busqueda o actualiza el historial.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {historial.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">
            Mostrando{" "}
            <span className="font-semibold text-[#334155]">{indiceInicial + 1}</span>
            {" "}a{" "}
            <span className="font-semibold text-[#334155]">{indiceFinal}</span>
            {" "}de{" "}
            <span className="font-semibold text-[#334155]">{historial.length}</span>
            {" "}movimientos
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
  );
};

export default TablaHistorialStatus;
