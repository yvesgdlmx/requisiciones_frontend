import React, { useEffect, useMemo, useState } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCalendar,
  FiEdit2,
  FiFolder,
  FiMoreVertical,
  FiTrash2,
} from "react-icons/fi";

const TablaCategorias = ({
  categorias,
  menuAbierto,
  toggleMenu,
  cerrarMenu,
  onEditar,
  onEliminar,
}) => {
  const registrosPorPagina = 10;
  const [paginaActual, setPaginaActual] = useState(1);

  const totalPaginas = Math.max(1, Math.ceil(categorias.length / registrosPorPagina));
  const indiceInicial = (paginaActual - 1) * registrosPorPagina;
  const indiceFinal = Math.min(indiceInicial + registrosPorPagina, categorias.length);
  const categoriasPagina = categorias.slice(indiceInicial, indiceFinal);

  const paginasVisibles = useMemo(() => {
    const inicio = Math.max(1, paginaActual - 2);
    const fin = Math.min(totalPaginas, paginaActual + 2);
    return Array.from({ length: fin - inicio + 1 }, (_, index) => inicio + index);
  }, [paginaActual, totalPaginas]);

  useEffect(() => {
    setPaginaActual(1);
  }, [categorias]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    });
  };

  const formatearMonto = (cantidad) => {
    return parseFloat(cantidad || 0).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const obtenerSimboloMoneda = (moneda) => {
    const simbolos = {
      MXN: "$",
      USD: "$",
      EUR: "EUR ",
    };
    return simbolos[moneda] || "$";
  };

  const obtenerColorMoneda = (moneda) => {
    const colores = {
      MXN: "border-emerald-100 bg-emerald-50 text-emerald-700",
      USD: "border-[#DBEAFE] bg-[#DBEAFE]/60 text-[#1E40AF]",
      EUR: "border-violet-100 bg-violet-50 text-violet-700",
    };
    return colores[moneda] || "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]";
  };

  const renderMenu = (categoria, idx) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleMenu(categoria.id)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
        aria-label="Abrir acciones"
      >
        <FiMoreVertical className="h-4 w-4" />
      </button>
      {menuAbierto === categoria.id && (
        <div
          className={`absolute right-0 z-20 w-40 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-lg ${
            idx === categoriasPagina.length - 1 ? "bottom-12" : "mt-2"
          }`}
          onMouseLeave={cerrarMenu}
        >
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-[#334155] transition hover:bg-[#F8FAFC]"
            onClick={() => {
              cerrarMenu();
              onEditar && onEditar(categoria);
            }}
          >
            <FiEdit2 className="h-4 w-4 text-[#2563EB]" />
            Editar
          </button>
          <button
            type="button"
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
            onClick={() => {
              cerrarMenu();
              onEliminar && onEliminar(categoria.id, categoria.nombre);
            }}
          >
            <FiTrash2 className="h-4 w-4" />
            Eliminar
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white">
      <div className="border-b border-[#E2E8F0] px-6 py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#334155]">
              Categorias registradas
            </h2>
            <p className="text-sm text-[#64748B]">
              Presupuestos disponibles por periodo y moneda.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            <FiFolder className="h-3.5 w-3.5" />
            {categorias.length} categorias
          </span>
        </div>
      </div>

      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full whitespace-nowrap">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Nombre</th>
              <th className="px-6 py-4 text-left font-semibold">Presupuesto</th>
              <th className="px-6 py-4 text-left font-semibold">Moneda</th>
              <th className="px-6 py-4 text-left font-semibold">Periodo</th>
              <th className="px-6 py-4 text-left font-semibold">Fecha inicio</th>
              <th className="px-6 py-4 text-left font-semibold">Fecha fin</th>
              <th className="px-6 py-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
            {categoriasPagina.map((categoria, idx) => {
              const moneda = categoria.moneda || "MXN";
              return (
                <tr key={categoria.id} className="bg-white transition hover:bg-[#F8FAFC]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                        <FiFolder className="h-5 w-5" />
                      </div>
                      <p className="font-semibold capitalize text-[#334155]">
                        {categoria.nombre}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-semibold">
                    {obtenerSimboloMoneda(moneda)}
                    {formatearMonto(categoria.cantidad)} {moneda}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${obtenerColorMoneda(moneda)}`}>
                      {moneda}
                    </span>
                  </td>
                  <td className="px-6 py-5">{categoria.diasPeriodo || categoria.periodo} dias</td>
                  <td className="px-6 py-5">{formatearFecha(categoria.fechaInicio)}</td>
                  <td className="px-6 py-5">{formatearFecha(categoria.fechaFin)}</td>
                  <td className="px-6 py-5 text-right">{renderMenu(categoria, idx)}</td>
                </tr>
              );
            })}

            {categorias.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-[#64748B]">
                  No hay categorias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 bg-[#F8FAFC] p-4 lg:hidden">
        {categoriasPagina.map((categoria, idx) => {
          const moneda = categoria.moneda || "MXN";
          return (
            <div key={categoria.id} className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold capitalize text-[#334155]">{categoria.nombre}</p>
                  <p className="text-sm text-[#64748B]">
                    {categoria.diasPeriodo || categoria.periodo} dias
                  </p>
                </div>
                {renderMenu(categoria, idx)}
              </div>
              <div className="grid gap-3 text-sm">
                <div className="rounded-lg bg-[#F8FAFC] p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Presupuesto</p>
                  <p className="mt-1 font-semibold text-[#334155]">
                    {obtenerSimboloMoneda(moneda)}
                    {formatearMonto(categoria.cantidad)} {moneda}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-[#F8FAFC] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Inicio</p>
                    <p className="mt-1 font-semibold text-[#334155]">{formatearFecha(categoria.fechaInicio)}</p>
                  </div>
                  <div className="rounded-lg bg-[#F8FAFC] p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Fin</p>
                    <p className="mt-1 font-semibold text-[#334155]">{formatearFecha(categoria.fechaFin)}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {categorias.length > 0 && (
        <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">
            Mostrando <span className="font-semibold text-[#334155]">{indiceInicial + 1}</span>{" "}
            a <span className="font-semibold text-[#334155]">{indiceFinal}</span>{" "}
            de <span className="font-semibold text-[#334155]">{categorias.length}</span>{" "}
            categorias
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

export default TablaCategorias;
