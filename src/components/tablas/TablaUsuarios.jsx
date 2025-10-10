import React from "react";

const obtenerIniciales = (nombre, apellido) => {
  const primerNombre = nombre?.split(" ")[0] || "";
  const primerApellido = apellido?.split(" ")[0] || "";
  return (
    (primerNombre[0] || "").toUpperCase() +
    (primerApellido[0] || "").toUpperCase()
  );
};

const TablaUsuarios = ({
  usuarios,
  menuAbierto,
  toggleMenu,
  cerrarMenu,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-3 px-6 text-left text-sm font-semibold rounded-tl-lg">
              Nombre
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Apellido
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">Email</th>
            <th className="py-3 px-6 text-left text-sm font-semibold">Área</th>
            <th className="py-3 px-6 text-left text-sm font-semibold">Rol</th>
            <th className="py-3 px-6 rounded-tr-lg"></th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario, idx) => {
            const { id, nombre, apellido, email, area, rol } = usuario;
            return (
              <tr
                key={id}
                className={`transition-shadow ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:shadow-lg hover:bg-blue-50`}
                style={{ borderBottom: "none" }}
              >
                <td className="py-4 px-6 flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base shadow-md">
                      {obtenerIniciales(nombre, apellido)}
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">{nombre}</span>
                </td>
                <td className="py-4 px-6">{apellido}</td>
                <td className="py-4 px-6">{email}</td>
                <td className="py-4 px-6">{area}</td>
                <td className="py-4 px-6">{rol}</td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => toggleMenu(id)}
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    <svg
                      className="w-6 h-6 text-gray-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <circle cx="10" cy="4" r="1.5" />
                      <circle cx="10" cy="10" r="1.5" />
                      <circle cx="10" cy="16" r="1.5" />
                    </svg>
                  </button>
                  {menuAbierto === id && (
                    <div
                      className={`absolute right-0 ${
                        idx === usuarios.length - 1 ? "bottom-0 mb-10" : "mt-2"
                      } w-32 bg-white border border-gray-200 rounded shadow-lg z-10`}
                      onMouseLeave={cerrarMenu}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          cerrarMenu();
                          onEditar && onEditar(id);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          cerrarMenu();
                          onEliminar && onEliminar(id);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          {usuarios.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="py-6 text-center text-gray-400 bg-white rounded-b-lg"
              >
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaUsuarios;
