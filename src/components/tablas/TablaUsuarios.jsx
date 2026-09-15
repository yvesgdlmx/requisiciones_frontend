import React from "react";
import { FiEdit2, FiMail, FiMoreVertical, FiTrash2, FiUsers } from "react-icons/fi";

const obtenerIniciales = (nombre, apellido) => {
  const primerNombre = nombre?.split(" ")[0] || "";
  const primerApellido = apellido?.split(" ")[0] || "";
  return (
    (primerNombre[0] || "").toUpperCase() +
    (primerApellido[0] || "").toUpperCase()
  );
};

const formatearRol = (rol) => {
  if (!rol) return "Sin rol";
  if (rol === "superadmin") return "Super admin";
  if (rol === "admin") return "Admin";
  return "Usuario";
};

const getRolColor = (rol) => {
  const colores = {
    superadmin: "border-[#DBEAFE] bg-[#DBEAFE]/60 text-[#1E40AF]",
    admin: "border-emerald-100 bg-emerald-50 text-emerald-700",
    user: "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
  };

  return colores[rol] || "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]";
};

const TablaUsuarios = ({
  usuarios,
  totalUsuarios,
  menuAbierto,
  toggleMenu,
  cerrarMenu,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="bg-white">
      <div className="border-b border-[#E2E8F0] px-6 py-5">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[#334155]">
              Usuarios registrados
            </h2>
            <p className="text-sm text-[#64748B]">
              Cuentas con acceso al sistema de requisiciones.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
            <FiUsers className="h-3.5 w-3.5" />
            {totalUsuarios} usuarios
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full whitespace-nowrap">
          <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-xs uppercase tracking-wide text-[#64748B]">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">Usuario</th>
              <th className="px-6 py-4 text-left font-semibold">Email</th>
              <th className="px-6 py-4 text-left font-semibold">Área</th>
              <th className="px-6 py-4 text-left font-semibold">Rol</th>
              <th className="px-6 py-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E2E8F0] text-sm text-[#334155]">
            {usuarios.map((usuario, idx) => {
              const { id, nombre, apellido, email, area, rol } = usuario;

              return (
                <tr key={id} className="bg-white transition hover:bg-[#F8FAFC]">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#DBEAFE] text-sm font-semibold text-[#2563EB]">
                        {obtenerIniciales(nombre, apellido)}
                      </div>
                      <div>
                        <p className="font-semibold text-[#334155]">{nombre || "Sin nombre"}</p>
                        <p className="text-xs text-[#64748B]">{apellido || "Sin apellido"}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-[#64748B]">
                      <FiMail className="h-4 w-4 text-[#2563EB]" />
                      <span>{email || "Sin email"}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 font-medium text-[#334155]">
                    {area || "Sin área"}
                  </td>

                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getRolColor(rol)}`}>
                      {formatearRol(rol)}
                    </span>
                  </td>

                  <td className="relative px-6 py-5 text-right">
                    <button
                      type="button"
                      onClick={() => toggleMenu(id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
                      aria-label="Abrir acciones"
                    >
                      <FiMoreVertical className="h-4 w-4" />
                    </button>

                    {menuAbierto === id && (
                      <div
                        className={`absolute right-6 z-20 w-40 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-lg ${
                          idx === usuarios.length - 1 ? "bottom-14" : "mt-2"
                        }`}
                        onMouseLeave={cerrarMenu}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-[#334155] transition hover:bg-[#F8FAFC]"
                          onClick={() => {
                            cerrarMenu();
                            onEditar && onEditar(id);
                          }}
                        >
                          <FiEdit2 className="h-4 w-4 text-[#2563EB]" />
                          Editar
                        </button>
                        <button
                          type="button"
                          className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                          onClick={() => {
                            cerrarMenu();
                            onEliminar && onEliminar(id);
                          }}
                        >
                          <FiTrash2 className="h-4 w-4" />
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
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-lg bg-[#F8FAFC] text-[#64748B]">
                    <FiUsers className="h-5 w-5" />
                  </div>
                  <p className="font-semibold text-[#334155]">
                    No hay usuarios registrados.
                  </p>
                  <p className="mt-1 text-sm text-[#64748B]">
                    Ajusta la búsqueda o agrega un nuevo usuario.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaUsuarios;
