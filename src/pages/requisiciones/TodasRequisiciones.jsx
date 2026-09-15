import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import { FiList, FiSearch } from "react-icons/fi";
import TablaRequisiciones from "../../components/tablas/TablaRequisiciones";
import TablaRequisicionesMobile from "../../components/tablas/TablaRequisicionesMobile";
import ModalAdminDetalleRequisicion from "../../components/modales/ModalAdminDetalleRequisicion";
import ResumenRequisiciones from "../../components/ResumenRequisiciones";
import useTodasRequisiciones from "../../hooks/useTodasRequisiciones";

const TodasRequisiciones = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [yaProcesoNotificacion, setYaProcesoNotificacion] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState(null);

  const {
    datos,
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

  const handleStatusClick = (status) => {
    setFiltroStatus(status === "Total General" ? null : status);
  };

  useEffect(() => {
    const abrirRequisicionId = location.state?.abrirRequisicionId;

    if (abrirRequisicionId && datos.length > 0 && !yaProcesoNotificacion) {
      const requisicionEncontrada = datos.find((req) => req.id === abrirRequisicionId);

      if (requisicionEncontrada) {
        setYaProcesoNotificacion(true);
        handleRowClick(requisicionEncontrada);
        navigate(location.pathname, { replace: true });
      }
    }
  }, [datos, location.state, yaProcesoNotificacion, handleRowClick, navigate, location.pathname]);

  useEffect(() => {
    if (!location.state?.abrirRequisicionId) {
      setYaProcesoNotificacion(false);
    }
  }, [location.state]);

  const handleCloseModal = () => {
    setModalDetalleActivo(false);
    setRequisicionSeleccionada(null);
  };

  const datosFiltradosConStatus = filtroStatus
    ? datosFiltrados.filter((item) => item.status === filtroStatus)
    : datosFiltrados;

  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: "46px",
      borderColor: state.isFocused ? "#2563EB" : "#E2E8F0",
      boxShadow: state.isFocused ? "0 0 0 4px #DBEAFE" : "0 1px 2px rgba(15, 23, 42, 0.05)",
      borderRadius: "0.5rem",
      fontSize: "0.875rem",
      "&:hover": { borderColor: state.isFocused ? "#2563EB" : "#E2E8F0" },
    }),
    option: (base, state) => ({
      ...base,
      fontSize: "0.875rem",
      backgroundColor: state.isSelected ? "#2563EB" : state.isFocused ? "#DBEAFE" : "white",
      color: state.isSelected ? "white" : "#334155",
    }),
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiList className="h-3.5 w-3.5" />
                Administracion
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Todas las requisiciones
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Supervisa, consulta y actualiza el flujo completo de requisiciones.
              </p>
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
              <p className="text-xs text-[#64748B]">Registros visibles</p>
              <p className="text-2xl font-semibold text-[#334155]">
                {datosFiltradosConStatus.length}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-7">
            {error}
          </div>
        )}

        <div className="border-b border-[#E2E8F0] p-6 sm:p-7">
          <ResumenRequisiciones
            detallesDeStatus={detallesDeStatus}
            agrupacionStatus={agrupacionStatus}
            titulo="Resumen de todas las requisiciones"
            onClickStatus={handleStatusClick}
            statusSeleccionado={filtroStatus}
          />

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full lg:w-56">
              <Select
                options={opciones}
                value={opcionSeleccionada}
                onChange={handleSelectChange}
                styles={selectStyles}
              />
            </div>

            <div className="relative w-full lg:max-w-md">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
              <input
                type="text"
                placeholder="Buscar requisicion..."
                className="w-full rounded-lg border border-[#E2E8F0] bg-white px-11 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
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
            mostrarColumnasAdmin={true}
          />
        </div>

        <div className="block bg-[#F8FAFC] p-4 md:hidden">
          <TablaRequisicionesMobile
            data={datosFiltradosConStatus}
            itemsPorPagina={itemsPorPagina}
            mostrarAcciones={false}
            onRowClick={handleRowClick}
            mostrarNotificacion={true}
          />
        </div>
      </section>

      <ModalAdminDetalleRequisicion
        isOpen={modalDetalleActivo}
        requisicion={requisicionSeleccionada || {}}
        onClose={handleCloseModal}
        onUpdate={actualizarRequisicion}
      />
    </div>
  );
};

export default TodasRequisiciones;
