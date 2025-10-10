import React, { useState } from 'react';
import Select from 'react-select';
import { FiSearch } from 'react-icons/fi';
import TablaRequisiciones from '../../components/tablas/TablaRequisiciones';
import TablaRequisicionesMobile from '../../components/tablas/TablaRequisicionesMobile';
import ModalAdminDetalleRequisicion from '../../components/modales/ModalAdminDetalleRequisicion';
import ResumenRequisiciones from '../../components/ResumenRequisiciones';
import useTodasRequisiciones from '../../hooks/useTodasRequisiciones';

const TodasRequisiciones = () => {
  const {
    error,
    opciones,
    opcionSeleccionada,
    busqueda,
    itemsPorPagina,
    modalDetalleActivo,
    setModalDetalleActivo,
    requisicionSeleccionada,
    setRequisicionSeleccionada,
    handleSelectChange,
    handleInputChange,
    datosFiltrados,
    agrupacionStatus,
    detallesDeStatus,
    handleRowClick,
    actualizarRequisicion,
  } = useTodasRequisiciones();

  const [filtroStatus, setFiltroStatus] = useState(null);
  const handleStatusClick = (status) => {
  if (status === 'Total General') {
    setFiltroStatus(null); // Resetea el filtro
  } else {
    setFiltroStatus(status);
  }
};

  const datosFiltradosConStatus = filtroStatus
    ? datosFiltrados.filter((item) => item.status === filtroStatus)
    : datosFiltrados;

  return (
    <div className="p-6">
      {error && <p className="text-red-500">{error}</p>}

      <ResumenRequisiciones
        detallesDeStatus={detallesDeStatus}
        agrupacionStatus={agrupacionStatus}
        titulo="Resumen de todas las Requisiciones"
        onClickStatus={handleStatusClick}
        statusSeleccionado={filtroStatus}
      />

      <div className="flex flex-col lg:flex-row items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-500 mb-2 lg:mb-0 uppercase">
          Todas las Requisiciones
        </h2>
        <div className="flex flex-col lg:flex-row items-stretch gap-4 w-full lg:w-auto">
          <div className="w-full lg:w-48">
            <Select
              options={opciones}
              value={opcionSeleccionada}
              onChange={handleSelectChange}
              className="text-sm"
              classNamePrefix="react-select"
            />
          </div>
          <div className="relative w-full lg:w-auto">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full border border-gray-300 rounded pl-10 pr-3 py-1.5 bg-gray-100 focus:outline-none focus:border-blue-500"
              value={busqueda}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block">
        <TablaRequisiciones
          data={datosFiltradosConStatus}
          itemsPorPagina={itemsPorPagina}
          mostrarAcciones={false}
          onRowClick={handleRowClick}
          mostrarNotificacion={true}
        />
      </div>

      <div className="block md:hidden">
        <TablaRequisicionesMobile
          data={datosFiltradosConStatus}
          itemsPorPagina={itemsPorPagina}
          mostrarAcciones={false}
          onRowClick={handleRowClick}
          mostrarNotificacion={true}
        />
      </div>

      <ModalAdminDetalleRequisicion
        isOpen={modalDetalleActivo}
        requisicion={requisicionSeleccionada || {}}
        onClose={() => {
          setModalDetalleActivo(false);
          setRequisicionSeleccionada(null);
        }}
        onUpdate={actualizarRequisicion}
      />
    </div>
  );
};

export default TodasRequisiciones;
