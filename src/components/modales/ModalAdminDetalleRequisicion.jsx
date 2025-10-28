import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaSave, FaTimes, FaTrashAlt } from "react-icons/fa";
import { AiOutlineFilePdf, AiFillFileImage } from "react-icons/ai";
import Swal from "sweetalert2";
import clienteAxios from "../../config/clienteAxios";
import { capitalizeWords } from "../../helpers/FuncionesHelpers";
import CardInfoRequisicion from "../cards/CardInfoRequisicion";
import CardArticulo from "../cards/CardArticulo";
import { PDFDownloadLink } from "@react-pdf/renderer";
import RequisicionPDF from "../herramientasPDF/RequisicionPDF";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
Modal.setAppElement("#root");

// Componente Spinner personalizado
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

const ModalAdminDetalleRequisicion = ({
  isOpen,
  requisicion,
  onClose,
  onUpdate,
}) => {
  const [nuevosDocumentos, setNuevosDocumentos] = useState([]);
  // NUEVO: Estado para manejar archivos existentes que se conservarán
  const [archivosExistentes, setArchivosExistentes] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [comentario, setComentario] = useState("");
  const [numeroOrdenCompra, setNumeroOrdenCompra] = useState("");
  const [proveedor, setProveedor] = useState("");
  const [tipoCompra, setTipoCompra] = useState("");
  // NUEVOS ESTADOS: solo monto y ETA
  const [moneda, setMoneda] = useState("pesos");
  const [cantidad, setCantidad] = useState("");
  const [eta, setEta] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Recuperar el rol del usuario (se asume que se guarda en localStorage)
  const userRole = localStorage.getItem("rol"); // "admin" o "superadmin"
  
  // Opciones para el select de status
  const statusOptions = [
    "creada",
    "rechazada",
    "cotizando",
    "aprobada",
    "esperando autorizacion",
    "autorizada",
    "liberacion aduanal",
    "proceso de entrega",
    "entregada parcial",
    "concluida",
    "cancelada",
  ];

  useEffect(() => {
    if (!isOpen) {
      setNuevosDocumentos([]);
      setArchivosExistentes([]);
      setComentario("");
      setNumeroOrdenCompra("");
      setProveedor("");
      setTipoCompra("");
      setMoneda("pesos");
      setCantidad("");
      setEta("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (requisicion) {
      setUpdatedStatus(requisicion.status);
      setComentario(requisicion.comentario || "");
      setNumeroOrdenCompra(requisicion.numeroOrdenCompra || "");
      setProveedor(requisicion.proveedor || "");
      setTipoCompra(requisicion.tipoCompra || "");
      
      // NUEVO: Inicializar archivos existentes
      setArchivosExistentes(requisicion.archivos || []);
      
      // Parsear el monto existente si existe
      if (requisicion.monto) {
        const montoPartes = requisicion.monto.split(" ");
        if (montoPartes.length === 2) {
          setCantidad(montoPartes[0]);
          setMoneda(montoPartes[1]);
        }
      } else {
        setCantidad("");
        setMoneda("pesos");
      }
      
      // Formatear la fecha ETA para el input date
      if (requisicion.eta) {
        const fecha = new Date(requisicion.eta);
        const fechaFormateada = fecha.toISOString().split('T')[0];
        setEta(fechaFormateada);
      } else {
        setEta("");
      }
    }
  }, [requisicion]);

  const normalizePath = (filePath) => filePath.replace(/\\/g, "/");
  const isImage = (filePath) => /\.(jpg|jpeg|png)$/i.test(filePath);
  const isPDF = (filePath) => /\.pdf$/i.test(filePath);

  const handleStatusChange = (e) => {
    if (userRole === "superadmin") {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Acción no permitida",
        text: "El usuario superadmin no puede cambiar el estado.",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }
    setUpdatedStatus(e.target.value);
  };

  const handleAgregarDocumento = (e) => {
    const files = Array.from(e.target.files);
    const total = nuevosDocumentos.length + files.length + archivosExistentes.length;
    if (total > 5) {
      alert("Máximo 5 archivos permitidos.");
      return;
    }
    setNuevosDocumentos((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const handleQuitarDocumento = (index) => {
    setNuevosDocumentos((prev) => prev.filter((_, i) => i !== index));
  };

  // NUEVA FUNCIÓN: Eliminar archivo existente
  const handleEliminarArchivoExistente = (index) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Este archivo se eliminará permanentemente cuando guardes los cambios.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setArchivosExistentes((prev) => prev.filter((_, i) => i !== index));
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Archivo marcado para eliminación",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    });
  };

  const renderPreviewNuevosDocumentos = () => (
    <div className="flex flex-wrap gap-2">
      {nuevosDocumentos.map((file, index) => {
        const fileUrl = URL.createObjectURL(file);
        return (
          <div
            key={index}
            className="relative w-32 h-32 border rounded flex items-center justify-center bg-gray-50"
          >
            {isImage(file.name) ? (
              <img
                src={fileUrl}
                alt={file.name}
                className="object-cover w-full h-full cursor-pointer"
                onClick={() => window.open(fileUrl, "_blank")}
              />
            ) : isPDF(file.name) ? (
              <div
                className="flex flex-col items-center justify-center p-2 cursor-pointer"
                onClick={() => window.open(fileUrl, "_blank")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V8.414a2 2 0 00-.586-1.414l-3.414-3.414A2 2 0 0010.586 3H6zm4 2a1 1 0 011 1v3h-2V5a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-xs mt-1">Ver PDF</span>
              </div>
            ) : (
              <span className="text-xs">{file.name}</span>
            )}
            <button
              type="button"
              onClick={() => handleQuitarDocumento(index)}
              className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-gray-200"
              title="Quitar archivo"
            >
              <FaTimes className="text-red-500" />
            </button>
          </div>
        );
      })}
    </div>
  );

  const handleClearComment = () => {
    setComentario("");
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    
    try {
      if (userRole === "superadmin" && updatedStatus !== requisicion.status) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "error",
          title: "Acción no permitida",
          text: "El usuario superadmin no puede cambiar el estado.",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
        return;
      }
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("status", updatedStatus);
      data.append("comentario", comentario);
      data.append("numeroOrdenCompra", numeroOrdenCompra);
      data.append("proveedor", proveedor);
      data.append("tipoCompra", tipoCompra === "" ? null : tipoCompra);
      
      // NUEVOS CAMPOS: solo monto y ETA
      const montoCompleto = cantidad && moneda ? `${cantidad} ${moneda}` : "";
      data.append("monto", montoCompleto);
      data.append("eta", eta);
      
      // NUEVO: Enviar archivos existentes que se conservarán
      data.append("archivosExistentes", JSON.stringify(archivosExistentes));
      
      nuevosDocumentos.forEach((file) => {
        data.append("archivo", file);
      });
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.put(
        `/requisiciones/${requisicion.id}/admin`,
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
      if (onUpdate) {
        onUpdate(response.data.requisicion);
      }
      onClose();
    } catch (error) {
      console.error("Error al actualizar la requisición:", error);
      const mensaje =
        error.response && error.response.data && error.response.data.msg
          ? error.response.data.msg
          : "Ocurrió un error al guardar los cambios.";
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error al actualizar",
        text: mensaje,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNuevosDocumentos([]);
    setArchivosExistentes([]);
    setComentario("");
    setNumeroOrdenCompra("");
    setProveedor("");
    setTipoCompra("");
    setMoneda("pesos");
    setCantidad("");
    setEta("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Detalle de la Requisición"
      overlayClassName="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl outline-none overflow-hidden flex flex-col max-h-full mx-4"
    >
      {isLoading ? (
        // Cuando está cargando, mostrar solo el spinner
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">Actualizando requisición...</p>
          </div>
        </div>
      ) : (
        // Cuando no está cargando, mostrar el contenido normal
        <>
          {/* HEADER */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 sm:p-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                Detalle de la Requisición
              </h2>
              <p className="text-xs sm:text-sm opacity-90">
                Folio {requisicion?.folio} · {requisicion?.fecha}{" "}
                {requisicion?.hora}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 py-1 px-2.5 rounded-full transition"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className="p-4 sm:p-6 space-y-6 overflow-y-auto">
            {/* Información Principal para pantallas pequeñas */}
            <div className="block sm:hidden">
              <CardInfoRequisicion
                requisicion={requisicion}
                updatedStatus={updatedStatus}
                statusOptions={statusOptions}
                handleStatusChange={handleStatusChange}
              />
            </div>

            {/* Tabla de Información Principal para pantallas grandes */}
            <div className="hidden sm:block overflow-x-auto mb-6">
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
                      <select
                        value={updatedStatus}
                        onChange={handleStatusChange}
                        className="border border-gray-300 rounded px-2 py-1"
                      >
                        {statusOptions.map((status, index) => (
                          <option key={index} value={status}>
                            {capitalizeWords(status)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {capitalizeWords(requisicion?.prioridad)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Artículos de la Requisición */}
            <div className="block sm:hidden">
              <h3 className="text-lg font-bold text-gray-500 mb-3 text-center">
                Artículos de la Requisición
              </h3>
              {requisicion?.articulos && requisicion.articulos.length > 0 ? (
                requisicion.articulos.map((articulo, index) => (
                  <CardArticulo key={index} articulo={articulo} indice={index} />
                ))
              ) : (
                <p className="text-gray-500">No se han agregado artículos.</p>
              )}
            </div>

            <div className="hidden sm:block overflow-x-auto mb-6">
              <h3 className="text-lg font-bold text-gray-500 mb-3 text-center">
                Artículos de la Requisición
              </h3>
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

            {/* Sección de Datos de Compra */}
            <div className="bg-gray-50 py-4 px-6 rounded-md border border-gray-100 mb-2">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Datos de la Orden de Compra
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    N° Orden de Compra
                  </label>
                  <input
                    type="text"
                    value={numeroOrdenCompra}
                    onChange={(e) => setNumeroOrdenCompra(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="No asignado"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Proveedor
                  </label>
                  <input
                    type="text"
                    value={proveedor}
                    onChange={(e) => setProveedor(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                    placeholder="No asignado"
                  />
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Tipo de Compra
                  </label>
                  <select
                    value={tipoCompra}
                    onChange={(e) => setTipoCompra(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="nacional">Nacional</option>
                    <option value="internacional">Internacional</option>
                  </select>
                </div>
              </div>
              
              {/* NUEVA SECCIÓN: Monto y ETA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    Monto
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={cantidad}
                      onChange={(e) => setCantidad(e.target.value)}
                      className="flex-1 border border-gray-300 rounded px-2 py-1"
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                    />
                    <select
                      value={moneda}
                      onChange={(e) => setMoneda(e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-500 text-sm mb-1">
                    ETA (Fecha Estimada de Entrega)
                  </label>
                  <input
                    type="date"
                    value={eta}
                    onChange={(e) => setEta(e.target.value)}
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </div>
              </div>
            </div>

            {/* Sección de Comentario */}
            <div className="space-y-2">
              <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                Comentario del comprador
              </h3>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Agrega un comentario (opcional)..."
                className="w-full border border-gray-300 p-2 rounded-lg focus:outline-none focus:border-blue-500"
                rows="3"
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleClearComment}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:underline"
                >
                  <FaTrashAlt />
                  <span>Limpiar</span>
                </button>
              </div>
            </div>

             {/* NUEVA SECCIÓN: Comentario del Autorizador */}
            <div className="bg-blue-50 py-4 px-6 rounded-md border border-gray-100 mb-2">
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Comentario del Autorizador
              </h3>
              {requisicion?.comentarioAutorizador ? (
                <p className="text-md text-gray-700 max-w-2xl">
                  {requisicion.comentarioAutorizador}
                </p>
              ) : (
                <p className="text-md text-gray-500 italic">No hay comentario del autorizador.</p>
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

            {/* Sección de Documentos - MODIFICADA */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                📂 Documentos
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {archivosExistentes && archivosExistentes.length > 0 ? (
                  archivosExistentes.map((archivo, index) => {
                    // Soporta ambos formatos: objeto (nuevo) o string (antiguo)
                    const fileUrl =
                      typeof archivo === "string" ? archivo : archivo.url;
                    // Normaliza solo si es string
                    const normalizedPath =
                      typeof fileUrl === "string"
                        ? fileUrl.replace(/\\/g, "/")
                        : "";
                    // Si es URL absoluta, úsala tal cual; si no, agrega baseUrl
                    const urlCompleta = fileUrl.startsWith("http")
                      ? fileUrl
                      : `${baseUrl}/${normalizedPath}`;
                    return (
                      <div
                        key={index}
                        className="relative border border-gray-200 rounded-lg shadow-sm overflow-hidden cursor-pointer transform hover:scale-105 transition flex flex-col"
                      >
                        {/* NUEVO: Botón de eliminar */}
                        <button
                          type="button"
                          onClick={() => handleEliminarArchivoExistente(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow hover:bg-red-600 z-10"
                          title="Eliminar archivo"
                        >
                          <FaTimes className="text-xs" />
                        </button>
                        
                        <div 
                          className="flex-1"
                          onClick={() => window.open(urlCompleta, "_blank")}
                        >
                          {isImage(urlCompleta) ? (
                            <img
                              src={urlCompleta}
                              alt={`Documento ${index}`}
                              className="object-cover w-full h-32 pointer-events-none"
                            />
                          ) : isPDF(urlCompleta) ? (
                            <div className="w-full h-32 overflow-hidden pointer-events-none">
                              <object
                                data={urlCompleta}
                                type="application/pdf"
                                className="w-full h-full pointer-events-none"
                              >
                                <div className="flex items-center justify-center h-32">
                                  <span className="text-xs">
                                    Vista previa no disponible
                                  </span>
                                </div>
                              </object>
                            </div>
                          ) : (
                            <span className="text-xs">{fileUrl}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-center p-2 border-t border-gray-200 pointer-events-none">
                          {isImage(urlCompleta) ? (
                            <>
                              <AiFillFileImage className="text-green-500 text-xl mr-1" />
                              <span className="text-sm">Imagen</span>
                            </>
                          ) : isPDF(urlCompleta) ? (
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
                  <p className="text-gray-500 col-span-2">
                    No se han subido documentos.
                  </p>
                )}
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agregar documento(s) (imagen o PDF, máximo 5 total)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  onChange={handleAgregarDocumento}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:font-semibold file:bg-gray-50 hover:file:bg-gray-100"
                  multiple
                />
                {nuevosDocumentos.length > 0 && (
                  <div className="mt-4">{renderPreviewNuevosDocumentos()}</div>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end items-center gap-3">
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
              onClick={handleSaveChanges}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm"
            >
              <FaSave />
              {isLoading ? "Guardando cambios..." : "Guardar cambios"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalAdminDetalleRequisicion;