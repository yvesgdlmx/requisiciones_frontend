import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
const AutorizacionContext = createContext();
export const AutorizacionProvider = ({ children }) => {
  // Estados principales
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const itemsPorPagina = 10;
  // Estados para manejar el modal de autorización
  const [modalAutorizarActivo, setModalAutorizarActivo] = useState(false);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  // Función de transformación para formatear la requisición (similar a la de otros providers)
  // Se agrega la propiedad fechaOriginal para utilizarla en el formateo en otros componentes.
  const transformarRequisicion = (item) => {
    const fechaObj = new Date(item.fechaHora);
    const primerNombre = item.usuario && item.usuario.nombre 
      ? item.usuario.nombre.split(" ")[0]
      : "";
    const primerApellido = item.usuario && item.usuario.apellido 
      ? item.usuario.apellido.split(" ")[0]
      : "";
    return {
      ...item,
      fecha: fechaObj.toLocaleDateString("es-ES"),
      hora: fechaObj.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      fechaOriginal: fechaObj, // Agregamos fechaOriginal para formateos futuros
      solicitante: (primerNombre || primerApellido)
        ? `${primerNombre} ${primerApellido}`.trim()
        : "",
      monto: item.monto,
      comentarioAutorizador: item.comentarioAutorizador,
      eta: item.eta
    };
  };
  // Función para obtener las requisiciones con status "esperando autorizacion"
  const obtenerRequisicionesAutorizacion = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get("/requisiciones/autorizar", config);
      const { requisiciones } = response.data;
      // Aplicamos la transformación a cada requisición
      const datosTransformados = requisiciones.map((item) => transformarRequisicion(item));
      setDatos(datosTransformados);
    } catch (error) {
      console.error("Error al obtener requisiciones para autorización:", error);
      setError("Error al obtener requisiciones para aprobación");
    }
  };
  useEffect(() => {
    obtenerRequisicionesAutorizacion();
  }, []);
  // Función para abrir el modal de autorización
  const handleRowClick = (requisicion) => {
    setRequisicionSeleccionada(requisicion);
    setModalAutorizarActivo(true);
  };
  // Función para actualizar la requisición luego de la acción en el modal.
  // Si el status sigue siendo "esperando autorizacion" se actualiza el registro,
  // de lo contrario se quita de la lista.
  const actualizarRequisicion = (requisicionActualizada) => {
    const requisicionFormateada = transformarRequisicion(requisicionActualizada);
    setDatos((prevDatos) =>
      requisicionFormateada.status === "esperando autorizacion"
        ? prevDatos.map((req) =>
            req.id === requisicionFormateada.id ? requisicionFormateada : req
          )
        : prevDatos.filter((req) => req.id !== requisicionFormateada.id)
    );
  };
  return (
    <AutorizacionContext.Provider
      value={{
        datos,
        error,
        itemsPorPagina,
        modalAutorizarActivo,
        setModalAutorizarActivo,
        requisicionSeleccionada,
        setRequisicionSeleccionada,
        obtenerRequisicionesAutorizacion,
        handleRowClick,
        actualizarRequisicion,
      }}
    >
      {children}
    </AutorizacionContext.Provider>
  );
};
export default AutorizacionContext;