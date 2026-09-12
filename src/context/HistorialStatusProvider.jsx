import React, { createContext, useEffect, useState } from "react";
import clienteAxios from "../config/clienteAxios";

const HistorialStatusContext = createContext();

export const HistorialStatusProvider = ({ children }) => {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const obtenerHistorialStatus = async () => {
    try {
      setCargando(true);

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.get("/historial-status", config);

      setHistorial(data.historial || []);
      setError(null);
    } catch (error) {
      console.log("Error al obtener historial de status: ", error);
      setError(
        error.response?.data?.msg || "Error al obtener historial de movimientos"
      );
    } finally {
      setCargando(false);
    }
  };

  const historialFiltrado = historial.filter((item) => {
    const texto = busqueda.toLowerCase();

    const folio = item.requisicion?.folio || "";
    const objetivo = item.requisicion?.objetivo || "";
    const statusAnterior = item.statusAnterior || "";
    const statusNuevo = item.statusNuevo || "";
    const usuarioNombre = item.usuarioNombre || "";
    const usuarioRol = item.usuarioRol || "";

    return (
      folio.toLowerCase().includes(texto) ||
      objetivo.toLowerCase().includes(texto) ||
      statusAnterior.toLowerCase().includes(texto) ||
      statusNuevo.toLowerCase().includes(texto) ||
      usuarioNombre.toLowerCase().includes(texto) ||
      usuarioRol.toLowerCase().includes(texto)
    );
  });

  useEffect(() => {
    obtenerHistorialStatus();
  }, []);

  return (
    <HistorialStatusContext.Provider
      value={{
        historial,
        historialFiltrado,
        busqueda,
        setBusqueda,
        cargando,
        error,
        obtenerHistorialStatus,
      }}
    >
      {children}
    </HistorialStatusContext.Provider>
  );
};

export default HistorialStatusContext;
