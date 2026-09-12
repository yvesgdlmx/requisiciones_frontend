import React from "react";
import useHistorialStatus from "../../hooks/useHistorialStatus";
import TablaHistorialStatus from "../../components/tablas/TablaHistorialStatus";

const HistorialStatus = () => {
  const {
    historialFiltrado,
    busqueda,
    setBusqueda,
    cargando,
    error,
    obtenerHistorialStatus,
  } = useHistorialStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-500 text-center">
        Historial de Movimientos
      </h2>

      <p className="text-center mb-6 text-gray-500">
        Visualiza los cambios de status de las requisiciones
      </p>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Buscar por folio, status, usuario o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="button"
          onClick={obtenerHistorialStatus}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition-colors shadow"
        >
          Actualizar
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {cargando ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Cargando historial...</p>
        </div>
      ) : (
        <TablaHistorialStatus historial={historialFiltrado} />
      )}
    </div>
  );
};

export default HistorialStatus;
