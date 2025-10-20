import React, { useState } from "react";
import ReactModal from "react-modal";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import clienteAxios from "../../config/clienteAxios";
import Swal from "sweetalert2";

const ModalCambiarPassword = ({ isOpen, onRequestClose }) => {
  const [formData, setFormData] = useState({
    passwordActual: "",
    passwordNuevo: "",
    confirmarPassword: ""
  });
  const [mostrarPasswords, setMostrarPasswords] = useState({
    actual: false,
    nuevo: false,
    confirmar: false
  });
  const [cargando, setCargando] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleMostrarPassword = (campo) => {
    setMostrarPasswords({
      ...mostrarPasswords,
      [campo]: !mostrarPasswords[campo]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.passwordNuevo !== formData.confirmarPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas nuevas no coinciden"
      });
      return;
    }

    if (formData.passwordNuevo.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La nueva contraseña debe tener al menos 6 caracteres"
      });
      return;
    }

    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await clienteAxios.put(
        "/usuarios/perfil/password",
        {
          passwordActual: formData.passwordActual,
          passwordNuevo: formData.passwordNuevo
        },
        config
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Contraseña actualizada correctamente",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
      });

      // Limpiar formulario y cerrar modal
      setFormData({
        passwordActual: "",
        passwordNuevo: "",
        confirmarPassword: ""
      });
      onRequestClose();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.msg || "Error al cambiar la contraseña"
      });
    } finally {
      setCargando(false);
    }
  };

  const handleClose = () => {
    setFormData({
      passwordActual: "",
      passwordNuevo: "",
      confirmarPassword: ""
    });
    setMostrarPasswords({
      actual: false,
      nuevo: false,
      confirmar: false
    });
    onRequestClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Cambiar contraseña"
      style={{
        overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        content: {
          maxWidth: "400px",
          width: "90%",
          padding: 0,
          border: "none",
          borderRadius: "16px",
          overflow: "hidden",
          height: "auto",
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          transform: "translate(-50%, -50%)",
        },
      }}
    >
      <div className="bg-white">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-center">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
          >
            &times;
          </button>
          <FaLock className="mx-auto text-white text-4xl mb-2" />
          <h2 className="text-xl font-semibold text-white">Cambiar Contraseña</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Contraseña actual */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <div className="relative">
                <input
                  type={mostrarPasswords.actual ? "text" : "password"}
                  name="passwordActual"
                  value={formData.passwordActual}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleMostrarPassword("actual")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {mostrarPasswords.actual ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPasswords.nuevo ? "text" : "password"}
                  name="passwordNuevo"
                  value={formData.passwordNuevo}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleMostrarPassword("nuevo")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {mostrarPasswords.nuevo ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Confirmar nueva contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={mostrarPasswords.confirmar ? "text" : "password"}
                  name="confirmarPassword"
                  value={formData.confirmarPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => toggleMostrarPassword("confirmar")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {mostrarPasswords.confirmar ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50"
            >
              {cargando ? "Actualizando..." : "Actualizar"}
            </button>
          </div>
        </form>
      </div>
    </ReactModal>
  );
};

export default ModalCambiarPassword;