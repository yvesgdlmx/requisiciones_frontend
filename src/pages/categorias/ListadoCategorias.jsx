import React, { useState } from "react";
import useCategorias from "../../hooks/useCategorias";
import TablaCategorias from "../../components/tablas/TablaCategorias";
import ModalCategoria from "../../components/modales/ModalCategoria";
import Swal from "sweetalert2";

const ListadoCategorias = () => {
  const {
    categoriasFiltradas,
    busqueda,
    setBusqueda,
    modalActivo,
    categoriaSeleccionada,
    modoEdicion,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    abrirModalCrear,
    abrirModalEditar,
    cerrarModal,
    cargando,
  } = useCategorias();

  const [menuAbierto, setMenuAbierto] = useState(null);

  const toggleMenu = (id) => {
    setMenuAbierto(menuAbierto === id ? null : id);
  };

  const cerrarMenu = () => {
    setMenuAbierto(null);
  };

  const handleEliminar = async (id, nombre) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará la categoría "${nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const response = await eliminarCategoria(id);
      if (response.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Categoría eliminada",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const handleSubmit = async (datosCategoria) => {
    if (modoEdicion) {
      const response = await actualizarCategoria(
        categoriaSeleccionada.id,
        datosCategoria
      );
      if (response.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Categoría actualizada",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    } else {
      const response = await crearCategoria(datosCategoria);
      if (response.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Categoría creada",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header centrado al estilo Registrar */}
      <h2 className="text-2xl font-bold mb-2 text-gray-500 text-center">Categorías de Gasto</h2>
      <p className="text-center mb-6 text-gray-500">Visualiza y administra tus categorías de gasto</p>

      {/* Buscador y botón agregar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Buscar categoría..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full md:w-1/5 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded transition-colors shadow"
          onClick={abrirModalCrear}
        >
          <span className="text-lg font-bold">+</span> Nueva categoría
        </button>
      </div>

      {/* Tabla */}
      {cargando ? (
        <div className="text-center py-10">
          <p className="text-gray-600">Cargando categorías...</p>
        </div>
      ) : (
        <TablaCategorias
          categorias={categoriasFiltradas}
          menuAbierto={menuAbierto}
          toggleMenu={toggleMenu}
          cerrarMenu={cerrarMenu}
          onEditar={abrirModalEditar}
          onEliminar={handleEliminar}
        />
      )}

      {/* Modal */}
      <ModalCategoria
        isOpen={modalActivo}
        onClose={cerrarModal}
        onSubmit={handleSubmit}
        categoria={categoriaSeleccionada}
        modoEdicion={modoEdicion}
      />
    </div>
  );
};

export default ListadoCategorias;