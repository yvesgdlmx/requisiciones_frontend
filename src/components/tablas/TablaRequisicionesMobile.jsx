import React, { useState } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
const TablaRequisicionesMobile = ({
  data,
  itemsPorPagina,
  mostrarAcciones,
  onRowClick,
  onEditarClick,
  onEliminarClick,
}) => {
  const [pagina, setPagina] = useState(1);
  const [openActionsIndex, setOpenActionsIndex] = useState(null);
  const totalPaginas = Math.ceil(data.length / itemsPorPagina);
  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const registrosActuales = data.slice(
    indiceInicio,
    indiceInicio + itemsPorPagina
  );
  const accionPermitida = (item) => {
    if (!item.fechaOriginal) return true;
    const ahora = new Date();
    const fechaItem = new Date(item.fechaOriginal);
    const diferencia = ahora - fechaItem;
    return diferencia <= 3600000; // 1 hora en milisegundos
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
        text: "No puedes editar esta requisición porque su status ya cambió.",
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
          className="bg-white shadow-md rounded-xl mb-6 border border-gray-100 hover:shadow-lg transition-shadow"
        >
          {/* Encabezado */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <span className="text-orange-700 font-normal text-md">
              {item.folio}
            </span>
            {mostrarAcciones && (
              <div className="relative">
                <div
                  className="text-gray-400 text-2xl cursor-pointer"
                  onClick={(e) => toggleActions(e, index)}
                >
                  ⋮
                </div>
                {openActionsIndex === index && (
                  <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      onClick={(e) => handleEditarItem(item, e)}
                      className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-blue-50 transition-colors"
                    >
                      <FaPencilAlt className="text-blue-500" /> Editar
                    </button>
                    <button
                      onClick={(e) => handleEliminarItem(item, e)}
                      className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-red-50 transition-colors"
                    >
                      <FaTrash className="text-red-500" /> Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Cuerpo */}
          <div
            className="p-4 cursor-pointer"
            onClick={() => onRowClick && onRowClick(item)}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-lg font-semibold text-gray-700">
                  {item.solicitante}
                </p>
                <p className="text-sm text-gray-500">{item.area}</p>
              </div>
              <span
                className={`text-xs px-3 py-1 rounded-full font-medium ${getColorStatus(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>
            {item.descripcion && (
              <div className="mb-4">
                <p className="text-gray-600 text-sm font-semibold">
                  Prioridad:
                </p>
                <span className="text-sm font-normal text-gray-500">
                  {item.prioridad}
                </span>
              </div>
            )}
            {/* Pie: Fechas */}
            <div className="border-t border-gray-200 pt-3 text-sm text-gray-500 flex justify-between">
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
        <div className="text-center text-gray-400 py-4">
          No se encontraron registros.
        </div>
      )}
      {/* Paginación */}
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <div className="text-sm text-gray-700">
            {indiceInicio + 1} -{" "}
            {Math.min(indiceInicio + itemsPorPagina, data.length)} de{" "}
            {data.length} registros
          </div>
          <button
            onClick={handleNextPage}
            className="px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
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
