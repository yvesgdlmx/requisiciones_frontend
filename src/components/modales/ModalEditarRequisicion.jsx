import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import clienteAxios from "../../config/clienteAxios";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

const renderArchivo = (file, index, removerArchivoExistente, isLoading) => {
  const fileUrl = typeof file === "string" ? file : file.url;
  const extension = fileUrl.split(".").pop().toLowerCase();

  if (extension === "pdf") {
    return (
      <div
        key={index}
        className="relative w-32 h-32 border rounded-lg overflow-hidden flex items-center justify-center bg-gray-50"
      >
        <object
          data={fileUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="pointer-events-none"
        >
          <div className="flex items-center justify-center h-full">
            <span className="text-xs text-gray-600">Vista previa no disponible</span>
          </div>
        </object>
        <button
          type="button"
          onClick={() => removerArchivoExistente(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          ×
        </button>
      </div>
    );
  } else {
    return (
      <div key={index} className="relative w-32 h-32">
        <img
          src={fileUrl}
          alt={`Archivo ${index + 1}`}
          className="w-full h-full object-cover border rounded-lg"
        />
        <button
          type="button"
          onClick={() => removerArchivoExistente(index)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          ×
        </button>
      </div>
    );
  }
};

const ModalEditarRequisicion = ({ isOpen, onClose, requisicion }) => {
  const initialFormState = {
    objetivo: requisicion?.objetivo || "",
    prioridad: requisicion?.prioridad || "moderado",
    articulos: requisicion?.articulos || [],
    archivos: [],
    links: requisicion?.links || [],
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [preservedFiles, setPreservedFiles] = useState(requisicion?.archivos || []);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (requisicion) {
      setFormData({
        objetivo: requisicion.objetivo || "",
        prioridad: requisicion.prioridad || "moderado",
        articulos: requisicion.articulos || [],
        archivos: [],
        links: requisicion.links || [],
      });
      setPreservedFiles(requisicion.archivos || []);
    }
  }, [requisicion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...(prev.links || []), ""],
    }));
  };

  const handleChangeLink = (index, value) => {
    setFormData((prev) => {
      const updatedLinks = [...(prev.links || [])];
      updatedLinks[index] = value;
      return { ...prev, links: updatedLinks };
    });
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: (prev.links || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddArticulo = () => {
    setFormData((prev) => ({
      ...prev,
      articulos: [
        ...prev.articulos,
        { cantidad: "", unidadMedida: "", numeroParte: "", descripcion: "" },
      ],
    }));
  };

  const handleChangeArticulo = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedArticulos = prev.articulos.map((articulo, idx) =>
        idx === index ? { ...articulo, [name]: value } : articulo
      );
      return { ...prev, articulos: updatedArticulos };
    });
  };

  const handleRemoveArticulo = (index) => {
    setFormData((prev) => ({
      ...prev,
      articulos: prev.articulos.filter((_, idx) => idx !== index),
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      archivos: [...prev.archivos, ...files],
    }));
    e.target.value = "";
  };

  const removerNuevoArchivo = (index) => {
    setFormData((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index),
    }));
  };

  const removerArchivoExistente = (index) => {
    setPreservedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      data.append("objetivo", formData.objetivo);
      data.append("prioridad", formData.prioridad);
      data.append("articulos", JSON.stringify(formData.articulos));
      data.append("links", JSON.stringify(formData.links || []));
      data.append("archivosExistentes", JSON.stringify(preservedFiles));
      formData.archivos.forEach((file) => {
        data.append("archivo", file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await clienteAxios.put(
        `/requisiciones/${requisicion.id}/editar`,
        data,
        config
      );

      console.log("Requisición actualizada con éxito:", response.data);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Requisición actualizada correctamente!",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });

      setFormData((prev) => ({ ...prev, archivos: [] }));
      onClose();
    } catch (error) {
      console.error("Error al actualizar la requisición:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No se pudo actualizar la requisición. Inténtalo nuevamente.",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        if (!isLoading) {
          setFormData({
            objetivo: requisicion?.objetivo || "",
            prioridad: requisicion?.prioridad || "moderado",
            articulos: requisicion?.articulos || [],
            archivos: [],
          });
          onClose();
        }
      }}
      contentLabel="Editar Requisición"
      overlayClassName="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl outline-none overflow-hidden flex flex-col max-h-full mx-4"
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">Actualizando requisición...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header verde degradado */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 sm:p-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Editar Requisición</h2>
              <p className="text-xs sm:text-sm opacity-90">
                Folio {requisicion?.folio} · Modifica la información según sea necesario
              </p>
            </div>
            <button
              onClick={() => {
                if (!isLoading) {
                  setFormData({
                    objetivo: requisicion?.objetivo || "",
                    prioridad: requisicion?.prioridad || "moderado",
                    articulos: requisicion?.articulos || [],
                    archivos: [],
                  });
                  onClose();
                }
              }}
              className="bg-white/20 hover:bg-white/30 py-1 px-2.5 rounded-full transition"
              disabled={isLoading}
            >
              ✕
            </button>
          </div>

          {/* Body con scroll */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
            
            {/* Datos Generales */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="objetivo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Objetivo
                  </label>
                  <textarea
                    name="objetivo"
                    id="objetivo"
                    value={formData.objetivo}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                    rows="3"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label
                    htmlFor="prioridad"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Prioridad
                  </label>
                  <select
                    name="prioridad"
                    id="prioridad"
                    value={formData.prioridad}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                    disabled={isLoading}
                  >
                    <option value="muy alto">Muy Alto</option>
                    <option value="alto">Alto</option>
                    <option value="moderado">Moderado</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Artículos */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Artículos Solicitados
              </h3>
              {formData.articulos?.length === 0 && (
                <p className="text-gray-500 mb-4">No se han agregado artículos.</p>
              )}
              {formData.articulos?.map((articulo, index) => (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor={`cantidad-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Cantidad
                      </label>
                      <input
                        type="number"
                        id={`cantidad-${index}`}
                        name="cantidad"
                        value={articulo.cantidad}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                        required
                        min="0"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`unidadMedida-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Unidad de Medida
                      </label>
                      <select
                        id={`unidadMedida-${index}`}
                        name="unidadMedida"
                        value={articulo.unidadMedida}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="Pieza">Pieza</option>
                        <option value="Galon">Galón</option>
                        <option value="Cubeta">Cubeta</option>
                        <option value="Metros">Metros</option>
                        <option value="Caja">Caja</option>
                        <option value="Paquete">Paquete</option>
                        <option value="Frasco">Frasco</option>
                        <option value="KG">KG</option>
                        <option value="Bidon">Bidón</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`numeroParte-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Número de Parte (opcional)
                      </label>
                      <input
                        type="text"
                        id={`numeroParte-${index}`}
                        name="numeroParte"
                        value={articulo.numeroParte}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`descripcion-${index}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Descripción
                      </label>
                      <textarea
                        id={`descripcion-${index}`}
                        name="descripcion"
                        value={articulo.descripcion}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="button"
                      onClick={() => handleRemoveArticulo(index)}
                      className="text-red-600 hover:underline text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      Eliminar artículo
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddArticulo}
                className="w-full inline-flex items-center justify-center px-5 py-3 border border-green-600 rounded-md text-green-600 hover:bg-green-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar artículo
              </button>
            </section>

            {/* Links */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Links Relacionados (opcional)
              </h3>
              {formData.links && formData.links.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="url"
                        name={`link-${index}`}
                        value={link}
                        onChange={(e) => handleChangeLink(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        placeholder="https://ejemplo.com"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveLink(index)}
                        className="text-red-500 hover:underline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={handleAddLink}
                className="inline-flex items-center px-5 py-3 border border-dashed border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Agregar Link
              </button>
            </section>

            {/* Archivos */}
            <section>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">📂 Documentos</h3>
              
              {preservedFiles?.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Archivos existentes</h4>
                  <div className="flex flex-wrap gap-4">
                    {preservedFiles.map((file, index) =>
                      renderArchivo(file, index, removerArchivoExistente, isLoading)
                    )}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Agregar nuevos archivos (Imagen o PDF)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="inline-flex items-center px-5 py-3 border border-dashed border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Agregar Archivo
                </button>
                <input
                  type="file"
                  name="archivo"
                  id="archivo"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  multiple
                  ref={fileInputRef}
                  className="hidden"
                  disabled={isLoading}
                />
                {formData.archivos?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {formData.archivos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md"
                      >
                        <span className="text-sm text-gray-600 truncate" title={file.name}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          className="text-red-500 hover:underline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                          onClick={() => removerNuevoArchivo(index)}
                          disabled={isLoading}
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Footer fijo */}
          <div className="sticky bottom-0 bg-gray-50 px-4 sm:px-6 py-3 flex justify-end items-center gap-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                if (!isLoading) {
                  setFormData({
                    objetivo: requisicion?.objetivo || "",
                    prioridad: requisicion?.prioridad || "moderado",
                    articulos: requisicion?.articulos || [],
                    archivos: [],
                  });
                  onClose();
                }
              }}
              className="px-6 py-3 border rounded-md border-gray-400 text-gray-800 hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Guardando cambios..." : "Guardar Cambios"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalEditarRequisicion;