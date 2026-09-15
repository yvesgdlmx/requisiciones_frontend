import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FiCheckCircle, FiShield } from "react-icons/fi";
import clienteAxios from "../../config/clienteAxios";
import TablaRequisiciones from "../../components/tablas/TablaRequisiciones";
import TablaRequisicionesMobile from "../../components/tablas/TablaRequisicionesMobile";
import ModalAutorizarRequisicion from "../../components/modales/ModalAutorizarRequisicion";
import useAutorizacion from "../../hooks/useAutorizacion";

const EnAutorizacion = () => {
  const location = useLocation();
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

  useEffect(() => {
    const abrirId = location.state?.abrirRequisicionId;
    if (!abrirId) return;

    const fetchAndOpen = async (id) => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await clienteAxios.get(`/requisiciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data && data.requisicion) {
          setRequisicionSeleccionada(data.requisicion);
          setModalAutorizarActivo(true);
        } else {
          console.error("Respuesta inesperada al obtener requisicion:", data);
        }
      } catch (err) {
        console.error("Error al obtener requisicion desde notificacion:", err);
      } finally {
        try {
          window.history.replaceState({}, document.title);
        } catch (e) {}
      }
    };

    fetchAndOpen(abrirId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiShield className="h-3.5 w-3.5" />
                Autorizacion
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Autorizar requisiciones
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Revisa y resuelve las requisiciones pendientes de aprobacion superior.
              </p>
            </div>

            <div className="rounded-lg border border-[#DBEAFE] bg-[#DBEAFE]/40 px-4 py-3">
              <p className="text-xs text-[#64748B]">Pendientes</p>
              <p className="text-2xl font-semibold text-[#1E40AF]">{datos.length}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-7">
            {error}
          </div>
        )}

        <div className="border-t border-[#E2E8F0]">
          {datos.length > 0 ? (
            <>
              <div className="hidden md:block">
                <TablaRequisiciones
                  data={datos}
                  itemsPorPagina={itemsPorPagina}
                  mostrarAcciones={false}
                  onRowClick={handleRowClick}
                  mostrarColumnasAdmin={true}
                />
              </div>
              <div className="block bg-[#F8FAFC] p-4 md:hidden">
                <TablaRequisicionesMobile
                  data={datos}
                  itemsPorPagina={itemsPorPagina}
                  mostrarAcciones={false}
                  onRowClick={handleRowClick}
                />
              </div>
            </>
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                <FiCheckCircle className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-[#334155]">
                No hay requisiciones pendientes
              </h3>
              <p className="mt-1 text-sm text-[#64748B]">
                Las requisiciones por aprobar apareceran aqui.
              </p>
            </div>
          )}
        </div>
      </section>

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
