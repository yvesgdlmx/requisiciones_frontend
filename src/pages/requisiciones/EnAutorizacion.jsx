import React, { useEffect } from "react";
import TablaRequisiciones from "../../components/tablas/TablaRequisiciones";
import TablaRequisicionesMobile from "../../components/tablas/TablaRequisicionesMobile";
import ModalAutorizarRequisicion from "../../components/modales/ModalAutorizarRequisicion";
import useAutorizacion from "../../hooks/useAutorizacion";
import { useLocation } from 'react-router-dom';
import clienteAxios from '../../config/clienteAxios';

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

  // Si venimos desde una notificación con abrirRequisicionId,
  // obtener la requisición por API primero y luego abrir el modal.
  useEffect(() => {
    const abrirId = location.state?.abrirRequisicionId;
    if (!abrirId) return;

    const fetchAndOpen = async (id) => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await clienteAxios.get(`/requisiciones/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // setear la requisición en el hook y abrir modal
        if (data && data.requisicion) {
          setRequisicionSeleccionada(data.requisicion);
          setModalAutorizarActivo(true);
        } else {
          console.error('Respuesta inesperada al obtener requisición:', data);
        }
      } catch (err) {
        console.error('Error al obtener requisición desde notificación:', err);
      } finally {
        // limpiar state para que no se reabra al navegar atrás
        try { window.history.replaceState({}, document.title); } catch(e) {}
      }
    };

    fetchAndOpen(abrirId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-8 uppercase text-gray-500 text-center">
        Requisiciones para Aprobación
      </h2>
      {error && <p className="text-red-500 text-center">{error}</p>}
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