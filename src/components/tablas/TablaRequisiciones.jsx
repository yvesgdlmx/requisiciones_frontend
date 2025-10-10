import React, { useState } from "react";
import { FaTrash, FaPencilAlt, FaRegBell } from "react-icons/fa"; // Ícono para "nueva"
import Swal from "sweetalert2";
import { capitalizeWords } from "../../helpers/FuncionesHelpers";
// Funciones helper para formatear fecha y hora
const formatDate = (fechaOriginal) => {
  const dateTime =
    fechaOriginal instanceof Date ? fechaOriginal : new Date(fechaOriginal);
  const day = String(dateTime.getDate()).padStart(2, "0");
  const month = String(dateTime.getMonth() + 1).padStart(2, "0");
  const year = dateTime.getFullYear();
  return `${day}/${month}/${year}`;
};
const formatTime = (fechaOriginal) => {
  const dateTime =
    fechaOriginal instanceof Date ? fechaOriginal : new Date(fechaOriginal);
  let hours = dateTime.getHours();
  const minutes = String(dateTime.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};
const TablaRequisiciones = ({
  data,
  itemsPorPagina,
  mostrarAcciones,
  onRowClick,
  onEditarClick,
  onEliminarClick,
  // Prop opcional que activa el ícono de "nuevo"
  mostrarNotificacion = false,
}) => {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.ceil(data.length / itemsPorPagina);
  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const registrosActuales = data.slice(
    indiceInicio,
    indiceInicio + itemsPorPagina
  );
  // Función para determinar si se permite la acción (menos de 1 hora de diferencia)
  const accionPermitida = (item) => {
    if (!item.fechaOriginal) return true;
    const ahora = new Date();
    const diferencia = ahora - new Date(item.fechaOriginal);
    return diferencia <= 3600000; // 1 hora en milisegundos
  };
  const seleccionarPagina = (paginaDestino) => setPagina(paginaDestino);
  const handlePrevPage = () => {
    if (pagina > 1) setPagina((prev) => prev - 1);
  };
  const handleNextPage = () => {
    if (pagina < totalPaginas) setPagina((prev) => prev + 1);
  };
  const colorStatus = (status) => {
    switch (status) {
      case "creada":
        return "bg-gray-200 text-gray-800";
      case "cotizando":
        return "bg-blue-200 text-blue-800";
      case "aprobada":
        return "bg-green-400 text-green-800";
      case "esperando autorizacion":
        return "bg-yellow-200 text-yellow-800";
      case "autorizada":
        return "bg-cyan-200 text-cyan-800";
      case "rechazada":
        return "bg-red-400 text-red-800";
      case "liberacion aduanal":
        return "bg-purple-200 text-purple-800";
      case "proceso de entrega":
        return "bg-orange-200 text-orange-800";
      case "entregada parcial":
        return "bg-teal-200 text-teal-800";
      case "concluida":
        return "bg-green-200 text-green-800";
      case "cancelada":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };
  // Función para editar
  const handleEditar = (item, e) => {
    e.stopPropagation();
    if (item.status !== "creada") {
      Swal.fire({
        title: "No permitido",
        html: `No puedes editar esta requisición porque su status ya cambió o pasó más de una hora.<br>
        <span style="color:red;">Favor de enviar correo a compras para solicitar su cancelación.</span>`,
        icon: "warning",
      });
      return;
    }
    if (!accionPermitida(item)) {
      Swal.fire({
        title: "Tiempo agotado",
        html: `No puedes editar esta requisición porque su status ya cambió o pasó más de una hora.<br>
        <span style="color:red;">Favor de enviar correo a compras para solicitar su cancelación.</span>`,
        icon: "warning",
      });
      return;
    }
    if (onEditarClick) {
      onEditarClick(item, e);
    }
  };
  // Función para eliminar
  const handleEliminar = (item, e) => {
    e.stopPropagation();
    if (item.status !== "creada") {
      Swal.fire({
        title: "No permitido",
        html: `No puedes eliminar esta requisición porque su status ya cambió o pasó más de una hora.<br>
        <span style="color:red;">Favor de enviar correo a compras para solicitar su cancelación.</span>`,
        icon: "warning",
      });
      return;
    }
    if (!accionPermitida(item)) {
      Swal.fire({
        title: "Tiempo agotado",
        html: `No puedes editar esta requisición porque su status ya cambió o pasó más de una hora.<br>
        <span style="color:red;">Favor de enviar correo a compras para solicitar su cancelación.</span>`,
        icon: "warning",
      });
      return;
    }
    if (onEliminarClick) {
      onEliminarClick(item);
    }
  };
  return (
    <div>
      <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200">
        <table className="min-w-full whitespace-nowrap">
          <thead className="text-[14px] 2xl:text-[16px] bg-blue-500 text-white">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-2 text-left">Folio</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Solicitante</th>
              <th className="px-4 py-2 text-left">Área</th>
              <th className="px-4 py-2 text-left">Comprador</th>
              <th className="px-4 py-2 text-left">Prioridad</th>
              <th className="px-4 py-2 text-left">Status</th>
              {mostrarAcciones && <th className="px-4 py-2"></th>}
            </tr>
          </thead>
          <tbody className="font-normal text-gray-700 text-[14px] 2xl:text-[16px]">
            {registrosActuales.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-blue-50 border-b border-gray-200 cursor-pointer"
                onClick={() => onRowClick && onRowClick(item)}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {/* Se muestra el ícono "nuevo" solo si mostrarNotificacion es true */}
                    {mostrarNotificacion && item.status === "creada" && (
                      <p className="bg-red-600 text-white px-[5.5px] py-[1.5px] text-xs rounded-full font-semibold">
                        new
                      </p>
                    )}
                    <span className="inline-block align-middle">
                      {item.folio}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div>
                    <span>{formatDate(item.fechaOriginal)}</span>
                    <br />
                    <span className="text-xs text-gray-500">
                      {formatTime(item.fechaOriginal)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {capitalizeWords(item.solicitante)}
                </td>
                <td className="px-4 py-4">{capitalizeWords(item.area)}</td>
                <td className="px-4 py-4">
                  {item.comprador
                    ? capitalizeWords(item.comprador)
                    : "Esperando Comprador"}
                </td>
                <td className="px-4 py-4">{capitalizeWords(item.prioridad)}</td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-xl text-sm font-medium ${colorStatus(
                      item.status
                    )}`}
                  >
                    {capitalizeWords(item.status)}
                  </span>
                </td>
                {mostrarAcciones && (
                  <td className="px-4 py-4">
                    <div className="flex space-x-6">
                      <FaTrash
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                        onClick={(e) => handleEliminar(item, e)}
                      />
                      <FaPencilAlt
                        className="text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
                        onClick={(e) => handleEditar(item, e)}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {registrosActuales.length === 0 && (
              <tr>
                <td className="px-4 py-4" colSpan={mostrarAcciones ? "8" : "7"}>
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {totalPaginas > 1 && (
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-700">
            {indiceInicio + 1} -{" "}
            {Math.min(indiceInicio + itemsPorPagina, data.length)} de{" "}
            {data.length} registros
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handlePrevPage}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              disabled={pagina === 1}
            >
              Anterior
            </button>
            {Array.from({ length: totalPaginas }, (_, index) => (
              <button
                key={index}
                onClick={() => seleccionarPagina(index + 1)}
                className={`px-3 py-1 rounded border border-gray-300 ${
                  pagina === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
              disabled={pagina === totalPaginas}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default TablaRequisiciones;
