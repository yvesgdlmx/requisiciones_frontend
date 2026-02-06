import React from "react";
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
      `historial-gastos-filtrado`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <h2 className="text-2xl font-bold mb-2 text-gray-500 text-center">
        Historial de Gastos
      </h2>
      <p className="text-center mb-6 text-gray-500">
        Visualiza el historial completo de gastos por categoría
      </p>

      {/* Buscador y botón descargar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Buscar por categoría o comprador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleDescargarExcel}
          disabled={historialFiltrado.length === 0}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold px-5 py-2 rounded transition-colors shadow"
        >
          Descargar Excel
        </button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      ) : (
        <TablaHistorialGastos historial={historialFiltrado} />
      )}
    </div>
  );
};

export default HistorialGastos;