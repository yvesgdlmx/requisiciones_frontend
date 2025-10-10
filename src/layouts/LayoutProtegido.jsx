import React, { useState } from "react";
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { FiFileText, FiCheckCircle, FiList } from "react-icons/fi";
import { RiMenuFoldLine, RiMenuUnfoldLine } from "react-icons/ri";
import { FaUserCircle } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import ModalPerfil from "../components/modales/ModalPerfil";
const baseUrl = import.meta.env.VITE_BACKEND_URL || "";

const LayoutProtegido = () => {
  const [expandido, setExpandido] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarSidebarMovil, setMostrarSidebarMovil] = useState(false);

  const { auth, cargando } = useAuth();
  if (cargando) return "Cargando...";

  const SeccionActual = ({ isActive }) =>
    `flex items-center p-2 rounded-lg transition hover:bg-white/10 ${
      isActive ? "bg-white/20 text-white font-semibold" : "text-white"
    }`;

  const tieneRolSoloAdmin = auth.rol === "admin";
  const tieneRolAdmin = auth.rol === "admin" || auth.rol === "superadmin";
  const tieneRolSuperAdmin = auth.rol === "superadmin";

  const imagenSidebar = auth.imagenPerfil
  ? (typeof auth.imagenPerfil === "string"
      ? `${baseUrl}/${auth.imagenPerfil.replace(/\\/g, "/")}`
      : auth.imagenPerfil.url)
  : null;

  return (
    <>
      {auth.id ? (
        <div className="flex h-screen relative">
          {/* Sidebar versión pantallas grandes */}
          <aside
            className={`hidden md:flex flex-col transition-all duration-300 ${
              expandido ? "w-72" : "w-20"
            } bg-blue-900 text-white h-full`}
          >
            {/* Logo */}
            {expandido && (
              <div className="flex items-center justify-center h-24 border-b border-white/20">
                <img src="/img/logo_real.png" alt="logo" className="w-46 h-20" />
              </div>
            )}
            {/* Navegación */}
            <nav className={expandido ? "flex-1 mt-8 px-3" : "flex-1 mt-8 px-5"}>
              <ul className="space-y-2">
                <li>
                  <NavLink to="/requisiciones" end className={SeccionActual}>
                    <FiFileText className="text-xl" />
                    {expandido && <span className="ml-3">Mis requisiciones</span>}
                  </NavLink>
                </li>
                {tieneRolAdmin && (
                  <li>
                    <NavLink
                      to="/requisiciones/todas-requisiciones"
                      className={SeccionActual}
                    >
                      <FiList className="text-xl" />
                      {expandido && (
                        <span className="ml-3">Todas las requisiciones</span>
                      )}
                    </NavLink>
                  </li>
                )}
                {tieneRolSoloAdmin && (
                  <li>
                    <NavLink
                      to="/requisiciones/registrar"
                      className={SeccionActual}
                    >
                      <FaUserCircle className="text-xl" />
                      {expandido && (
                        <span className="ml-3">Cuentas de usuarios</span>
                      )}
                    </NavLink>
                  </li>
                )}
                {tieneRolSuperAdmin && (
                  <li>
                    <NavLink
                      to="/requisiciones/en-autorizacion"
                      className={SeccionActual}
                    >
                      <FiCheckCircle className="text-xl" />
                      {expandido && (
                        <span className="ml-3">Autorizar requisiciones</span>
                      )}
                    </NavLink>
                  </li>
                )}
              </ul>
            </nav>
            {/* Sección de perfil en el sidebar */}
            {expandido ? (
              <div
                className="flex items-center justify-between px-4 py-4 border-t border-white/20 cursor-pointer"
                onClick={() => setMostrarModal(true)}
              >
                <div className="flex items-center">
                  {imagenSidebar ? (
                    <img
                      src={imagenSidebar}
                      alt="Perfil"
                      className="w-11 h-11 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <FaUserCircle className="w-11 h-11 text-white mr-3" />
                  )}
                  <div>
                    <div className="font-semibold text-white">
                      {auth.nombre}
                    </div>
                    <div className="text-sm text-white/80">
                      {auth.area}
                    </div>
                  </div>
                </div>
                {/* Botón para contraer el menú */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setExpandido(false);
                  }}
                  aria-label="Cerrar menú"
                  title="Cerrar menú"
                  className="p-2 rounded-full hover:bg-white/10 transition transform duration-300"
                >
                  <RiMenuFoldLine className="text-2xl text-white" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-24 border-t border-white/20">
                <button
                  onClick={() => setExpandido(true)}
                  aria-label="Abrir menú"
                  title="Abrir menú"
                  className="p-2 rounded-full hover:bg-white/10 transition transform duration-300"
                >
                  <RiMenuUnfoldLine className="text-2xl text-white" />
                </button>
              </div>
            )}
          </aside>
          {/* Sidebar versión móvil */}
          <aside
            className={`md:hidden fixed inset-y-0 left-0 z-50 transition-transform duration-300 bg-blue-900 text-white ${
              mostrarSidebarMovil ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex flex-col h-full">
              {/* Logo */}
              <div className="flex items-center justify-center h-16 border-b border-white/20">
                <img src="/img/logo_real.png" alt="logo" className="w-32 h-10" />
              </div>
              {/* Navegación */}
              <nav className="flex-1 mt-4 px-3">
                <ul className="space-y-2">
                  <li>
                    <NavLink
                      to="/requisiciones"
                      end
                      className={SeccionActual}
                      onClick={() => setMostrarSidebarMovil(false)}
                    >
                      <FiFileText className="text-xl" />
                      <span className="ml-3">Mis requisiciones</span>
                    </NavLink>
                  </li>
                  {tieneRolAdmin && (
                    <li>
                      <NavLink
                        to="/requisiciones/todas-requisiciones"
                        className={SeccionActual}
                        onClick={() => setMostrarSidebarMovil(false)}
                      >
                        <FiList className="text-xl"/>
                        <span className="ml-3">Todas las requisiciones</span>
                      </NavLink>
                    </li>
                  )}
                  {tieneRolSoloAdmin && (
                    <li>
                      <NavLink
                        to="/requisiciones/registrar"
                        className={SeccionActual}
                        onClick={() => setMostrarSidebarMovil(false)}
                      >
                        <FaUserCircle className="text-xl" />
                        <span className="ml-3">Cuentas de usuarios</span>
                      </NavLink>
                    </li>
                  )}
                  {tieneRolSuperAdmin && (
                    <li>
                      <NavLink
                        to="/requisiciones/en-autorizacion"
                        className={SeccionActual}
                        onClick={() => setMostrarSidebarMovil(false)}
                      >
                        <FiCheckCircle className="text-xl"/>
                        <span className="ml-3">Autorizar requisiciones</span>
                      </NavLink>
                    </li>
                  )}
                </ul>
              </nav>
              {/* Sección de perfil móvil */}
              <div
                className="flex items-center justify-between px-4 py-4 border-t border-white/20 cursor-pointer"
                onClick={() => {
                  setMostrarModal(true);
                  setMostrarSidebarMovil(false);
                }}
              >
                <div className="flex items-center">
                  {imagenSidebar ? (
                    <img
                      src={imagenSidebar}
                      alt="Perfil"
                      className="w-11 h-11 rounded-full object-cover mr-3"
                    />
                  ) : (
                    <FaUserCircle className="w-11 h-11 text-white mr-3" />
                  )}
                  <div>
                    <div className="font-semibold text-white">
                      {auth.nombre}
                    </div>
                    <div className="text-sm text-white/80">
                      {auth.area}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMostrarSidebarMovil(false);
                  }}
                  aria-label="Cerrar menú"
                  title="Cerrar menú"
                  className="p-2 rounded-full hover:bg-white/10 transition transform duration-300"
                >
                  <RiMenuFoldLine className="text-2xl text-white" />
                </button>
              </div>
            </div>
          </aside>
          {/* Botón de menú para móviles */}
          <div className="md:hidden fixed top-4 left-4 z-40">
            <button
              onClick={() => setMostrarSidebarMovil(true)}
              aria-label="Abrir menú"
              title="Abrir menú"
              className="p-2 bg-blue-900 text-white rounded-md shadow-md"
            >
              <RiMenuUnfoldLine className="text-2xl" />
            </button>
          </div>
          {/* Contenido principal */}
          <main className="flex-1 pt-10 lg:p-6 overflow-auto bg-gray-50">
            <Outlet />
          </main>
          {/* Modal para el perfil */}
          <ModalPerfil
            isOpen={mostrarModal}
            onRequestClose={() => setMostrarModal(false)}
          />
        </div>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
};
export default LayoutProtegido;