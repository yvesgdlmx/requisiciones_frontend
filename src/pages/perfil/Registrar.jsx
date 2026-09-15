import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight, FiPlus, FiSearch, FiUsers } from "react-icons/fi";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import clienteAxios from "../../config/clienteAxios";
import ModalAgregarUsuario from "../../components/modales/ModalAgregarUsuario";
import TablaUsuarios from "../../components/tablas/TablaUsuarios";
import TablaUsuariosMobile from "../../components/tablas/TablaUsuariosMobile";

const USUARIOS_POR_PAGINA = 10;
const ID_USUARIO_ELIMINADO = 9999;

const Registrar = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [modoModal, setModoModal] = useState("agregar");

  const obtenerUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get("/usuarios/usuarios", config);
      setUsuarios(response.data);
      setError(null);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setError("Error al obtener usuarios");
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const usuariosFiltrados = usuarios
    .filter((usuario) => usuario.id !== ID_USUARIO_ELIMINADO)
    .filter((usuario) => {
      const texto = `${usuario.nombre} ${usuario.apellido} ${usuario.email} ${usuario.area} ${usuario.rol}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * USUARIOS_POR_PAGINA,
    paginaActual * USUARIOS_POR_PAGINA
  );

  const indiceInicio = (paginaActual - 1) * USUARIOS_POR_PAGINA;
  const indiceFin = Math.min(indiceInicio + usuariosPagina.length, usuariosFiltrados.length);
  const paginasVisibles = Array.from({ length: totalPaginas }, (_, index) => index + 1)
    .filter((pagina) => Math.abs(pagina - paginaActual) <= 2);

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const cerrarMenu = () => setMenuAbierto(null);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
      setMenuAbierto(null);
    }
  };

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda]);

  const handleAgregarUsuario = async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await clienteAxios.post("/usuarios/registro", nuevoUsuario, config);
      await obtenerUsuarios();
      setError(null);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Usuario creado correctamente",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      setError("Error al agregar usuario");
    }
  };

  const handleEditarUsuario = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get(`/usuarios/usuarios/${id}`, config);
      setUsuarioEditar(response.data);
      setModoModal("editar");
      setModalOpen(true);
    } catch (error) {
      setError("Error al obtener usuario para editar");
    }
  };

  const handleActualizarUsuario = async (usuarioActualizado) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await clienteAxios.put(`/usuarios/usuarios/${usuarioEditar.id}`, usuarioActualizado, config);
      await obtenerUsuarios();
      setError(null);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Usuario actualizado correctamente",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      setError("Error al actualizar usuario");
    }

    setUsuarioEditar(null);
    setModoModal("agregar");
  };

  const handleEliminarUsuario = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const confirm = await Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2563EB",
        cancelButtonColor: "#EF4444",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
      });

      if (confirm.isConfirmed) {
        await clienteAxios.delete(`/usuarios/usuarios/${id}`, config);
        await obtenerUsuarios();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Usuario eliminado correctamente",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      setError("Error al eliminar usuario");
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiUsers className="h-3.5 w-3.5" />
                Administración
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Cuentas de usuarios
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Visualiza y administra la información de tus usuarios.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B82F6]"
              onClick={() => {
                setModoModal("agregar");
                setUsuarioEditar(null);
                setModalOpen(true);
              }}
            >
              <FiPlus className="h-4 w-4" />
              Agregar usuario
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="relative max-w-2xl">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Buscar por nombre, email, área o rol..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-11 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
            />
          </div>
        </div>

        {error && (
          <div className="mx-6 mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 sm:mx-7">
            {error}
          </div>
        )}

        <div className="border-t border-[#E2E8F0]">
          <div className="hidden md:block">
            <TablaUsuarios
              usuarios={usuariosPagina}
              totalUsuarios={usuariosFiltrados.length}
              menuAbierto={menuAbierto}
              toggleMenu={toggleMenu}
              cerrarMenu={cerrarMenu}
              onEditar={handleEditarUsuario}
              onEliminar={handleEliminarUsuario}
            />

            {totalPaginas > 1 && (
              <div className="flex flex-col gap-3 border-t border-[#E2E8F0] px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-[#64748B]">
                  Mostrando <span className="font-semibold text-[#334155]">{indiceInicio + 1}</span>{" "}
                  a <span className="font-semibold text-[#334155]">{indiceFin}</span>{" "}
                  de <span className="font-semibold text-[#334155]">{usuariosFiltrados.length}</span>{" "}
                  usuarios
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => cambiarPagina(paginaActual - 1)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={paginaActual === 1}
                  >
                    <FiArrowLeft className="h-4 w-4" />
                    Anterior
                  </button>

                  <div className="hidden items-center gap-1 sm:flex">
                    {paginasVisibles.map((pagina) => (
                      <button
                        key={pagina}
                        type="button"
                        onClick={() => cambiarPagina(pagina)}
                        className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-semibold transition ${
                          paginaActual === pagina
                            ? "border-[#2563EB] bg-[#2563EB] text-white"
                            : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF]"
                        }`}
                      >
                        {pagina}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => cambiarPagina(paginaActual + 1)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 text-sm font-semibold text-[#64748B] transition hover:border-[#DBEAFE] hover:bg-[#DBEAFE]/45 hover:text-[#1E40AF] disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={paginaActual === totalPaginas}
                  >
                    Siguiente
                    <FiArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="block bg-[#F8FAFC] p-4 md:hidden">
            <TablaUsuariosMobile
              usuarios={usuariosFiltrados}
              itemsPorPagina={USUARIOS_POR_PAGINA}
              menuAbierto={menuAbierto}
              toggleMenu={toggleMenu}
              cerrarMenu={cerrarMenu}
              onEditar={handleEditarUsuario}
              onEliminar={handleEliminarUsuario}
            />
          </div>
        </div>
      </section>

      <ModalAgregarUsuario
        isOpen={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          setUsuarioEditar(null);
          setModoModal("agregar");
        }}
        onSubmit={modoModal === "agregar" ? handleAgregarUsuario : handleActualizarUsuario}
        usuarioInicial={usuarioEditar}
        modo={modoModal}
      />
    </div>
  );
};

export default Registrar;
