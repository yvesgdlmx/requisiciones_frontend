import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FaSave } from "react-icons/fa";
import Swal from "sweetalert2";

Modal.setAppElement("#root");

const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

const ModalCategoria = ({
  isOpen,
  onClose,
  onSubmit,
  categoria,
  modoEdicion,
}) => {
  const [nombre, setNombre] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [diasPeriodo, setDiasPeriodo] = useState(30);
  const [fechaInicio, setFechaInicio] = useState("");
  // CAMBIO: agregar estado para moneda
  const [moneda, setMoneda] = useState("MXN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (modoEdicion && categoria) {
      setNombre(categoria.nombre || "");
      setCantidad(categoria.cantidad || "");
      setDiasPeriodo(categoria.diasPeriodo || 30);
      // CAMBIO: cargar moneda de la categoría
      setMoneda(categoria.moneda || "MXN");
      
      if (categoria.fechaInicio) {
        const fecha = new Date(categoria.fechaInicio);
        setFechaInicio(fecha.toISOString().split('T')[0]);
      } else {
        setFechaInicio("");
      }
    } else {
      limpiarFormulario();
    }
  }, [categoria, modoEdicion, isOpen]);

  const limpiarFormulario = () => {
    setNombre("");
    setCantidad("");
    setDiasPeriodo(30);
    setFechaInicio("");
    // CAMBIO: resetear moneda a MXN
    setMoneda("MXN");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!nombre.trim()) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "El nombre es obligatorio",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (!cantidad || parseFloat(cantidad) <= 0) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "La cantidad debe ser mayor a 0",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (!diasPeriodo || Number(diasPeriodo) < 1) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Los días deben ser mayor a 0",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    if (!fechaInicio) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "La fecha de inicio es obligatoria",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    // CAMBIO: validar moneda
    if (!moneda) {
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "Debes seleccionar una moneda",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      return;
    }

    setIsLoading(true);

    const datosCategoria = {
      nombre: nombre.trim().toLowerCase(),
      cantidad: parseFloat(cantidad),
      diasPeriodo: Number(diasPeriodo),
      fechaInicio: fechaInicio + ' 00:00:00',
      // CAMBIO: incluir moneda en el payload
      moneda,
    };

    // DEBUG: Ver qué se está enviando
    console.log("=== DEBUG FRONTEND ===");
    console.log("Fecha input (fechaInicio):", fechaInicio);
    console.log("Fecha a enviar:", datosCategoria.fechaInicio);
    console.log("Datos completos:", datosCategoria);
    console.log("=====================");

    try {
      await onSubmit(datosCategoria);
      limpiarFormulario();
    } catch (error) {
      console.error("Error en handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    limpiarFormulario();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel={modoEdicion ? "Editar Categoría" : "Crear Categoría"}
      overlayClassName="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl outline-none overflow-hidden flex flex-col max-h-full mx-4"
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">
              {modoEdicion ? "Actualizando categoría..." : "Creando categoría..."}
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 sm:p-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">
                {modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
              </h2>
              <p className="text-xs sm:text-sm opacity-90">
                {modoEdicion ? "Modifica los datos de la categoría" : "Completa los datos para crear una nueva categoría"}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="bg-white/20 hover:bg-white/30 py-1 px-2.5 rounded-full transition"
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
            {/* Nombre */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Nombre de la Categoría *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Ferretería, Papelería, Etc.."
                required
              />
            </div>

            {/* CAMBIO: Grid de 2 columnas para Cantidad y Moneda */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cantidad */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Cantidad (Presupuesto) *
                </label>
                <input
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              {/* CAMBIO: Selector de Moneda */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Moneda *
                </label>
                <select
                  value={moneda}
                  onChange={(e) => setMoneda(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  required
                >
                  <option value="MXN">MXN (Pesos)</option>
                  <option value="USD">USD (Dólares)</option>
                  <option value="EUR">EUR (Euros)</option>
                </select>
              </div>
            </div>

            {/* Días del Período */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Días del Período *
              </label>
              <input
                type="number"
                value={diasPeriodo}
                onChange={(e) => setDiasPeriodo(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: 7 (1 semana), 30 (1 mes)"
                min="1"
                required
              />
            </div>

            {/* Fecha de Inicio */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <p className="text-xs text-gray-500 italic">
              * Campos obligatorios
            </p>
          </form>

          {/* FOOTER */}
          <div className="px-4 sm:px-6 py-3 bg-gray-50 flex justify-end items-center gap-3">
            <button
              onClick={handleClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 sm:px-5 py-2 rounded-lg font-medium transition text-sm"
              type="button"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-5 py-2 rounded-lg font-medium transition flex items-center gap-2 text-sm"
              type="submit"
            >
              <FaSave />
              {modoEdicion ? "Actualizar" : "Crear Categoría"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalCategoria;