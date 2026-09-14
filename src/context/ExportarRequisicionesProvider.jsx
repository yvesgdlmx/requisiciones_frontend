import React, { createContext, useEffect, useMemo, useState } from "react";
import clienteAxios from "../config/clienteAxios";

const ExportarRequisicionesContext = createContext();

export const ExportarRequisicionesProvider = ({ children }) => {
    const [requisiciones, setRequisiciones] = useState([]);
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    const [modoExportacion, setModoExportacion] = useState("todas");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFin, setFechaFin] = useState("")
    const [folio, setFolio] = useState("")
    const [statusFiltro, setStatusFiltro] = useState("");

    const obtenerRequisiciones = async () => {
        try {
            setCargando(true)

            const token = localStorage.getItem("token");
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            };

            const { data } = await clienteAxios.get("/requisiciones", config);

            setRequisiciones(data.requisiciones || []);
            setError(null)
        } catch (error) {
            console.error("Error al obtener requisiciones para exportar:", error)
            setError(
                error.response?.data?.msg || "Error al obtener requisiciones"
            )
        } finally {
            setCargando(false)
        }
    }

    const requisicionesFiltradas = useMemo(() => {
        let resultado = [];

        if (modoExportacion === "todas") {
            resultado = requisiciones;
        }

        if (modoExportacion === "folio") {
            const texto = folio.trim().toLowerCase();

            if (!texto) return [];

            resultado = requisiciones.filter((req) =>
                (req.folio || "").toLowerCase().includes(texto)
            )
        }

        if (modoExportacion === "rango") {
            if (!fechaInicio || !fechaFin) return [];

            const inicio = new Date(`${fechaInicio}T00:00:00`);
            const fin = new Date(`${fechaFin}T23:59:59`);


            resultado = requisiciones.filter((req) => {
                const fechaReq = new Date(req.fechaHora);
                return fechaReq >= inicio && fechaReq <= fin
            });
        }

        if (statusFiltro) {
            resultado = resultado.filter((req) => req.status === statusFiltro);
        }

        return resultado;
    }, [requisiciones, modoExportacion, fechaInicio, fechaFin, folio, statusFiltro])

    const statusDisponibles = useMemo(() => {
        const statusUnicos = new Set(
            requisiciones
                .map((req) => req.status)
                .filter(Boolean)
        );

        return Array.from(statusUnicos).sort((a, b) => a.localeCompare(b));
    }, [requisiciones]);

    useEffect(() => {
        obtenerRequisiciones();
    }, []);

    return (
        <ExportarRequisicionesContext.Provider
            value={{
                requisiciones,
                requisicionesFiltradas,
                cargando,
                error,
                modoExportacion,
                setModoExportacion,
                fechaInicio,
                setFechaInicio,
                fechaFin,
                setFechaFin,
                folio,
                setFolio,
                statusFiltro,
                setStatusFiltro,
                statusDisponibles,
                obtenerRequisiciones,
            }}
        >
            {children}
        </ExportarRequisicionesContext.Provider>
    );
};

export default ExportarRequisicionesContext;
