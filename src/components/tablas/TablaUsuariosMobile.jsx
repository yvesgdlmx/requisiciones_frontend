import React, { useEffect, useState } from "react";
import { FiEdit2, FiMoreVertical, FiTrash2 } from "react-icons/fi";

const obtenerIniciales = (nombre, apellido) => {
  const primerNombre = nombre?.split(" ")[0] || "";
  const primerApellido = apellido?.split(" ")[0] || "";
  return (
    (primerNombre[0] || "").toUpperCase() +
    (primerApellido[0] || "").toUpperCase()
  );
};

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

  useEffect(() => {
    setPagina(1);
  }, [usuarios]);

  return (
    <div className="space-y-4">
      {registrosActuales.map((usuario) => (
        <div
          key={usuario.id}
          className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[#E2E8F0] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#DBEAFE] text-sm font-semibold text-[#2563EB]">
                {obtenerIniciales(usuario.nombre, usuario.apellido)}
              </div>
              <div>
                <p className="font-semibold text-[#334155]">
                  {usuario.nombre} {usuario.apellido}
                </p>
                <p className="text-xs text-[#64748B]">{usuario.email}</p>
              </div>
            </div>

            <div className="relative">
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B]"
                onClick={() => toggleMenu(usuario.id)}
                aria-label="Abrir acciones"
              >
                <FiMoreVertical className="h-4 w-4" />
              </button>

              {menuAbierto === usuario.id && (
                <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      onEditar(usuario.id);
                      cerrarMenu();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-[#334155] hover:bg-[#F8FAFC]"
                  >
                    <FiEdit2 className="h-4 w-4 text-[#2563EB]" />
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onEliminar(usuario.id);
                      cerrarMenu();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <FiTrash2 className="h-4 w-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-3 px-4 py-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Área</p>
              <p className="mt-1 font-semibold text-[#334155]">{usuario.area || "Sin área"}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Rol</p>
              <p className="mt-1 font-semibold capitalize text-[#334155]">{usuario.rol || "Sin rol"}</p>
            </div>
          </div>
        </div>
      ))}

      {registrosActuales.length === 0 && (
        <div className="rounded-lg border border-dashed border-[#E2E8F0] bg-white px-5 py-8 text-center text-[#64748B]">
          No se encontraron usuarios.
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setPagina((actual) => Math.max(1, actual - 1))}
            className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#64748B] disabled:opacity-50"
            disabled={pagina === 1}
          >
            Anterior
          </button>
          <p className="text-sm text-[#64748B]">
            {indiceInicio + 1} - {Math.min(indiceInicio + itemsPorPagina, usuarios.length)} de {usuarios.length}
          </p>
          <button
            type="button"
            onClick={() => setPagina((actual) => Math.min(totalPaginas, actual + 1))}
            className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#64748B] disabled:opacity-50"
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
