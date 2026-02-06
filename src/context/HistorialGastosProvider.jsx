import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";

const HistorialGastosContext = createContext();

export const HistorialGastosProvider = ({ children }) => {
  // Estados principales
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  // Estados para búsqueda
  const [busqueda, setBusqueda] = useState("");

  // Función para obtener todo el historial
  const obtenerHistorial = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get("/historial-gastos", config);
      setHistorial(response.data.historial);
      setError(null);
    } catch (error) {
      console.error("Error al obtener historial:", error);
      setError(error.response?.data?.msg || "Error al obtener historial de gastos");
    } finally {
      setCargando(false);
    }
  };

  // Filtrado de historial
  const historialFiltrado = historial.filter((item) =>
    item.categoriaNombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    item.usuarioComprador?.toLowerCase().includes(busqueda.toLowerCase())
  );

  useEffect(() => {
    obtenerHistorial();
  }, []);

  return (
    <HistorialGastosContext.Provider
      value={{
        historial,
        historialFiltrado,
        error,
        setError,
        cargando,
        busqueda,
        setBusqueda,
        obtenerHistorial,
      }}
    >
      {children}
    </HistorialGastosContext.Provider>
  );
};

export default HistorialGastosContext;