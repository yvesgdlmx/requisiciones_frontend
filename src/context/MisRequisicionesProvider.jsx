import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
import Swal from "sweetalert2";
const MisRequisicionesContext = createContext();
export const MisRequisicionesProvider = ({ children }) => {
  // Estados principales
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState(null);
  const [modalNuevoActivo, setModalNuevoActivo] = useState(false);
  const [modalDetalleActivo, setModalDetalleActivo] = useState(false);
  const [modalEditarActivo, setModalEditarActivo] = useState(false);
  const [requisicionSeleccionada, setRequisicionSeleccionada] = useState(null);
  const [requisicionAEditar, setRequisicionAEditar] = useState(null);

  // Estados para búsqueda y filtrado
  const opciones = [
    { value: "folio", label: "Folio" },
    { value: "fecha", label: "Fecha" },
    { value: "solicitante", label: "Solicitante" },,
    { value: "status", label: "Status" },
  ];
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opciones[0]);
  const [busqueda, setBusqueda] = useState("");
  const itemsPorPagina = 10;

  // Detalles para el resumen por status
  const detallesDeStatus = [
    { status: "creada", color: "bg-gray-200", textColor: "text-gray-800" },
    { status: "rechazada", color: "bg-red-400", textColor: "text-red-800" },
    { status: "cotizando", color: "bg-blue-200", textColor: "text-blue-800" },
    { status: "aprobada", color: "bg-green-400", textColor: "text-green-800" },
    {
      status: "esperando autorizacion",
      color: "bg-yellow-200",
      textColor: "text-yellow-800",
    },
    { status: "autorizada", color: "bg-cyan-200", textColor: "text-cyan-800" },
    {
      status: "liberacion aduanal",
      color: "bg-purple-200",
      textColor: "text-purple-800",
    },
    {
      status: "proceso de entrega",
      color: "bg-orange-200",
      textColor: "text-orange-800",
    },
    {
      status: "entregada parcial",
      color: "bg-teal-200",
      textColor: "text-teal-800",
    },
    { status: "concluida", color: "bg-green-200", textColor: "text-green-800" },
    { status: "cancelada", color: "bg-red-200", textColor: "text-red-800" },
  ];

  // Función para obtener las requisiciones y transformar los datos
  const obtenerRequisiciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await clienteAxios.get("/requisiciones/usuario", config);
      const { requisiciones } = response.data;
      const datosTransformados = requisiciones.map((item) => {
        const fechaObj = new Date(item.fechaHora);
        const primerNombre =
          item.usuario && item.usuario.nombre
            ? item.usuario.nombre.split(" ")[0]
            : "";
        const primerApellido =
          item.usuario && item.usuario.apellido
            ? item.usuario.apellido.split(" ")[0]
            : "";
        return {
          id: item.id,
          folio: item.folio,
          fecha: fechaObj.toLocaleDateString("es-ES"),
          hora: fechaObj.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }),
          // Conservamos la fecha original para posibles comparaciones
          fechaOriginal: fechaObj,
          objetivo: item.objetivo,
          // Estos campos se mantienen en caso de que la cabecera tenga información de artículo,
          // aunque en la nueva estructura, los artículos vienen en su propio arreglo.
          cantidad: item.cantidad,
          unidadMedida: item.unidadMedida,
          solicitante:
            primerNombre || primerApellido
              ? `${primerNombre} ${primerApellido}`.trim()
              : "",
          numeroParte: item.numeroParte,
          status: item.status,
          prioridad: item.prioridad,
          descripcion: item.descripcion,
          area: item.area,
          comprador: item.comprador,
          links: item.links,
          archivos: Array.isArray(item.archivos) ? item.archivos : [],
          articulos: Array.isArray(item.articulos) ? item.articulos : [],
          numeroOrdenCompra: item.numeroOrdenCompra,
          proveedor: item.proveedor,
          tipoCompra: item.tipoCompra,
          comentario: item.comentario,
          monto: item.monto,
          comentarioAutorizador: item.comentarioAutorizador,
          eta: item.eta
        };
      });
      setDatos(datosTransformados);
    } catch (error) {
      console.error("Error al obtener las requisiciones del usuario:", error);
      setError("Error al obtener las requisiciones");
    }
  };

  useEffect(() => {
    obtenerRequisiciones();
  }, []);

  // Filtrar datos según la búsqueda y la opción seleccionada
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

  // Funciones para actualizar los estados a partir de eventos
  const handleSelectChange = (opcion) => setOpcionSeleccionada(opcion);
  const handleInputChange = (e) => setBusqueda(e.target.value);
  const handleRowClick = (requisicion) => {
    setRequisicionSeleccionada(requisicion);
    setModalDetalleActivo(true);
  };
  
  const handleEliminarRequisicion = async (item) => {
    const resultado = await Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la requisición, ¿deseas continuar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });
    if (resultado.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await clienteAxios.delete(`/requisiciones/${item.id}`, config);
        await Swal.fire({
          title: "Eliminada!",
          text: "La requisición ha sido eliminada.",
          icon: "success",
          timer: 2000,
        });
        obtenerRequisiciones();
      } catch (error) {
        console.error("Error al eliminar la requisición:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo eliminar la requisición.",
          icon: "error",
        });
      }
    }
  };

  return (
    <MisRequisicionesContext.Provider
      value={{
        // Estados y setters
        datos,
        setDatos,
        error,
        setError,
        modalNuevoActivo,
        setModalNuevoActivo,
        modalDetalleActivo,
        setModalDetalleActivo,
        modalEditarActivo,
        setModalEditarActivo,
        requisicionSeleccionada,
        setRequisicionSeleccionada,
        requisicionAEditar,
        setRequisicionAEditar,
        // Parámetros de búsqueda y filtrado
        opciones,
        opcionSeleccionada,
        setOpcionSeleccionada,
        busqueda,
        setBusqueda,
        handleSelectChange,
        handleInputChange,
        // Datos derivados
        datosFiltrados,
        itemsPorPagina,
        agrupacionStatus,
        detallesDeStatus,
        // Funciones de manejo
        obtenerRequisiciones,
        handleRowClick,
        handleEliminarRequisicion,
      }}
    >
      {children}
    </MisRequisicionesContext.Provider>
  );
};
export default MisRequisicionesContext;