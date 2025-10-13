import React from "react";
import useCrearRequisicion from "../../hooks/useCrearRequisicion";

// Componente Spinner personalizado
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

const FormNuevaRequisicion = ({ onClose, resetModal }) => {
  const {
    formData,
    isLoading,
    handleChange,
    fileInputRef,
    handleFileChange,
    removerArchivo,
    handleSubmit,
    handleAddArticulo,
    handleChangeArticulo,
    handleRemoveArticulo,
    handleAddLink,
    handleChangeLink,
    handleRemoveLink,
  } = useCrearRequisicion();

  return (
    <div className="relative">
      {/* Overlay del spinner */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50 rounded-2xl">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">Creando requisición...</p>
          </div>
        </div>
      )}

      <form
        onSubmit={(e) => handleSubmit(e, onClose, resetModal)}
        className="w-full"
      >
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-5xl mx-auto border border-gray-200">
          {/* Encabezado */}
          <header className="mb-8 pb-2">
            <p className="mt-2 text-gray-500 text-center">
              Ingrese la información requerida para generar la solicitud.
            </p>
          </header>
          
          {/* Datos Generales */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Datos Generales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Objetivo de la solicitud */}
              <div>
                <label
                  htmlFor="objetivo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Objetivo de la solicitud
                </label>
                <input
                  type="text"
                  name="objetivo"
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                  required
                  disabled={isLoading}
                />
              </div>
              {/* Prioridad */}
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
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                  required
                  disabled={isLoading}
                >
                  <option value="muy alto">Muy Alto</option>
                  <option value="alto">Alto</option>
                  <option value="moderado">Moderado</option>
                </select>
              </div>
            </div>
          </section>
          
          {/* Links relacionados */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Links De Referencia (opcional)
            </h3>
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
              Agregar Link
            </button>
          </section>
          
          {/* Subida de Archivos */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Subir Archivos <br></br> <span className="text-sm text-blue-500">(Cotización)</span>
            </h3> 
            <div>
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
              {formData.archivos.length > 0 && (
                <div className="space-y-2">
                  {formData.archivos.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 border rounded-md"
                    >
                      <span
                        className="text-sm text-gray-600 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removerArchivo(index)}
                        className="text-red-500 hover:underline text-xs disabled:opacity-50 disabled:cursor-not-allowed"
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
          
          {/* Artículos */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Artículos Solicitados
            </h3>
            {formData.articulos.length === 0 && (
              <p className="text-gray-500 mb-4">No se han agregado artículos.</p>
            )}
            {formData.articulos.map((articulo, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cantidad */}
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
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                      required
                      min="0"
                      disabled={isLoading}
                    />
                  </div>
                  {/* Unidad de Medida */}
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
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
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
                  {/* Número de Parte */}
                  <div>
                    <label
                      htmlFor={`numeroParte-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Número de Parte (si aplica)
                    </label>
                    <input
                      type="text"
                      id={`numeroParte-${index}`}
                      name="numeroParte"
                      value={articulo.numeroParte}
                      onChange={(e) => handleChangeArticulo(index, e)}
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                      disabled={isLoading}
                    />
                  </div>
                  {/* Descripción */}
                  <div>
                    <label
                      htmlFor={`descripcion-${index}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Descripción
                    </label>
                    <small className="block mb-1 text-gray-500 text-xs">
                      medidas, material, marca o cualquier especificación.
                    </small>
                    <textarea
                      id={`descripcion-${index}`}
                      name="descripcion"
                      value={articulo.descripcion}
                      onChange={(e) => handleChangeArticulo(index, e)}
                      rows="3"
                      className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveArticulo(index)}
                    className="text-red-600 hover:underline text-sm transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
          
          {/* Botones de Acción */}
          <footer className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => onClose && onClose()}
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
              {isLoading ? "Guardando..." : "Guardar"}
            </button>
          </footer>
        </div>
      </form>
    </div>
  );
};

export default FormNuevaRequisicion;