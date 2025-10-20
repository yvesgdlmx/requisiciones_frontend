import React, { useState, useRef } from "react";
import ReactModal from "react-modal";
import { FaCamera, FaUserCircle, FaKey } from "react-icons/fa";
import clienteAxios from "../../config/clienteAxios";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import ModalCambiarPassword from "./ModalCambiarPassword";

const baseUrl = import.meta.env.VITE_BACKEND_URL || "";
ReactModal.setAppElement("#root");

const ModalPerfil = ({ isOpen, onRequestClose }) => {
  const { auth, setAuth, cerrarSesionAuth, cargando } = useAuth();
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);
  const [modalPasswordAbierto, setModalPasswordAbierto] = useState(false);
  const fileInputRef = useRef(null);

  if (cargando) {
    return <p>Cargando...</p>;
  }
  if (!auth || Object.keys(auth).length === 0) {
    return null;
  }

  // Soporta string (antiguo) u objeto (nuevo) para imagenPerfil
  const imagenURL = auth.imagenPerfil
    ? (typeof auth.imagenPerfil === "string"
        ? `${baseUrl}/${auth.imagenPerfil.replace(/\\/g, "/")}`
        : auth.imagenPerfil.url)
    : null;

  const handleCameraClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImagenSeleccionada(e.target.files[0]);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (archivo) => {
    const formData = new FormData();
    formData.append("imagenPerfil", archivo);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const respuesta = await clienteAxios.put(
        "/usuarios/perfil/imagen",
        formData,
        config
      );
      setAuth({ ...auth, imagenPerfil: respuesta.data.imagenPerfil });
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Imagen de perfil actualizada correctamente",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    } catch (error) {
      console.error("Error actualizando la imagen de perfil:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "Error actualizando imagen. Inténtalo nuevamente.",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    }
  };

  return (
    <>
      <ReactModal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Perfil de usuario"
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            maxWidth: "350px",
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
        <div className="relative">
          <button
            onClick={onRequestClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold"
          >
            &times;
          </button>
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 flex flex-col items-center">
            <div className="relative">
              {imagenURL ? (
                <img
                  src={imagenURL}
                  alt="Perfil"
                  className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <FaUserCircle className="w-24 h-24 text-white" />
              )}
              <button
                onClick={handleCameraClick}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow hover:bg-gray-200"
                title="Cambiar imagen de perfil"
              >
                <FaCamera className="text-gray-600" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png"
              className="hidden"
            />
          </div>
          <div className="bg-white p-4 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {auth.nombre} {auth.apellido}
            </h2>
            <p className="text-sm text-gray-500">{auth.area}</p>
            <p className="mt-1 text-xs text-gray-400">{auth.email}</p>
            <div className="flex justify-center items-center gap-3 mt-3">
              <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                {auth.rol}
              </span>
            </div>
            <button
              onClick={() => setModalPasswordAbierto(true)}
              className="mt-3 w-full px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition flex items-center justify-center gap-2"
            >
              <FaKey />
              Cambiar Contraseña
            </button>
            <button
              onClick={cerrarSesionAuth}
              className="mt-3 w-full px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </ReactModal>

      <ModalCambiarPassword
        isOpen={modalPasswordAbierto}
        onRequestClose={() => setModalPasswordAbierto(false)}
      />
    </>
  );
};
export default ModalPerfil;