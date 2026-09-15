import React, { useState } from "react";
import { FaExclamationTriangle, FaPencilAlt, FaTrash } from "react-icons/fa";
import { FiArrowLeft, FiArrowRight, FiFileText } from "react-icons/fi";
import Swal from "sweetalert2";
import { capitalizeWords, esRequisicionInactiva } from "../../helpers/FuncionesHelpers";

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
  mostrarNotificacion = false,
  mostrarColumnasAdmin = false,
}) => {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(data.length / itemsPorPagina));
  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const registrosActuales = data.slice(indiceInicio, indiceInicio + itemsPorPagina);

  const accionPermitida = (item) => {
    if (!item.fechaOriginal) return true;
    const ahora = new Date();
    const diferencia = ahora - new Date(item.fechaOriginal);
    return diferencia <= 3600000;
  };

  const formatearETA = (eta) => {
    if (!eta) return "No asignada";
    const fecha = new Date(eta);
    return fecha.toLocaleDateString("es-ES");
  };

  const generarNumerosPagina = () => {
    const paginas = [];
    const maxBotones = 5;

    if (totalPaginas <= maxBotones) {
      for (let i = 1; i <= totalPaginas; i += 1) paginas.push(i);
    } else {
      paginas.push(1);
      if (pagina > 3) paginas.push("...");
      const inicio = Math.max(2, pagina - 1);
      const fin = Math.min(totalPaginas - 1, pagina + 1);
      for (let i = inicio; i <= fin; i += 1) paginas.push(i);
      if (pagina < totalPaginas - 2) paginas.push("...");
      paginas.push(totalPaginas);
    }

    return paginas;
  };

  const colorStatus = (status) => {
    switch (status) {
      case "creada":
        return "border-gray-200 bg-gray-200 text-gray-800";
      case "rechazada":
        return "border-red-400 bg-red-400 text-red-900";
      case "aprobada":
        return "border-green-400 bg-green-400 text-green-900";
      case "cotizando":
        return "border-blue-200 bg-blue-200 text-blue-800";
      case "esperando autorizacion":
        return "border-yellow-200 bg-yellow-200 text-yellow-800";
      case "autorizada":
        return "border-cyan-200 bg-cyan-200 text-cyan-800";
      case "proceso de pago":
        return "border-pink-200 bg-pink-200 text-pink-800";
      case "proveedor preparando envio":
      case "proveedor preparando envío":
      case "proveedor preparando envÃ­o":
      case "proveedor preparando envÃƒÂ­o":
        return "border-indigo-200 bg-indigo-200 text-indigo-800";
      case "liberacion aduanal":
        return "border-purple-200 bg-purple-200 text-purple-800";
      case "proceso de entrega":
        return "border-orange-200 bg-orange-200 text-orange-800";
      case "entregada parcial":
        return "border-teal-200 bg-teal-200 text-teal-800";
      case "concluida":
        return "border-green-200 bg-green-200 text-green-800";
      case "cancelada":
        return "border-red-200 bg-red-200 text-red-800";
      default:
        return "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]";
    }
  };

  const handleEditar = (item, e) => {
    e.stopPropagation();
    if (item.status !== "creada" || !accionPermitida(item)) {
      Swal.fire({
        title: "No permitido",
        html: `No puedes editar esta requisicion porque su status ya cambio o paso mas de una hora.<br>
        <span style="color:red;">Favor de enviar correo a compras para solicitar su cancelacion.</span>`,
        icon: "warning",
      });
      return;
    }
    onEditarClick && onEditarClick(item, e);
  };

  const handleEliminar = (item, e) => {
    e.stopPropagation();
    if (item.status !== "creada" || !accionPermitida(item)) {
      Swal.fire({
        title: "No permitido",
        html: `No puedes eliminar esta requisicion porque su status ya cambio o paso mas de una hora.<br>
        <span style="color:red;">Favor de enviar correo a compras para solicitar su cancelacion.</span>`,
        icon: "warning",
      });
      return;
    }
    onEliminarClick && onEliminarClick(item);
  };

  return (
    <div className="bg-white">
      <div className="border-b border-[#E2E8F0] px-6 py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#334155]">
              Requisiciones registradas
            </h2>
            <p className="text-sm text-[#64748B]">
              Listado de requisiciones filtradas.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            <FiFileText className="h-3.5 w-3.5" />
            {data.length} registros
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Folio</th>
              <th className="px-6 py-4 text-left font-semibold">Fecha</th>
              <th className="px-6 py-4 text-left font-semibold">Solicitante</th>
              <th className="px-6 py-4 text-left font-semibold">Area</th>
              <th className="px-6 py-4 text-left font-semibold">Comprador</th>
              <th className="px-6 py-4 text-left font-semibold">Prioridad</th>
              {mostrarColumnasAdmin && (
                <>
                  <th className="px-6 py-4 text-left font-semibold">Monto</th>
                  <th className="px-6 py-4 text-left font-semibold">ETA</th>
                </>
              )}
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              {mostrarAcciones && <th className="px-6 py-4" />}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
            {registrosActuales.map((item, index) => (
              <tr
                key={index}
                className="cursor-pointer bg-white transition hover:bg-[#F8FAFC]"
                onClick={() => onRowClick && onRowClick(item)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB]">
                      <FiFileText className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      {mostrarNotificacion &&
                        esRequisicionInactiva(item.fechaCambioStatus, item.status) && (
                          <FaExclamationTriangle
                            className="text-amber-500"
                            title="Mas de 48 horas sin actividad"
                          />
                        )}
                      {mostrarNotificacion && item.status === "creada" && (
                        <span className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-semibold text-white">
                          new
                        </span>
                      )}
                      <span className="font-semibold text-[#334155]">{item.folio}</span>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5">
                  <p className="font-medium text-[#334155]">{formatDate(item.fechaOriginal)}</p>
                  <p className="text-xs text-[#64748B]">{formatTime(item.fechaOriginal)}</p>
                </td>

                <td className="px-6 py-5">{capitalizeWords(item.solicitante)}</td>
                <td className="px-6 py-5">{capitalizeWords(item.area)}</td>
                <td className="px-6 py-5">
                  {item.comprador ? capitalizeWords(item.comprador) : "Esperando comprador"}
                </td>
                <td className="px-6 py-5">{capitalizeWords(item.prioridad)}</td>

                {mostrarColumnasAdmin && (
                  <>
                    <td className="px-6 py-5">
                      {item.monto || <span className="italic text-[#64748B]">No asignado</span>}
                    </td>
                    <td className="px-6 py-5">{formatearETA(item.eta)}</td>
                  </>
                )}

                <td className="px-6 py-5">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${colorStatus(item.status)}`}>
                    {capitalizeWords(item.status)}
                  </span>
                </td>

                {mostrarAcciones && (
                  <td className="px-6 py-5">
                    <div className="flex justify-end gap-3">
                      <FaTrash
                        className="cursor-pointer text-[#64748B] transition-colors hover:text-red-500"
                        onClick={(e) => handleEliminar(item, e)}
                      />
                      <FaPencilAlt
                        className="cursor-pointer text-[#64748B] transition-colors hover:text-[#2563EB]"
                        onClick={(e) => handleEditar(item, e)}
                      />
                    </div>
                  </td>
                )}
              </tr>
            ))}

            {registrosActuales.length === 0 && (
              <tr>
                <td
                  className="px-6 py-12 text-center text-[#64748B]"
                  colSpan={
                    mostrarAcciones
                      ? mostrarColumnasAdmin ? 10 : 8
                      : mostrarColumnasAdmin ? 9 : 7
                  }
                >
                  No se encontraron registros.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#64748B]">
            Mostrando <span className="font-semibold text-[#334155]">{indiceInicio + 1}</span>{" "}
            a <span className="font-semibold text-[#334155]">{Math.min(indiceInicio + itemsPorPagina, data.length)}</span>{" "}
            de <span className="font-semibold text-[#334155]">{data.length}</span> registros
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPagina((prev) => Math.max(1, prev - 1))}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pagina === 1}
            >
              <FiArrowLeft className="h-4 w-4" />
              Anterior
            </button>

            <div className="hidden items-center gap-1 sm:flex">
              {generarNumerosPagina().map((numero, index) =>
                numero === "..." ? (
                  <span key={`dots-${index}`} className="px-3 py-1 text-[#64748B]">
                    ...
                  </span>
                ) : (
                  <button
                    key={numero}
                    type="button"
                    onClick={() => setPagina(numero)}
                    className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
                      pagina === numero
                        ? "border-[#2563EB] bg-[#2563EB] text-white"
                        : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
                    }`}
                  >
                    {numero}
                  </button>
                )
              )}
            </div>

            <button
              type="button"
              onClick={() => setPagina((prev) => Math.min(totalPaginas, prev + 1))}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={pagina === totalPaginas}
            >
              Siguiente
              <FiArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TablaRequisiciones;
