import React, { createContext, useState, useRef } from "react";
import clienteAxios from "../config/clienteAxios";
import Swal from "sweetalert2";
const CrearRequisicionContext = createContext();
export const CrearRequisicionProvider = ({ children }) => {
  // Estado inicial: solo datos de cabecera; los datos del artículo se gestionan en un array.
  const initialFormState = {
    objetivo: "",
    prioridad: "moderado",
    archivos: [],
    articulos: [],
    links: [],
  };
  const [formData, setFormData] = useState(initialFormState);
  const fileInputRef = useRef(null);
  // Manejar cambios en los inputs de la cabecera.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  // Funciones para manejar la subida de archivos.
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      archivos: [...prev.archivos, ...files],
    }));
    e.target.value = "";
  };
  const removerArchivo = (index) => {
    setFormData((prev) => ({
      ...prev,
      archivos: prev.archivos.filter((_, i) => i !== index),
    }));
  };
  // Funciones para los artículos.
  const handleAddArticulo = () => {
    setFormData((prev) => ({
      ...prev,
      articulos: [
        ...prev.articulos,
        { cantidad: "", unidadMedida: "", numeroParte: "", descripcion: "" },
      ],
    }));
  };
  const handleChangeArticulo = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedArticulos = prev.articulos.map((articulo, idx) =>
        idx === index ? { ...articulo, [name]: value } : articulo
      );
      return { ...prev, articulos: updatedArticulos };
    });
  };
  const handleRemoveArticulo = (index) => {
    setFormData((prev) => ({
      ...prev,
      articulos: prev.articulos.filter((_, idx) => idx !== index),
    }));
  };

  const handleAddLink = () => {
    setFormData((prev) => ({
      ...prev,
      links: [...prev.links, ""],
    }));
  };

  const handleChangeLink = (index, value) => {
    setFormData((prev) => {
      const updatedLinks = prev.links.map((link, idx) =>
        idx === index ? value : link
      );
      return { ...prev, links: updatedLinks };
    });
  };

  const handleRemoveLink = (index) => {
    setFormData((prev) => ({
      ...prev,
      links: prev.links.filter((_, idx) => idx !== index),
    }));
  };

  // Función para el envío del formulario.
  // Se utiliza onClose y resetModal para controlar el modal.
  const handleSubmit = async (e, onClose, resetModal) => {
    e.preventDefault();
    // Confirmar con el usuario
    const confirmacion = await Swal.fire({
      title: "Advertencia",
      text: "Tienes una hora para eliminar o editar esta requisición. ¿Deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, guardar",
      cancelButtonText: "Cancelar",
    });
    if (!confirmacion.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      const data = new FormData();
      // Datos de la cabecera
      data.append("objetivo", formData.objetivo);
      data.append("prioridad", formData.prioridad);
      // Convertir el array de artículos a JSON (que luego el backend decodificará)
      data.append("articulos", JSON.stringify(formData.articulos));
      data.append("links", JSON.stringify(formData.links));

      // Archivos
      formData.archivos.forEach((file) => {
        data.append("archivo", file);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await clienteAxios.post("/requisiciones", data, config);
      console.log("Requisición creada con éxito:", response.data);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "¡Requisición creada correctamente!",
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
      // Reiniciar el formulario y cerrar el modal.
      setFormData(initialFormState);
      if (onClose) onClose();
      if (resetModal) resetModal();
    } catch (error) {
      console.error("Error al crear la requisición:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No se pudo crear la requisición. Inténtalo nuevamente.",
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
    <CrearRequisicionContext.Provider
      value={{
        formData,
        setFormData,
        initialFormState,
        fileInputRef,
        handleChange,
        handleFileChange,
        removerArchivo,
        handleSubmit,
        handleAddArticulo,
        handleChangeArticulo,
        handleRemoveArticulo,
        handleAddLink,
        handleChangeLink,
        handleRemoveLink
      }}
    >
      {children}
    </CrearRequisicionContext.Provider>
  );
};
export default CrearRequisicionContext;
