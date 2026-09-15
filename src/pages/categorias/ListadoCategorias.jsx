import React, { useState } from "react";
import { FiFolder, FiPlus, FiSearch } from "react-icons/fi";
import Swal from "sweetalert2";
import useCategorias from "../../hooks/useCategorias";
import TablaCategorias from "../../components/tablas/TablaCategorias";
import ModalCategoria from "../../components/modales/ModalCategoria";

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
      title: "Estas seguro?",
      text: `Se eliminara la categoria "${nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563EB",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Si, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      const response = await eliminarCategoria(id);
      if (response.success) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Categoria eliminada",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      }
    }
  };

  const handleSubmit = async (datosCategoria) => {
    const response = modoEdicion
      ? await actualizarCategoria(categoriaSeleccionada.id, datosCategoria)
      : await crearCategoria(datosCategoria);

    if (response.success) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: modoEdicion ? "Categoria actualizada" : "Categoria creada",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6 lg:px-8 2xl:max-w-[1600px]">
      <section className="mb-6 overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
        <div className="border-b border-[#E2E8F0] bg-white px-5 py-5 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#DBEAFE]/55 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#1E40AF]">
                <FiFolder className="h-3.5 w-3.5" />
                Finanzas
              </div>
              <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">
                Categorias de gasto
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
                Visualiza y administra los presupuestos por categoria.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#3B82F6]"
              onClick={abrirModalCrear}
            >
              <FiPlus className="h-4 w-4" />
              Nueva categoria
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          <div className="relative max-w-2xl">
            <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#64748B]" />
            <input
              type="text"
              placeholder="Buscar categoria..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full rounded-lg border border-[#E2E8F0] bg-white px-11 py-3 text-sm text-[#0F172A] shadow-sm outline-none transition focus:border-[#2563EB] focus:ring-4 focus:ring-[#DBEAFE]"
            />
          </div>
        </div>

        <div className="border-t border-[#E2E8F0]">
          {cargando ? (
            <div className="bg-white p-10 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#DBEAFE] text-[#2563EB]">
                <FiFolder className="h-5 w-5" />
              </div>
              <p className="font-semibold text-[#334155]">Cargando categorias...</p>
              <p className="mt-1 text-sm text-[#64748B]">Actualizando presupuestos registrados.</p>
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
        </div>
      </section>

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
