import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const TablaHistorialGastos = ({ historial }) => {
  const [expandedCards, setExpandedCards] = useState({});

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    return new Date(fecha).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "";
    return new Date(fecha).toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearMonto = (cantidad) => {
    return parseFloat(cantidad).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Función para obtener el símbolo de moneda
  const getSimboloMoneda = (moneda) => {
    const simbolos = {
      MXN: "$",
      USD: "$",
      EUR: "€",
    };
    return simbolos[moneda] || "$";
  };

  // Función para formatear monto con moneda
  const formatearMontoConMoneda = (cantidad, moneda = "MXN") => {
    const simbolo = getSimboloMoneda(moneda);
    const monto = formatearMonto(cantidad);
    return `${simbolo}${monto} ${moneda}`;
  };

  // Función para obtener color del status
  const getStatusColor = (status) => {
    const colores = {
      "creada": "bg-gray-100 text-gray-800",
      "rechazada": "bg-red-100 text-red-800",
      "cotizando": "bg-blue-100 text-blue-800",
      "aprobada": "bg-green-100 text-green-800",
      "esperando autorizacion": "bg-yellow-100 text-yellow-800",
      "autorizada": "bg-cyan-100 text-cyan-800",
      "liberacion aduanal": "bg-purple-100 text-purple-800",
      "proceso de entrega": "bg-orange-100 text-orange-800",
      "entregada parcial": "bg-teal-100 text-teal-800",
      "concluida": "bg-green-200 text-green-900",
      "cancelada": "bg-red-200 text-red-900",
    };
    return colores[status] || "bg-gray-100 text-gray-800";
  };

  const getSaldoColor = (saldo) => {
    return saldo < 0 
      ? "text-red-600 bg-red-100" 
      : "text-green-600 bg-green-100";
  };

  const toggleExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Vista de TABLA - Solo visible en pantallas lg+
  const VistaTabla = () => (
    <div className="overflow-x-auto rounded-lg shadow-md">
      <table className="min-w-full bg-white text-sm">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-2 px-3 text-left font-semibold rounded-tl-lg">
              Categoría
            </th>
            <th className="py-2 px-3 text-left font-semibold">
              Status
            </th>
            <th className="py-2 px-3 text-center font-semibold">
              Presupuesto Total
            </th>
            <th className="py-2 px-3 text-center font-semibold">
              Monto Gastado
            </th>
            <th className="py-2 px-3 text-center font-semibold">
              Saldo Disponible
            </th>
            <th className="py-2 px-3 text-left font-semibold">
              Fecha Monto
            </th>
            <th className="py-2 px-3 text-center font-semibold">
              Período (días)
            </th>
            <th className="py-2 px-3 text-left font-semibold">
              Fecha Inicio
            </th>
            <th className="py-2 px-3 text-left font-semibold">
              Fecha Fin
            </th>
            <th className="py-2 px-3 text-left font-semibold rounded-tr-lg">
              Comprador
            </th>
          </tr>
        </thead>
        <tbody>
          {historial.map((item, idx) => {
            const {
              id,
              categoriaNombre,
              presupuestoTotal,
              diasPeriodo,
              fechaInicioPeriodo,
              fechaFinPeriodo,
              montoGastado,
              saldoDisponible,
              fechaGasto,
              usuarioComprador,
              statusRequisicion,
              moneda,
            } = item;

            const saldoColor =
              saldoDisponible < 0 ? "text-red-500" : "text-green-600";
            const statusColorClass = getStatusColor(statusRequisicion);

            return (
              <tr
                key={id}
                className={`font-medium text-gray-600 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-blue-50`}
              >
                <td className="py-3 px-3">
                  <span className="font-semibold text-gray-700 capitalize">
                    {categoriaNombre || "Sin categoría"}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${statusColorClass}`}>
                    {statusRequisicion ? statusRequisicion.charAt(0).toUpperCase() + statusRequisicion.slice(1) : "Sin status"}
                  </span>
                </td>
                <td className="py-3 px-3 text-center text-gray-700 font-semibold">
                  {formatearMontoConMoneda(presupuestoTotal, moneda)}
                </td>
                <td className="py-3 px-3 text-center text-gray-700">
                  -{formatearMontoConMoneda(montoGastado, moneda)}
                </td>
                <td className={`py-3 px-3 text-center font-semibold ${saldoColor}`}>
                  {formatearMontoConMoneda(saldoDisponible, moneda)}
                </td>
                <td className="py-3 px-3 text-xs text-gray-600">
                  <div>{formatearFecha(fechaGasto)}</div>
                  <div className="text-gray-400">{formatearHora(fechaGasto)}</div>
                </td>
                <td className="py-3 px-3 text-center text-gray-700 font-semibold">
                  {diasPeriodo}
                </td>
                <td className="py-3 px-3 text-xs text-gray-600">
                  <div>{formatearFecha(fechaInicioPeriodo)}</div>
                  <div className="text-gray-400">{formatearHora(fechaInicioPeriodo)}</div>
                </td>
                <td className="py-3 px-3 text-xs text-gray-600">
                  <div>{formatearFecha(fechaFinPeriodo)}</div>
                  <div className="text-gray-400">{formatearHora(fechaFinPeriodo)}</div>
                </td>
                <td className="py-3 px-3 text-gray-700">
                  {usuarioComprador || "Sin usuario"}
                </td>
              </tr>
            );
          })}
          {historial.length === 0 && (
            <tr>
              <td
                colSpan={10}
                className="py-6 text-center text-gray-400 bg-white"
              >
                No hay registros en el historial.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  // Vista de CARDS - Solo visible en pantallas sm y md
  const VistaCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {historial.map((item) => {
        const {
          id,
          categoriaNombre,
          presupuestoTotal,
          diasPeriodo,
          fechaInicioPeriodo,
          fechaFinPeriodo,
          montoGastado,
          saldoDisponible,
          fechaGasto,
          usuarioComprador,
          statusRequisicion,
          moneda,
        } = item;

        const isExpanded = expandedCards[id];
        const saldoColorClass = getSaldoColor(saldoDisponible);
        const statusColorClass = getStatusColor(statusRequisicion);

        return (
          <div
            key={id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header del Card */}
            <div className="bg-blue-500 px-6 py-4 text-white">
              <h3 className="text-lg font-semibold capitalize">
                {categoriaNombre || "Sin categoría"}
              </h3>
              <p className="text-sm text-blue-100 mt-1">
                {formatearFecha(fechaGasto)}{" "}
                <span className="text-xs">{formatearHora(fechaGasto)}</span>
              </p>
            </div>

            {/* Body del Card */}
            <div className="p-6 space-y-4">
              {/* Status y Moneda */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  Estado de Requisición
                </h4>
                <div className="flex flex-col gap-2">
                  <span className={`px-3 py-2 rounded-lg text-sm font-semibold w-fit ${statusColorClass}`}>
                    {statusRequisicion ? statusRequisicion.charAt(0).toUpperCase() + statusRequisicion.slice(1) : "Sin status"}
                  </span>
                  <span className="text-sm text-gray-600 font-medium">
                    Moneda: <strong>{moneda}</strong>
                  </span>
                </div>
              </div>

              {/* Dinero - Presupuesto, Gastado, Saldo */}
              <div className="border-t border-gray-300 pt-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  Información Financiera
                </h4>
                <div className="space-y-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Presupuesto Total</p>
                    <p className="text-lg font-bold text-gray-700">
                      {formatearMontoConMoneda(presupuestoTotal, moneda)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Monto Gastado</p>
                    <p className="text-lg font-bold text-gray-700">
                      -{formatearMontoConMoneda(montoGastado, moneda)}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${saldoColorClass}`}>
                    <p className="text-xs mb-1 font-semibold">Saldo Disponible</p>
                    <p className="text-lg font-bold">
                      {formatearMontoConMoneda(saldoDisponible, moneda)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Información Expandible - Fechas y Comprador */}
              {isExpanded && (
                <div className="border-t border-gray-300 pt-4 space-y-4 animate-fadeIn">
                  {/* Período */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                      Período
                    </h4>
                    <div className="space-y-2">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Duración</p>
                        <p className="font-semibold text-gray-700">{diasPeriodo} días</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Fecha Inicio</p>
                        <p className="font-semibold text-gray-700">
                          {formatearFecha(fechaInicioPeriodo)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatearHora(fechaInicioPeriodo)}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">Fecha Fin</p>
                        <p className="font-semibold text-gray-700">
                          {formatearFecha(fechaFinPeriodo)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatearHora(fechaFinPeriodo)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comprador */}
                  <div className="border-t border-gray-300 pt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                      Información del Comprador
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                      <p className="font-semibold text-gray-700">
                        {usuarioComprador || "Sin usuario"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón Expandir */}
              <button
                onClick={() => toggleExpand(id)}
                className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 
                         text-blue-700 font-semibold rounded-lg transition-all duration-200 
                         flex items-center justify-center gap-2 border border-blue-200"
              >
                {isExpanded ? (
                  <>
                    <span>Ver menos</span>
                    <FaChevronUp className="text-sm" />
                  </>
                ) : (
                  <>
                    <span>Ver más detalles</span>
                    <FaChevronDown className="text-sm" />
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}

      {historial.length === 0 && (
        <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-400 text-lg">No hay registros en el historial.</p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Tabla visible solo en lg+ */}
      <div className="hidden lg:block">
        <VistaTabla />
      </div>

      {/* Cards visible solo en sm y md */}
      <div className="lg:hidden">
        <VistaCards />
      </div>
    </>
  );
};

export default TablaHistorialGastos;