import React, { useState } from "react";
import { FaExclamationTriangle, FaPencilAlt, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  esRequisicionInactiva,
  formatearStatusRequisicion,
} from "../../helpers/FuncionesHelpers";

const TablaRequisicionesMobile = ({
  data,
  itemsPorPagina,
  mostrarAcciones,
  onRowClick,
  onEditarClick,
  onEliminarClick,
  mostrarNotificacion = false,
}) => {
  const [pagina, setPagina] = useState(1);
  const [openActionsIndex, setOpenActionsIndex] = useState(null);
  const totalPaginas = Math.ceil(data.length / itemsPorPagina);
  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const registrosActuales = data.slice(indiceInicio, indiceInicio + itemsPorPagina);

  const accionPermitida = (item) => {
    if (!item.fechaOriginal) return true;
    const ahora = new Date();
    const fechaItem = new Date(item.fechaOriginal);
    const diferencia = ahora - fechaItem;
    return diferencia <= 3600000;
  };

  const getColorStatus = (status) => {
    switch (status) {
      case "creada":
        return "bg-gray-100 text-gray-800";
      case "cotizando":
        return "bg-blue-100 text-blue-700";
      case "esperando autorizacion":
        return "bg-yellow-100 text-yellow-700";
      case "autorizada":
        return "bg-cyan-100 text-cyan-700";
      case "liberacion aduanal":
        return "bg-purple-100 text-purple-700";
      case "proceso de entrega":
        return "bg-orange-100 text-orange-700";
      case "entregada parcial":
        return "bg-teal-100 text-teal-700";
      case "concluida":
        return "bg-green-100 text-green-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleEditarItem = (item, e) => {
    e.stopPropagation();
    setOpenActionsIndex(null);

    if (item.status !== "creada") {
      Swal.fire({
        title: "No permitido",
        text: "No puedes editar esta requisición porque su status ya cambió.",
        icon: "warning",
      });
      return;
    }

    if (!accionPermitida(item)) {
      Swal.fire({
        title: "Tiempo agotado",
        text: "Ya no puedes editar esta requisición porque pasó más de una hora.",
        icon: "warning",
      });
      return;
    }

    onEditarClick && onEditarClick(item, e);
  };

  const handleEliminarItem = (item, e) => {
    e.stopPropagation();
    setOpenActionsIndex(null);

    if (item.status !== "creada") {
      Swal.fire({
        title: "No permitido",
        text: "No puedes eliminar esta requisición porque su status ya cambió.",
        icon: "warning",
      });
      return;
    }

    if (!accionPermitida(item)) {
      Swal.fire({
        title: "Tiempo agotado",
        text: "Ya no puedes eliminar esta requisición porque pasó más de una hora.",
        icon: "warning",
      });
      return;
    }

    onEliminarClick && onEliminarClick(item, e);
  };

  const toggleActions = (e, index) => {
    e.stopPropagation();
    setOpenActionsIndex(openActionsIndex === index ? null : index);
  };

  const handlePrevPage = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };

  const handleNextPage = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  return (
    <div>
      {registrosActuales.map((item, index) => (
        <div
          key={index}
          className="mb-6 rounded-xl border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-200 p-4">
            <div className="flex items-center">
              {mostrarNotificacion &&
                esRequisicionInactiva(item.fechaCambioStatus, item.status) && (
                  <FaExclamationTriangle
                    className="text-lg text-yellow-500"
                    title="Más de 48 horas sin actividad"
                  />
                )}
              {mostrarNotificacion && item.status === "creada" && (
                <p className="mx-2 rounded-full bg-red-600 px-[5.5px] py-[1.5px] text-xs font-semibold text-white">
                  new
                </p>
              )}
              <span className="text-md font-normal text-orange-700">
                {item.folio}
              </span>
            </div>

            {mostrarAcciones && (
              <div className="relative">
                <button
                  type="button"
                  className="text-2xl text-gray-400"
                  onClick={(e) => toggleActions(e, index)}
                  aria-label="Abrir acciones"
                >
                  ⋮
                </button>
                {openActionsIndex === index && (
                  <div className="absolute right-0 z-10 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <button
                      type="button"
                      onClick={(e) => handleEditarItem(item, e)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-blue-50"
                    >
                      <FaPencilAlt className="text-blue-500" /> Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleEliminarItem(item, e)}
                      className="flex w-full items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-red-50"
                    >
                      <FaTrash className="text-red-500" /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div
            className="cursor-pointer p-4"
            onClick={() => onRowClick && onRowClick(item)}
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {item.solicitante}
                </p>
                <p className="text-sm text-gray-500">{item.area}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getColorStatus(
                  item.status
                )}`}
              >
                {formatearStatusRequisicion(item.status)}
              </span>
            </div>

            {item.descripcion && (
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-600">Prioridad:</p>
                <span className="text-sm font-normal text-gray-500">
                  {item.prioridad}
                </span>
              </div>
            )}

            <div className="flex justify-between border-t border-gray-200 pt-3 text-sm text-gray-500">
              <div>
                <span className="font-semibold text-gray-600">Fecha:</span>{" "}
                {item.fecha}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Hora:</span>{" "}
                {item.hora}
              </div>
            </div>
          </div>
        </div>
      ))}

      {registrosActuales.length === 0 && (
        <div className="py-4 text-center text-gray-400">
          No se encontraron registros.
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrevPage}
            className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <div className="text-sm text-gray-700">
            {indiceInicio + 1} - {Math.min(indiceInicio + itemsPorPagina, data.length)} de{" "}
            {data.length} registros
          </div>
          <button
            type="button"
            onClick={handleNextPage}
            className="rounded-lg border border-gray-300 px-4 py-2 transition-colors hover:bg-gray-100 disabled:opacity-50"
            disabled={pagina === totalPaginas}
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default TablaRequisicionesMobile;
