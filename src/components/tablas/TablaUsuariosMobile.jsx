import React, { useState } from "react";
import { FaTrash, FaPencilAlt } from "react-icons/fa";

const TablaUsuariosMobile = ({
  usuarios,
  itemsPorPagina,
  menuAbierto,
  toggleMenu,
  cerrarMenu,
  onEditar,
  onEliminar,
}) => {
  const [pagina, setPagina] = useState(1);
  const totalPaginas = Math.ceil(usuarios.length / itemsPorPagina);
  const indiceInicio = (pagina - 1) * itemsPorPagina;
  const registrosActuales = usuarios.slice(indiceInicio, indiceInicio + itemsPorPagina);

  const handlePrevPage = () => {
    if (pagina > 1) setPagina(pagina - 1);
  };
  const handleNextPage = () => {
    if (pagina < totalPaginas) setPagina(pagina + 1);
  };

  return (
    <div>
      {registrosActuales.map((usuario) => (
        <div
          key={usuario.id}
          className="bg-white shadow-md rounded-xl mb-6 border border-gray-100 hover:shadow-lg transition-shadow"
        >
          {/* Encabezado */}
          <div className="p-4 flex justify-between items-center border-b border-gray-200">
            <span className="text-blue-700 font-semibold text-md">
              {usuario.nombre} {usuario.apellido}
            </span>
            <div className="relative">
              <div
                className="text-gray-400 text-2xl cursor-pointer"
                onClick={() => toggleMenu(usuario.id)}
              >
                ⋮
              </div>
              {menuAbierto === usuario.id && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      onEditar(usuario.id);
                      cerrarMenu();
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-blue-50 transition-colors"
                  >
                    <FaPencilAlt className="text-blue-500" /> Editar
                  </button>
                  <button
                    onClick={() => {
                      onEliminar(usuario.id);
                      cerrarMenu();
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 hover:bg-red-50 transition-colors"
                  >
                    <FaTrash className="text-red-500" /> Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>
          {/* Cuerpo */}
          <div className="p-4">
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Correo:</span>{" "}
              <span className="text-gray-700">{usuario.email}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold text-gray-600">Área:</span>{" "}
              <span className="text-gray-700">{usuario.area}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-600">Rol:</span>{" "}
              <span className="text-gray-700">{usuario.rol}</span>
            </div>
          </div>
        </div>
      ))}
      {registrosActuales.length === 0 && (
        <div className="text-center text-gray-400 py-4">No se encontraron usuarios.</div>
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
            {indiceInicio + 1} - {Math.min(indiceInicio + itemsPorPagina, usuarios.length)} de {usuarios.length} usuarios
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

export default TablaUsuariosMobile;