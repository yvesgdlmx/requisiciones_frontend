import React, { useEffect } from "react";
import Modal from "react-modal";
import { AiOutlineFilePdf, AiFillFileImage } from "react-icons/ai";
import { capitalizeWords } from "../../helpers/FuncionesHelpers";
import CardInfoRequisicion from "../cards/CardInfoRequisicion";
import CardArticulo from "../cards/CardArticulo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RequisicionPDF from "../herramientasPDF/RequisicionPDF";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
Modal.setAppElement("#root");

const ModalDetalleRequisicion = ({ isOpen, requisicion, onClose }) => {
  useEffect(() => {
    // Acciones al abrir o cerrar, si se requiere
  }, [isOpen]);

  const normalizePath = (filePath) => filePath.replace(/\\/g, "/");
  const isImage = (filePath) => /\.(jpg|jpeg|png)$/i.test(filePath);
  const isPDF = (filePath) => /\.pdf$/i.test(filePath);

  const handleClose = () => {
    onClose();
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
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 sm:p-6 flex justify-between items-center text-white">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">
            Detalle de la Requisición
          </h2>
          <p className="text-xs sm:text-base opacity-90">
            Folio {requisicion?.folio} · {requisicion?.fecha}{" "}
            {requisicion?.hora}
          </p>
        </div>
        <button
          onClick={handleClose}
          className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[70vh] sm:max-h-[75vh]">
        {/* Información Principal */}
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

        {/* Sección de Artículos */}
        <div>
          <h3 className="text-lg font-bold text-gray-500 mb-3 text-center">
            Artículos de la Requisición
          </h3>
          <div className="space-y-4 sm:hidden">
            {requisicion?.articulos && requisicion.articulos.length > 0 ? (
              requisicion.articulos.map((articulo, index) => (
                <CardArticulo key={index} articulo={articulo} indice={index} />
              ))
            ) : (
              <p className="text-gray-500">No se han agregado artículos.</p>
            )}
          </div>
          <div className="hidden sm:block overflow-x-auto">
            {requisicion?.articulos && requisicion.articulos.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                      Cantidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                      Unidad de Medida
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                      Número de Parte
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500 tracking-wider">
                      Descripción
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requisicion.articulos.map((articulo, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {articulo.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {capitalizeWords(articulo.unidadMedida)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {articulo.numeroParte || "No asignado"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {articulo.descripcion || "Sin descripción"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No se han agregado artículos.</p>
            )}
          </div>
        </div>

        {/* Sección de Datos de Compra */}
        <div className="bg-gray-50 py-4 px-6 rounded-md border border-gray-100 mb-2">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Datos de la Orden de Compra
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="block text-gray-500 text-sm">N° Orden de Compra</span>
              <span className="text-gray-700 text-base font-medium">
                {requisicion?.numeroOrdenCompra || <span className="italic text-gray-400">No asignado</span>}
              </span>
            </div>
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
        </div>

        {/* Sección de Comentario */}
        <div className="bg-gray-50 py-4 px-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Comentario (comprador)
          </h3>
          {requisicion?.comentario ? (
            <p className="text-md text-gray-700 max-w-2xl">
              {requisicion.comentario}
            </p>
          ) : (
            <p className="text-md text-gray-500 italic">No hay comentario.</p>
          )}
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
                  className="inline-flex items-center px-4 py-2 border border-blue-400 rounded-md text-gray-500 hover:bg-blue-50 transition-colors duration-200 w-fit"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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

        {/* Sección de Documentos */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
            📂 Documentos
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {requisicion?.archivos && requisicion.archivos.length > 0 ? (
              requisicion.archivos.map((archivo, index) => {
                let fileUrl = "";
                let normalizedPath = "";
                if (typeof archivo === "string") {
                  normalizedPath = normalizePath(archivo);
                  fileUrl = `${baseUrl}/${normalizedPath}`;
                } else if (archivo && archivo.url) {
                  normalizedPath = archivo.url;
                  fileUrl = archivo.url;
                }
                return (
                  <div
                    key={index}
                    onClick={() => window.open(fileUrl, "_blank")}
                    className="border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transform hover:scale-105 transition flex flex-col"
                  >
                    <div className="flex-1">
                      {isImage(normalizedPath) ? (
                        <img
                          src={fileUrl}
                          alt={`Documento ${index}`}
                          className="object-cover w-full h-24 sm:h-32 pointer-events-none"
                        />
                      ) : isPDF(normalizedPath) ? (
                        <div className="w-full h-24 sm:h-32 overflow-hidden pointer-events-none">
                          <object
                            data={fileUrl}
                            type="application/pdf"
                            className="w-full h-full pointer-events-none"
                          >
                            <div className="flex items-center justify-center h-24 sm:h-32">
                              <span className="text-xs">
                                Vista previa no disponible
                              </span>
                            </div>
                          </object>
                        </div>
                      ) : (
                        <span className="text-xs p-3 block">Archivo</span>
                      )}
                    </div>
                    <div className="flex items-center justify-center p-2 border-t border-gray-200 pointer-events-none">
                      {isImage(normalizedPath) ? (
                        <>
                          <AiFillFileImage className="text-green-500 text-xl mr-1" />
                          <span className="text-sm">Imagen</span>
                        </>
                      ) : isPDF(normalizedPath) ? (
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

      {/* Footer */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-between items-center">
        <PDFDownloadLink
          document={<RequisicionPDF requisicion={requisicion} />}
          fileName={`requisicion_${requisicion?.folio || "sin_folio"}.pdf`}
        >
          {({ loading }) => (
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition text-sm sm:text-base">
              {loading ? "Generando PDF..." : "Descargar PDF"}
            </button>
          )}
        </PDFDownloadLink>

        <button
          onClick={handleClose}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition text-sm sm:text-base"
        >
          Cerrar
        </button>
      </div>
    </Modal>
  );
};

export default ModalDetalleRequisicion;