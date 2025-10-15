import React from "react";
import TablaRequisiciones from "../../components/tablas/TablaRequisiciones";
import TablaRequisicionesMobile from "../../components/tablas/TablaRequisicionesMobile"; // Importa la versión móvil
import ModalAutorizarRequisicion from "../../components/modales/ModalAutorizarRequisicion";
import useAutorizacion from "../../hooks/useAutorizacion";
const EnAutorizacion = () => {
  const {
    datos,
    error,
    itemsPorPagina,
    modalAutorizarActivo,
    setModalAutorizarActivo,
    requisicionSeleccionada,
    setRequisicionSeleccionada,
    handleRowClick,
    actualizarRequisicion,
  } = useAutorizacion();
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8 uppercase text-gray-500 text-center">
        Requisiciones para Aprobación
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {datos.length > 0 ? (
        <>
          {/* Vista en pantallas grandes: se muestra la tabla tradicional */}
          <div className="hidden md:block">
            <TablaRequisiciones
              data={datos}
              itemsPorPagina={itemsPorPagina}
              mostrarAcciones={false}
              onRowClick={handleRowClick}
              mostrarColumnasAdmin={true}
            />
          </div>
          {/* Vista en pantallas pequeñas: se muestra la versión en cards */}
          <div className="block md:hidden">
            <TablaRequisicionesMobile
              data={datos}
              itemsPorPagina={itemsPorPagina}
              mostrarAcciones={false}
              onRowClick={handleRowClick}
            />
          </div>
        </>
      ) : (
        <div className="text-center text-xl text-gray-600">
          No hay requisiciones para aprobación superior.
        </div>
      )}
      {/* Modal para autorizar o rechazar la requisición */}
      <ModalAutorizarRequisicion
        isOpen={modalAutorizarActivo}
        requisicion={requisicionSeleccionada || {}}
        onClose={() => {
          setModalAutorizarActivo(false);
          setRequisicionSeleccionada(null);
        }}
        onUpdate={actualizarRequisicion}
      />
    </div>
  );
};
export default EnAutorizacion;