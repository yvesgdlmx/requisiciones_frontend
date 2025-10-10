import React, { useEffect, useState } from 'react';
import clienteAxios from '../../config/clienteAxios';
import TablaUsuarios from '../../components/tablas/TablaUsuarios';
import TablaUsuariosMobile from '../../components/tablas/TablaUsuariosMobile';
import ModalAgregarUsuario from '../../components/modales/ModalAgregarUsuario';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const USUARIOS_POR_PAGINA = 10;
// Cambia este valor por el id real de tu usuario especial si es diferente
const ID_USUARIO_ELIMINADO = 9999;

const Registrar = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [menuAbierto, setMenuAbierto] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [modoModal, setModoModal] = useState("agregar");

  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await clienteAxios.get('/usuarios/usuarios', config);
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        setError('Error al obtener usuarios');
      }
    };
    obtenerUsuarios();
  }, []);

  // Filtrar por todas las columnas relevantes y quitar usuario especial
  const usuariosFiltrados = usuarios
    .filter(usuario => usuario.id !== ID_USUARIO_ELIMINADO)
    .filter(usuario => {
      const texto = `${usuario.nombre} ${usuario.apellido} ${usuario.email} ${usuario.area} ${usuario.rol}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });

  // Paginación
  const totalPaginas = Math.ceil(usuariosFiltrados.length / USUARIOS_POR_PAGINA);
  const usuariosPagina = usuariosFiltrados.slice(
    (paginaActual - 1) * USUARIOS_POR_PAGINA,
    paginaActual * USUARIOS_POR_PAGINA
  );

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
    setPaginaActual(1); // Reinicia a la página 1 si cambia la búsqueda
  }, [busqueda]);

  // Cálculo de los índices para mostrar el rango de registros
  const indiceInicio = (paginaActual - 1) * USUARIOS_POR_PAGINA;
  const indiceFin = Math.min(indiceInicio + usuariosPagina.length, usuariosFiltrados.length);

  // Función para agregar usuario
  const handleAgregarUsuario = async (nuevoUsuario) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await clienteAxios.post('/usuarios/registro', nuevoUsuario, config);
      const response = await clienteAxios.get('/usuarios/usuarios', config);
      setUsuarios(response.data);
      setError(null);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuario creado correctamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      setError('Error al agregar usuario');
    }
  };

  // Nueva función para abrir modal en modo edición
  const handleEditarUsuario = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get(`/usuarios/usuarios/${id}`, config);
      setUsuarioEditar(response.data);
      setModoModal("editar");
      setModalOpen(true);
    } catch (error) {
      setError('Error al obtener usuario para editar');
    }
  };

  // Función para actualizar usuario
  const handleActualizarUsuario = async (usuarioActualizado) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await clienteAxios.put(`/usuarios/usuarios/${usuarioEditar.id}`, usuarioActualizado, config);
      const response = await clienteAxios.get('/usuarios/usuarios', config);
      setUsuarios(response.data);
      setError(null);
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'Usuario actualizado correctamente',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
    } catch (error) {
      setError('Error al actualizar usuario');
    }
    setUsuarioEditar(null);
    setModoModal("agregar");
  };

  const handleEliminarUsuario = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const confirm = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });
      if (confirm.isConfirmed) {
        await clienteAxios.delete(`/usuarios/usuarios/${id}`, config);
        const response = await clienteAxios.get('/usuarios/usuarios', config);
        setUsuarios(response.data);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Usuario eliminado correctamente',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      setError('Error al eliminar usuario');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2 text-gray-500 text-center">Lista de Usuarios</h2>
      <p className="text-center mb-6 text-gray-500">
        Visualiza y administra la información de tus usuarios
      </p>
      {/* Buscador y botón agregar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Buscar usuario..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition-colors shadow"
          onClick={() => setModalOpen(true)}
        >
          <span className="text-lg font-bold">+</span> Agregar usuario
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600 bg-red-100 p-2 rounded">{error}</div>
      )}
      {/* Tabla para escritorio */}
      <div className="hidden md:block">
        <TablaUsuarios
          usuarios={usuariosPagina}
          menuAbierto={menuAbierto}
          toggleMenu={toggleMenu}
          cerrarMenu={cerrarMenu}
          onEditar={handleEditarUsuario}
          onEliminar={handleEliminarUsuario}
        />
        {/* Paginador por fuera de la tabla */}
        {totalPaginas > 1 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-700">
              {indiceInicio + 1} - {indiceFin} de {usuariosFiltrados.length} registros
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => cambiarPagina(paginaActual - 1)}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                disabled={paginaActual === 1}
              >
                Anterior
              </button>
              {Array.from({ length: totalPaginas }, (_, index) => (
                <button
                  key={index}
                  onClick={() => cambiarPagina(index + 1)}
                  className={`px-3 py-1 rounded border border-gray-300 ${
                    paginaActual === index + 1 ? "bg-blue-500 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => cambiarPagina(paginaActual + 1)}
                className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                disabled={paginaActual === totalPaginas}
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Cards para móvil */}
      <div className="block md:hidden">
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
      {/* Modal para agregar usuario */}
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