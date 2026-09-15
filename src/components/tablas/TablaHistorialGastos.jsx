import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiClock,
  FiDollarSign,
  FiTrendingDown,
  FiUser,
} from "react-icons/fi";

const TablaHistorialGastos = ({ historial }) => {
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

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  };

  const formatearMonto = (cantidad) => {
    return parseFloat(cantidad || 0).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getSimboloMoneda = (moneda) => {
    const simbolos = {
      MXN: "$",
      USD: "$",
      EUR: "EUR ",
    };
    return simbolos[moneda] || "$";
  };

  const formatearMontoConMoneda = (cantidad, moneda = "MXN") => {
    const simbolo = getSimboloMoneda(moneda);
    const monto = formatearMonto(cantidad);
    return `${simbolo}${monto} ${moneda}`;
  };

  const capitalizar = (texto) => {
    if (!texto) return "Sin status";
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
      "liberacion aduanal": "border-violet-100 bg-violet-50 text-violet-700",
      "proceso de entrega": "border-orange-100 bg-orange-50 text-orange-700",
      "entregada parcial": "border-teal-100 bg-teal-50 text-teal-700",
      concluida: "border-emerald-100 bg-emerald-50 text-emerald-800",
      cancelada: "border-red-100 bg-red-50 text-red-800",
    };
    return colores[status] || "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]";
  };

  const getSaldoColor = (saldo) => {
    return Number(saldo) < 0 ? "text-red-600" : "text-emerald-700";
  };

  const renderFecha = (fecha) => (
    <div>
      <p className="font-medium text-[#334155]">{formatearFecha(fecha)}</p>
      <p className="text-xs text-[#64748B]">{formatearHora(fecha)}</p>
    </div>
  );

  return (
    <div className="bg-white">
      <div className="border-b border-[#E2E8F0] px-6 py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#334155]">
              Gastos registrados
            </h2>
            <p className="text-sm text-[#64748B]">
              Movimientos de presupuesto por categoria.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            <FiTrendingDown className="h-3.5 w-3.5" />
            {historial.length} registros
          </span>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full whitespace-nowrap">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Categoria</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-right font-semibold">Presupuesto</th>
              <th className="px-6 py-4 text-right font-semibold">Gastado</th>
              <th className="px-6 py-4 text-right font-semibold">Saldo</th>
              <th className="px-6 py-4 text-left font-semibold">Fecha gasto</th>
              <th className="px-6 py-4 text-left font-semibold">Periodo</th>
              <th className="px-6 py-4 text-left font-semibold">Comprador</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
            {historialPaginado.map((item) => (
              <tr key={item.id} className="bg-white transition hover:bg-[#F8FAFC]">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                      <FiDollarSign className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold capitalize text-[#334155]">
                        {item.categoriaNombre || "Sin categoria"}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {item.moneda || "MXN"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(item.statusRequisicion)}`}>
                    {capitalizar(item.statusRequisicion)}
                  </span>
                </td>

                <td className="px-6 py-5 text-right font-semibold">
                  {formatearMontoConMoneda(item.presupuestoTotal, item.moneda)}
                </td>

                <td className="px-6 py-5 text-right text-[#64748B]">
                  -{formatearMontoConMoneda(item.montoGastado, item.moneda)}
                </td>

                <td className={`px-6 py-5 text-right font-semibold ${getSaldoColor(item.saldoDisponible)}`}>
                  {formatearMontoConMoneda(item.saldoDisponible, item.moneda)}
                </td>

                <td className="px-6 py-5">
                  {renderFecha(item.fechaGasto)}
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiCalendar className="h-4 w-4 text-[#2563EB]" />
                    <div>
                      <p className="font-medium text-[#334155]">
                        {item.diasPeriodo || 0} dias
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {formatearFecha(item.fechaInicioPeriodo)} - {formatearFecha(item.fechaFinPeriodo)}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <FiUser className="h-4 w-4 text-[#2563EB]" />
                    <span>{item.usuarioComprador || "Sin usuario"}</span>
                  </div>
                </td>
              </tr>
            ))}

            {historial.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                    <FiClock className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-[#334155]">
                    No hay registros en el historial.
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Ajusta la busqueda o descarga el historial disponible.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 bg-[#F8FAFC] p-4 lg:hidden">
        {historialPaginado.map((item) => (
          <div key={item.id} className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold capitalize text-[#334155]">
                  {item.categoriaNombre || "Sin categoria"}
                </p>
                <p className="text-sm text-[#64748B]">
                  {item.usuarioComprador || "Sin usuario"}
                </p>
              </div>
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(item.statusRequisicion)}`}>
                {capitalizar(item.statusRequisicion)}
              </span>
            </div>

            <div className="grid gap-3 text-sm">
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Presupuesto</p>
                <p className="mt-1 font-semibold text-[#334155]">
                  {formatearMontoConMoneda(item.presupuestoTotal, item.moneda)}
                </p>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Gastado</p>
                <p className="mt-1 font-semibold text-[#334155]">
                  -{formatearMontoConMoneda(item.montoGastado, item.moneda)}
                </p>
              </div>
              <div className="rounded-lg bg-[#F8FAFC] p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Saldo</p>
                <p className={`mt-1 font-semibold ${getSaldoColor(item.saldoDisponible)}`}>
                  {formatearMontoConMoneda(item.saldoDisponible, item.moneda)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {historial.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#E2E8F0] bg-white px-5 py-8 text-center text-[#64748B]">
            No hay registros en el historial.
          </div>
        )}
      </div>

      {historial.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">
            Mostrando <span className="font-semibold text-[#334155]">{indiceInicial + 1}</span>{" "}
            a <span className="font-semibold text-[#334155]">{indiceFinal}</span>{" "}
            de <span className="font-semibold text-[#334155]">{historial.length}</span>{" "}
            gastos
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

export default TablaHistorialGastos;
