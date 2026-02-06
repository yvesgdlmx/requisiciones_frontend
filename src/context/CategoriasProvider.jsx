import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";

const CategoriasContext = createContext();

export const CategoriasProvider = ({ children }) => {
  // Estados principales
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Estados para búsqueda
  const [busqueda, setBusqueda] = useState("");
  
  // Estados para modal de crear/editar
  const [modalActivo, setModalActivo] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  // Función para obtener todas las categorías
  const obtenerCategorias = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get("/categorias", config);
      setCategorias(response.data.categorias);
      setError(null);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
      setError(error.response?.data?.msg || "Error al obtener categorías");
    } finally {
      setCargando(false);
    }
  };

  // Función para crear una nueva categoría
  const crearCategoria = async (datosCategoria) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.post("/categorias", datosCategoria, config);
      
      // Agregar la nueva categoría al estado
      setCategorias([response.data.categoria, ...categorias]);
      setError(null);
      setModalActivo(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error al crear categoría:", error);
      const mensaje = error.response?.data?.msg || "Error al crear la categoría";
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setCargando(false);
    }
  };

  // Función para actualizar una categoría
  const actualizarCategoria = async (id, datosCategoria) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.put(`/categorias/${id}`, datosCategoria, config);
      
      // Actualizar la categoría en el estado
      setCategorias(
        categorias.map((cat) =>
          cat.id === id ? response.data.categoria : cat
        )
      );
      setError(null);
      setModalActivo(false);
      setCategoriaSeleccionada(null);
      setModoEdicion(false);
      return { success: true, data: response.data };
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
      const mensaje = error.response?.data?.msg || "Error al actualizar la categoría";
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setCargando(false);
    }
  };

  // Función para eliminar una categoría
  const eliminarCategoria = async (id) => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await clienteAxios.delete(`/categorias/${id}`, config);
      
      // Eliminar la categoría del estado
      setCategorias(categorias.filter((cat) => cat.id !== id));
      setError(null);
      return { success: true };
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
      const mensaje = error.response?.data?.msg || "Error al eliminar la categoría";
      setError(mensaje);
      return { success: false, error: mensaje };
    } finally {
      setCargando(false);
    }
  };

  // Función para abrir modal de crear
  const abrirModalCrear = () => {
    setCategoriaSeleccionada(null);
    setModoEdicion(false);
    setModalActivo(true);
  };

  // Función para abrir modal de editar
  const abrirModalEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setModoEdicion(true);
    setModalActivo(true);
  };

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalActivo(false);
    setCategoriaSeleccionada(null);
    setModoEdicion(false);
    setError(null);
  };

  // Filtrado de categorías
  const categoriasFiltradas = categorias.filter((cat) =>
    cat.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    obtenerCategorias();
  }, []);

  return (
    <CategoriasContext.Provider
      value={{
        categorias,
        categoriasFiltradas,
        error,
        setError,
        cargando,
        busqueda,
        setBusqueda,
        modalActivo,
        setModalActivo,
        categoriaSeleccionada,
        modoEdicion,
        obtenerCategorias,
        crearCategoria,
        actualizarCategoria,
        eliminarCategoria,
        abrirModalCrear,
        abrirModalEditar,
        cerrarModal,
      }}
    >
      {children}
    </CategoriasContext.Provider>
  );
};

export default CategoriasContext;