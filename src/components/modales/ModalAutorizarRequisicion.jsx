import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { AiOutlineFilePdf, AiFillFileImage } from "react-icons/ai";
import { FaTimes } from "react-icons/fa";
import clienteAxios from "../../config/clienteAxios";
import Swal from "sweetalert2";
import { capitalizeWords } from "../../helpers/FuncionesHelpers";
import CardInfoRequisicion from "../cards/CardInfoRequisicion";
import CardArticulo from "../cards/CardArticulo";
import { FaTrashAlt } from "react-icons/fa";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
Modal.setAppElement("#root");

// Helpers para archivos
const getArchivoPath = (archivo) =>
  typeof archivo === "string"
    ? archivo
    : archivo?.url || archivo?.original_name || archivo?.name || "";
const isImage = (archivo) =>
  archivo?.resource_type === "image" ||
  archivo?.mimetype?.startsWith("image/") ||
  archivo?.type?.startsWith("image/") ||
  /\.(jpg|jpeg|png)($|\?)/i.test(getArchivoPath(archivo));
const isPDF = (archivo) =>
  archivo?.resource_type === "raw" ||
  archivo?.mimetype === "application/pdf" ||
  archivo?.type === "application/pdf" ||
  archivo?.format === "pdf" ||
  /\.pdf($|\?)/i.test(getArchivoPath(archivo));

const ModalAutorizarRequisicion = ({ isOpen, requisicion, onClose, onUpdate }) => {
  const [, setUpdatedStatus] = useState("");
  const [comentarioAutorizador, setComentarioAutorizador] = useState("");

  useEffect(() => {
    if (requisicion) {
      setUpdatedStatus(requisicion.status);
      setComentarioAutorizador(requisicion.comentarioAutorizador || "");
    }
  }, [requisicion]);

  // Función para formatear la fecha ETA
  const formatearETA = (eta) => {
    if (!eta) return null;
    const fecha = new Date(eta);
    return fecha.toLocaleDateString("es-ES");
  };

  const handleClose = () => {
    setComentarioAutorizador("");
    onClose();
  };

  // Función para actualizar el estado de la requisición (autorizar o rechazar)
  const handleUpdateStatus = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const data = { 
        status: newStatus,
        comentarioAutorizador: comentarioAutorizador.trim() || null
      };
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const response = await clienteAxios.put(
        `/requisiciones/${requisicion.id}/superadmin`,
        data,
        config
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Requisición actualizada",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      if (onUpdate) onUpdate(response.data.requisicion);
      onClose();
    } catch (error) {
      console.error("Error al actualizar la requisición:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error al actualizar",
        text: "Ocurrió un error al guardar los cambios.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Detalle de la Requisición"
      overlayClassName="fixed inset-0 flex justify-center items-center z-50 p-2 sm:p-4"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      className="w-full max-w-[98vw] sm:max-w-4xl bg-white rounded-xl sm:rounded-2xl shadow-2xl outline-none flex flex-col max-h-[95vh] mx-0 sm:mx-4"
    >
      {/* HEADER */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 sm:p-6 flex justify-between items-center text-white">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Autorización de Requisición</h2>
          <p className="text-xs sm:text-base opacity-90">
            Folio {requisicion?.folio} · {requisicion?.fecha} {requisicion?.hora}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
        >
          <FaTimes />
        </button>
      </div>
      
      {/* BODY */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[70vh] sm:max-h-[75vh]">
        {/* Sección 1: Información principal */}
        <div className="block sm:hidden">
          <CardInfoRequisicion requisicion={requisicion} />
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  Área
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  Objetivo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                  Prioridad
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {capitalizeWords(requisicion?.area)}
                </td>
                <td className="px-6 py-4 whitespace-normal break-words text-sm text-gray-700 max-w-sm">
                  {requisicion?.objetivo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {requisicion?.usuario
                    ? `${requisicion.usuario.nombre} ${requisicion.usuario.apellido}`
                    : requisicion?.solicitante}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {capitalizeWords(requisicion?.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {capitalizeWords(requisicion?.prioridad)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección 2: Artículos de la Requisición */}
        <div>
          <h3 className="text-lg font-bold text-gray-500 mb-3 text-center">
            Artículos de la Requisición
          </h3>
          <div className="block sm:hidden">
            {requisicion?.articulos && requisicion.articulos.length > 0 ? (
              requisicion.articulos.map((articulo, index) => (
                <CardArticulo key={index} articulo={articulo} indice={index} />
              ))
            ) : (
              <p className="text-gray-500">No se han agregado artículos.</p>
            )}
          </div>

          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                    Unidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                    Número de Parte
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                    Descripción
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-sm text-gray-700">
                {(requisicion?.articulos || []).map((articulo, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {articulo.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {capitalizeWords(articulo.unidadMedida)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {articulo.numeroParte || "No asignado"}
                    </td>
                    <td className="px-6 py-4">
                      {articulo.descripcion || "Sin descripción"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* NUEVA SECCIÓN: Datos de Compra (Solo visualización) */}
        <div className="bg-gray-50 py-4 px-6 rounded-md border border-gray-100 mb-2">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Datos de la Orden de Compra
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <span className="block text-gray-500 text-sm">Proveedor</span>
              <span className="text-gray-700 text-base font-medium">
                {requisicion?.proveedor || <span className="italic text-gray-400">No asignado</span>}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-sm">Tipo de Compra</span>
              <span className="text-gray-700 text-base font-medium capitalize">
                {requisicion?.tipoCompra || <span className="italic text-gray-400">No asignado</span>}
              </span>
            </div>
          </div>
          
          {/* NUEVOS CAMPOS: Monto y ETA (Solo visualización) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="block text-gray-500 text-sm">Monto</span>
              <span className="text-gray-700 text-base font-medium">
                {requisicion?.monto || <span className="italic text-gray-400">No asignado</span>}
              </span>
            </div>
            <div>
              <span className="block text-gray-500 text-sm">ETA (Fecha Estimada de Entrega)</span>
              <span className="text-gray-700 text-base font-medium">
                {formatearETA(requisicion?.eta) || <span className="italic text-gray-400">No asignada</span>}
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Comentario del Comprador */}
        <div className="bg-gray-50 py-4 px-6 rounded-md">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Comentario (Comprador)
          </h3>
          {requisicion?.comentario ? (
            <p className="text-md text-gray-700 max-w-2xl">
              {requisicion.comentario}
            </p>
          ) : (
            <p className="text-md text-gray-500 italic">No hay comentario.</p>
          )}
        </div>

        {/* NUEVA SECCIÓN: Comentario del Autorizador */}
        <div className="space-y-2">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
            Comentario del Autorizador
          </h3>
          <textarea
            value={comentarioAutorizador}
            onChange={(e) => setComentarioAutorizador(e.target.value)}
            placeholder="Agrega un comentario sobre la autorización (opcional)..."
            className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
            rows="3"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setComentarioAutorizador("")}
              className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
            >
              <FaTrashAlt />
              <span>Limpiar</span>
            </button>
          </div>
        </div>

        {/* Sección de Links relacionados */}
         {requisicion?.links && requisicion.links.length > 0 && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
              🔗 Links relacionados
            </h3>
            <div className="flex flex-col gap-2">
              {requisicion.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start px-3 sm:px-4 py-2 border border-blue-400 rounded-md text-gray-500 hover:bg-blue-50 transition-colors duration-200 w-full break-all text-xs sm:text-sm leading-tight"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 015.656 5.656l-3 3a4 4 0 01-5.656-5.656M10.172 13.828a4 4 0 01-5.656-5.656l3-3a4 4 0 015.656 5.656"
                    />
                  </svg>
                  {link}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Sección 3: Documentos */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
            📂 Documentos
          </h3>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {requisicion?.archivos && requisicion.archivos.length > 0 ? (
              requisicion.archivos.map((archivo, index) => {
                const fileUrl = typeof archivo === "string" ? archivo : archivo.url;
                const normalizedPath =
                  typeof fileUrl === "string" ? fileUrl.replace(/\\/g, "/") : "";
                const urlCompleta = fileUrl.startsWith("http")
                  ? fileUrl
                  : `${baseUrl}/${normalizedPath}`;
                return (
                  <div
                    key={index}
                    onClick={() => window.open(urlCompleta, "_blank")}
                    className="border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transform hover:scale-105 transition flex flex-col"
                  >
                    <div className="flex-1">
                      {isImage(archivo) ? (
                        <img
                          src={urlCompleta}
                          alt={`Documento ${index}`}
                          className="object-cover w-full h-24 sm:h-32 pointer-events-none"
                        />
                      ) : isPDF(archivo) ? (
                        <div className="w-full h-24 sm:h-32 overflow-hidden pointer-events-none">
                          <object
                            data={urlCompleta}
                            type="application/pdf"
                            className="w-full h-full pointer-events-none"
                          >
                            <div className="flex items-center justify-center h-24 sm:h-32">
                              <span className="text-xs">Vista previa no disponible</span>
                            </div>
                          </object>
                        </div>
                      ) : (
                        <span className="text-xs p-3 block">Archivo</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center p-2 border-t border-gray-200 pointer-events-none">
                      {isImage(archivo) ? (
                        <>
                          <AiFillFileImage className="text-green-500 text-xl mr-1" />
                          <span className="text-sm">Imagen</span>
                        </>
                      ) : isPDF(archivo) ? (
                        <>
                          <AiOutlineFilePdf className="text-red-500 text-xl mr-1" />
                          <span className="text-sm">PDF</span>
                        </>
                      ) : (
                        <span className="text-xs">Archivo</span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 col-span-1 xs:col-span-2">
                No se han subido documentos.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* FOOTER: Botones para Autorizar o Rechazar */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end items-center gap-3">
        <button
          onClick={() => handleUpdateStatus("autorizada")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm"
        >
          ✓ Autorizar
        </button>
        <button
          onClick={() => handleUpdateStatus("esperando autorizacion")}
          className="bg-red-500 hover:bg-red-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm"
        >
          ✗ Rechazar
        </button>
      </div>
    </Modal>
  );
};

export default ModalAutorizarRequisicion;
