import React from "react";
import { FiDownload, FiSearch, FiTrendingDown } from "react-icons/fi";
import useHistorialGastos from "../../hooks/useHistorialGastos";
import TablaHistorialGastos from "../../components/tablas/TablaHistorialGastos";
import { exportarHistorialAExcel } from "../../services/excelService";

const HistorialGastos = () => {
  const {
    historialFiltrado,
    busqueda,
    setBusqueda,
    cargando,
  } = useHistorialGastos();

  const handleDescargarExcel = () => {
    exportarHistorialAExcel(
      historialFiltrado,
      "historial-gastos-filtrado"
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiTrendingDown className="h-3.5 w-3.5" />
                Finanzas
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Historial de gastos
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Visualiza el historial completo de gastos por categoría.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDescargarExcel}
              disabled={historialFiltrado.length === 0}
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B82F6] disabled:cursor-not-allowed disabled:bg-[#E2E8F0] disabled:text-[#64748B]"
            >
              <FiDownload className="h-4 w-4" />
              Descargar Excel
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="relative max-w-2xl">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Buscar por categoría o comprador..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-11 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
            />
          </div>
        </div>

        <div className="border-t border-[#E2E8F0]">
          {cargando ? (
            <div className="bg-white p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                <FiTrendingDown className="h-5 w-5" />
              </div>
              <p className="font-semibold text-[#334155]">Cargando historial...</p>
              <p className="mt-1 text-sm text-[#64748B]">Actualizando gastos registrados.</p>
            </div>
          ) : (
            <TablaHistorialGastos historial={historialFiltrado} />
          )}
        </div>
      </section>
    </div>
  );
};

export default HistorialGastos;
