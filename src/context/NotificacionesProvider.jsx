import React, { createContext, useState, useEffect } from "react";
import clienteAxios from "../config/clienteAxios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  FiBell,
  FiFileText,
  FiCheckCircle,
  FiMessageSquare,
  FiShoppingCart
} from "react-icons/fi";

const NotificacionesContext = createContext();

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [notificacionesFiltradas, setNotificacionesFiltradas] = useState([]);
  const [totalNoLeidas, setTotalNoLeidas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const { auth } = useAuth();
  const navigate = useNavigate();

  const obtenerNotificaciones = async () => {
    try {
      setCargando(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setCargando(false);
        return;
      }

      const { data } = await clienteAxios.get("/notificaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setNotificaciones(data.notificaciones || []);
      setNotificacionesFiltradas(data.notificaciones || []);
      setTotalNoLeidas(Number(data.totalNoLeidas) || 0);
      setError("");
    } catch (err) {
      console.error("Error:", err);
      setError("Error al cargar notificaciones");
      setTotalNoLeidas(0);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (!auth?.id) return;
    obtenerNotificaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.id]);

  useEffect(() => {
    const filtradas = notificaciones.filter((n) =>
      (n.mensaje || "").toLowerCase().includes(busqueda.toLowerCase()) ||
      (n.requisicion?.folio || "").toLowerCase().includes(busqueda.toLowerCase())
    );
    setNotificacionesFiltradas(filtradas);
  }, [busqueda, notificaciones]);

  const handleVerRequisicion = (requisicionId) => {
    if (auth.rol === "admin" || auth.rol === "superadmin") {
      navigate("/requisiciones/todas-requisiciones", {
        state: { abrirRequisicionId: requisicionId },
      });
    } else {
      navigate("/requisiciones", {
        state: { abrirRequisicionId: requisicionId },
      });
    }
  };

  const marcarYIr = async (notificacion) => {
    const { id: notificacionId, requisicionId, tipo } = notificacion;
    try {
      const token = localStorage.getItem("token");
      await clienteAxios.put(
        `/notificaciones/${notificacionId}/marcar-leida`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotificaciones((prev) =>
        prev.map((n) => (n.id === notificacionId ? { ...n, leida: true } : n))
      );
      setNotificacionesFiltradas((prev) =>
        prev.map((n) => (n.id === notificacionId ? { ...n, leida: true } : n))
      );
      setTotalNoLeidas((t) => Math.max(0, t - 1));

      if (auth?.rol === "superadmin" && tipo === "esperando_autorizacion") {
        navigate("/requisiciones/en-autorizacion", {
          state: { abrirRequisicionId: requisicionId },
        });
        return;
      }

      handleVerRequisicion(requisicionId);
    } catch (err) {
      console.error("Error marcando notificación leída:", err);
      handleVerRequisicion(requisicionId);
    }
  };

  const handleEliminarNotificacion = async (id) => {
    const result = await Swal.fire({
      title: "¿Deseas eliminar esta notificación?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true,
      focusCancel: true,
    });

    if (!result.isConfirmed) return;

    const notificacion = notificaciones.find((n) => n.id === id);
    const eraNoLeida = notificacion && !notificacion.leida;

    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
    setNotificacionesFiltradas((prev) => prev.filter((n) => n.id !== id));
    if (eraNoLeida) setTotalNoLeidas((t) => Math.max(0, t - 1));

    setDeletingId(id);
    try {
      const token = localStorage.getItem("token");
      await clienteAxios.delete(`/notificaciones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Swal.fire("Eliminada", "La notificación fue eliminada.", "success");
    } catch (err) {
      console.error("Error eliminando notificación:", err);
      await obtenerNotificaciones();
      await Swal.fire("Error", "No se pudo eliminar la notificación.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const obtenerIcono = (tipo) => {
    switch (tipo) {
      case "requisicion_creada":
        return <FiFileText className="w-6 h-6 text-blue-500" />;
      case "cambio_status":
        return <FiCheckCircle className="w-6 h-6 text-green-500" />;
      case "comentario_agregado":
      case "comentario_autorizador":
        return <FiMessageSquare className="w-6 h-6 text-yellow-500" />;
      case "orden_compra_asignada":
        return <FiShoppingCart className="w-6 h-6 text-purple-500" />;
      default:
        return <FiBell className="w-6 h-6 text-gray-400" />;
    }
  };

  const obtenerColorStatus = (status) => {
    switch ((status || "").toLowerCase()) {
      case "creada":
        return "bg-blue-100 text-blue-800";
      case "esperando autorizacion":
        return "bg-yellow-100 text-yellow-800";
      case "autorizada":
        return "bg-green-100 text-green-800";
      case "rechazada":
        return "bg-red-100 text-red-800";
      case "concluida":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatearFecha = (fecha) => {
    const now = new Date();
    const fechaNotificacion = new Date(fecha);
    const diff = (now - fechaNotificacion) / 1000 / 60;
    if (diff < 1) return "Justo ahora";
    if (diff < 60) return `hace ${Math.floor(diff)} min`;
    if (diff < 1440) return `hace ${Math.floor(diff / 60)} h`;
    return fechaNotificacion.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <NotificacionesContext.Provider
      value={{
        notificaciones,
        notificacionesFiltradas,
        totalNoLeidas,
        cargando,
        error,
        busqueda,
        setBusqueda,
        deletingId,
        obtenerNotificaciones,
        marcarYIr,
        handleEliminarNotificacion,
        obtenerIcono,
        obtenerColorStatus,
        formatearFecha,
      }}
    >
      {children}
    </NotificacionesContext.Provider>
  );
};

export default NotificacionesContext;