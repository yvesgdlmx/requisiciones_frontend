import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
const TodasRequisicionesContext = createContext();
export const TodasRequisicionesProvider = ({ children }) => {
  // Estados principales
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  // Opciones para la búsqueda
  const opciones = [
    { value: "folio", label: "Folio" },
    { value: "fecha", label: "Fecha" },
    { value: "solicitante", label: "Solicitante" },
    { value: "status", label: "Status" },
  ];
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opciones[0]);
  const [busqueda, setBusqueda] = useState("");
  const itemsPorPagina = 10;
  // Estados para el modal de detalle
  const [modalDetalleActivo, setModalDetalleActivo] = useState(false);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  // Función para transformar la requisición y generar campos derivados
  const transformarRequisicion = (item) => {
    const fechaObj = new Date(item.fechaHora);
    const fechaCambioStatusObj = item.fechaCambioStatus ? new Date(item.fechaCambioStatus) : fechaObj;
    let solicitante = "";
    if (item.usuario) {
      const primerNombre = item.usuario.nombre ? item.usuario.nombre.split(" ")[0] : "";
      const primerApellido = item.usuario.apellido ? item.usuario.apellido.split(" ")[0] : "";
      solicitante = `${primerNombre} ${primerApellido}`.trim();
    }
    return {
      ...item,
      fecha: fechaObj.toLocaleDateString("es-ES"),
      hora: fechaObj.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      fechaOriginal: fechaObj,
      fechaCambioStatus: fechaCambioStatusObj,
      solicitante,
      archivos: Array.isArray(item.archivos) ? item.archivos : [],
      articulos: Array.isArray(item.articulos) ? item.articulos : []
    };
  };
  // Función para obtener las requisiciones
  const obtenerRequisiciones = async () => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await clienteAxios.get("/requisiciones", config);
    const { requisiciones } = response.data;

    // Marcar como abierto en frontend si el status ya no es "creada"
    const requisicionesActualizadas = requisiciones.map((item) => {
      if (item.status !== "creada" && !item.abierto) {
        return { ...item, abierto: true };
      }
      return item;
    });

    const datosTransformados = requisicionesActualizadas.map((item) =>
      transformarRequisicion(item)
    );
    setDatos(datosTransformados);
  } catch (error) {
    console.error("Error al obtener requisiciones:", error);
    setError("Error al obtener requisiciones");
  }
};
  useEffect(() => {
    obtenerRequisiciones();
  }, []);
  // Manejo de búsqueda y filtrado
  const handleSelectChange = (opcion) => setOpcionSeleccionada(opcion);
  const handleInputChange = (e) => setBusqueda(e.target.value);
  const datosFiltrados = datos.filter((item) =>
    item[opcionSeleccionada.value]
      .toString()
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );
  // Agrupar por status para el resumen
  const agrupacionStatus = datosFiltrados.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});
  // Detalles de status para mostrar en el resumen
  const detallesDeStatus = [
    { status: "creada", color: "bg-gray-200", textColor: "text-gray-800" },
    { status: "rechazada", color: "bg-red-400", textColor: "text-red-800" },
    { status: "cotizando", color: "bg-blue-200", textColor: "text-blue-800" },
    { status: "aprobada", color: "bg-green-400", textColor: "text-green-800" },
    { status: "esperando autorizacion", color: "bg-yellow-200", textColor: "text-yellow-800" },
    { status: "autorizada", color: "bg-cyan-200", textColor: "text-cyan-800" },
    { status: "liberacion aduanal", color: "bg-purple-200", textColor: "text-purple-800" },
    { status: "proceso de entrega", color: "bg-orange-200", textColor: "text-orange-800" },
    { status: "entregada parcial", color: "bg-teal-200", textColor: "text-teal-800" },
    { status: "concluida", color: "bg-green-200", textColor: "text-green-800" },
    { status: "cancelada", color: "bg-red-200", textColor: "text-red-800" },
  ];
  // Función para abrir el modal de detalle y actualizar el campo "abierto" si es necesario
 const handleRowClick = async (requisicion) => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    // 1. Obtener la requisición actualizada desde el backend
    const response = await clienteAxios.get(`/requisiciones/${requisicion.id}`, config);
    const requisicionActualizada = transformarRequisicion(response.data.requisicion);

    // 2. Si no está abierta, marcarla como vista
    if (!requisicionActualizada.abierto) {
      const putResponse = await clienteAxios.put(
        `/requisiciones/${requisicion.id}/abrir`,
        null,
        config
      );
      requisicionActualizada.abierto = true;
      actualizarRequisicion(putResponse.data.requisicion);
    }

    setRequisicionSeleccionada(requisicionActualizada);
    setModalDetalleActivo(true);
  } catch (error) {
    console.error("Error al obtener la requisición:", error);
    setError("Error al obtener la requisición");
  }
};
  // Función para actualizar una requisición en el estado (después de un PUT, por ejemplo)
  const actualizarRequisicion = (requisicionActualizada) => {
    const requisicionFormateada = transformarRequisicion(requisicionActualizada);
    setDatos((prevDatos) =>
      prevDatos.map((req) =>
        req.id === requisicionFormateada.id ? requisicionFormateada : req
      )
    );
  };
  return (
    <TodasRequisicionesContext.Provider
      value={{
        datos,
        setDatos,
        error,
        setError,
        opcionSeleccionada,
        opciones,
        busqueda,
        itemsPorPagina,
        modalDetalleActivo,
        setModalDetalleActivo,
        requisicionSeleccionada,
        setRequisicionSeleccionada,
        handleSelectChange,
        handleInputChange,
        datosFiltrados,
        agrupacionStatus,
        detallesDeStatus,
        obtenerRequisiciones,
        handleRowClick,
        transformarRequisicion,
        actualizarRequisicion,
      }}
    >
      {children}
    </TodasRequisicionesContext.Provider>
  );
};
export default TodasRequisicionesContext;