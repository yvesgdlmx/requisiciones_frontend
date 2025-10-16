import React, { useState, useRef, useEffect } from "react";
import Modal from "react-modal";
import clienteAxios from "../../config/clienteAxios";
import Swal from "sweetalert2";

// Configuración para react-modal
Modal.setAppElement("#root");

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
const normalizePath = (filePath) => filePath.replace(/\\/g, "/");

// Componente Spinner personalizado
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

const renderArchivo = (file, index, removerArchivoExistente, isLoading) => {
  // Soporta ambos formatos: objeto (nuevo) o string (antiguo)
  const fileUrl = typeof file === "string" ? file : file.url;
  const extension = fileUrl.split(".").pop().toLowerCase();

  if (extension === "pdf") {
    return (
      <div
        key={index}
        className="relative w-24 h-24 border rounded-md overflow-visible"
      >
        <object
          data={fileUrl}
          type="application/pdf"
          width="100%"
          height="100%"
          className="pointer-events-none"
        >
          <p className="text-xs text-gray-600">
            PDF –{" "}
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              Abrir
            </a>
          </p>
        </object>
        <button
          type="button"
          onClick={() => removerArchivoExistente(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-md z-10 pb-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          x
        </button>
      </div>
    );
  } else {
    return (
      <div key={index} className="relative">
        <img
          src={fileUrl}
          alt={`Archivo ${index + 1}`}
          className="w-24 h-24 object-cover border rounded-md"
        />
        <button
          type="button"
          onClick={() => removerArchivoExistente(index)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-md pb-1 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          x
        </button>
      </div>
    );
  }
};

const ModalEditarRequisicion = ({ isOpen, onClose, requisicion }) => {
  // El estado inicial no incluye los archivos ya existentes en "formData",
  // ya que estos se mantienen en "preservedFiles"
  const initialFormState = {
    objetivo: requisicion?.objetivo || "",
    prioridad: requisicion?.prioridad || "moderado",
    articulos: requisicion?.articulos || [],
    archivos: [],
    links: requisicion?.links || [],
  };
  
  // Estado para el formulario y para los archivos existentes
  const [formData, setFormData] = useState(initialFormState);
  const [preservedFiles, setPreservedFiles] = useState(
    requisicion?.archivos || []
  );
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Cada vez que cambie la requisición se reestablece el formulario y preservedFiles.
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

  //Manejo de links
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

  // Manejo de artículos
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

  // Manejo de archivos nuevos
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

  // Función para remover un archivo existente y actualizar preservedFiles
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
      // Enviamos los archivos existentes que no fueron removidos
      data.append("archivosExistentes", JSON.stringify(preservedFiles));
      // Adjuntamos cada uno de los nuevos archivos
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

      // Solo se resetean los archivos nuevos; los existentes se mantienen según la respuesta del backend
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
      overlayClassName="fixed inset-0 flex justify-center items-center"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.42)" } }}
      className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl outline-none mx-4 max-h-[90vh] overflow-y-auto"
    >
      {isLoading ? (
        // Cuando está cargando, mostrar solo el spinner
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">Actualizando requisición...</p>
          </div>
        </div>
      ) : (
        // Cuando no está cargando, mostrar el contenido normal
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-600 text-center">
            Editar Requisición
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección de Datos Generales */}
            <section className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="objetivo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Objetivo
                </label>
                <textarea
                  name="objetivo"
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3"
                  rows="2"
                  required
                  disabled={isLoading}
                />
              </div>
              <div>
                <label
                  htmlFor="prioridad"
                  className="block text-sm font-medium text-gray-700"
                >
                  Prioridad
                </label>
                <select
                  name="prioridad"
                  id="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3"
                  disabled={isLoading}
                >
                  <option value="muy alto">Muy alto</option>
                  <option value="alto">Alto</option>
                  <option value="moderado">Moderado</option>
                </select>
              </div>
            </section>
            
            {/* Sección de Artículos */}
            <section>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
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
                        className="block text-sm font-medium text-gray-700"
                      >
                        Cantidad
                      </label>
                      <input
                        type="number"
                        id={`cantidad-${index}`}
                        name="cantidad"
                        value={articulo.cantidad}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        required
                        min="0"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`unidadMedida-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Unidad de Medida
                      </label>
                      <select
                        id={`unidadMedida-${index}`}
                        name="unidadMedida"
                        value={articulo.unidadMedida}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        required
                        disabled={isLoading}
                      >
                        <option value="">Seleccione una opción</option>
                        <option value="Pieza">Pieza</option>
                        <option value="Galon">Galon</option>
                        <option value="Cubeta">Cubeta</option>
                        <option value="Metros">Metros</option>
                        <option value="Caja">Caja</option>
                        <option value="Paquete">Paquete</option>
                        <option value="Frasco">Frasco</option>
                        <option value="KG">KG</option>
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor={`numeroParte-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Número de Parte (opcional)
                      </label>
                      <input
                        type="text"
                        id={`numeroParte-${index}`}
                        name="numeroParte"
                        value={articulo.numeroParte}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor={`descripcion-${index}`}
                        className="block text-sm font-medium text-gray-700"
                      >
                        Descripción
                      </label>
                      <textarea
                        id={`descripcion-${index}`}
                        name="descripcion"
                        value={articulo.descripcion}
                        onChange={(e) => handleChangeArticulo(index, e)}
                        rows="3"
                        className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
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
            
            {/* Sección de Links */}
            <section>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Links relacionados (opcional)
              </label>
              {formData.links && formData.links.length > 0 && (
                <div className="mb-2 space-y-2">
                  {formData.links.map((link, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="url"
                        name={`link-${index}`}
                        value={link}
                        onChange={(e) => handleChangeLink(index, e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-md mr-2"
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
                className="inline-flex items-center px-5 py-2 border border-dashed border-blue-500 rounded-md text-blue-500 hover:bg-blue-50 transition-colors duration-200 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
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
            
            {/* Sección de Archivos */}
            <section>
              {preservedFiles?.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Archivos existentes
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {preservedFiles.map((file, index) =>
                      renderArchivo(file, index, removerArchivoExistente, isLoading)
                    )}
                  </div>
                </div>
              )}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agregar nuevos archivos (Imagen o PDF)
                </label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current.click()}
                  className="mb-2 px-4 py-2 border border-dashed border-gray-400 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
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
                  <div className="mt-2 space-y-2">
                    {formData.archivos.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border border-gray-300 rounded-md px-3 py-1"
                      >
                        <span className="text-sm truncate" title={file.name}>
                          {file.name}
                        </span>
                        <button
                          type="button"
                          className="text-red-500 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
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
            
            {/* Botones de Acción */}
            <footer className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={() => {
                  if (!isLoading) {
                    // Reiniciamos el formulario sin afectar preservedFiles
                    setFormData({
                      objetivo: requisicion?.objetivo || "",
                      prioridad: requisicion?.prioridad || "moderado",
                      articulos: requisicion?.articulos || [],
                      archivos: [],
                    });
                    onClose();
                  }
                }}
                className="px-6 py-3 border rounded-md border-gray-400 text-gray-800 hover:bg-gray-100 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? "Guardando cambios..." : "Guardar Cambios"}
              </button>
            </footer>
          </form>
        </>
      )}
    </Modal>
  );
};

export default ModalEditarRequisicion;