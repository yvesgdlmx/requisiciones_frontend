import React, { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";

const TablaCategorias = ({
  categorias,
  menuAbierto,
  toggleMenu,
  cerrarMenu,
  onEditar,
  onEliminar,
}) => {
  const [expandedCards, setExpandedCards] = useState({});

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";
    const date = new Date(fecha);
    // Usar UTC para evitar conversión de zona horaria
    return date.toLocaleDateString("es-MX", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC"
    });
  };

  const formatearHora = (fecha) => {
    if (!fecha) return "";
    const date = new Date(fecha);
    // Usar UTC para evitar conversión de zona horaria
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC"
    });
  };

  const formatearMonto = (cantidad) => {
    return parseFloat(cantidad).toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const obtenerSimboloMoneda = (moneda) => {
    const simbolos = {
      MXN: "$",
      USD: "$",
      EUR: "€",
    };
    return simbolos[moneda] || "$";
  };

  const obtenerColorMoneda = (moneda) => {
    const colores = {
      MXN: "bg-green-100 text-green-800",
      USD: "bg-blue-100 text-blue-800",
      EUR: "bg-purple-100 text-purple-800",
    };
    return colores[moneda] || "bg-gray-100 text-gray-800";
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
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="py-3 px-6 text-left text-sm font-semibold rounded-tl-lg">
              Nombre
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Cantidad
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Moneda
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Periodo
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Fecha Inicio
            </th>
            <th className="py-3 px-6 text-left text-sm font-semibold">
              Fecha Fin
            </th>
            <th className="py-3 px-6 rounded-tr-lg"></th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria, idx) => {
            const { id, nombre, cantidad, periodo, fechaInicio, fechaFin, moneda } = categoria;
            return (
              <tr
                key={id}
                className={`transition-shadow font-semibold text-gray-600 ${
                  idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:shadow-lg hover:bg-blue-50`}
                style={{ borderBottom: "none" }}
              >
                <td className="py-4 px-6">
                  <span className="font-semibold text-gray-600 capitalize">
                    {nombre}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {obtenerSimboloMoneda(moneda || "MXN")}{formatearMonto(cantidad)}
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${obtenerColorMoneda(moneda || "MXN")}`}>
                    {moneda || "MXN"}
                  </span>
                </td>
                <td className="py-4 px-6 capitalize">{categoria.diasPeriodo || periodo} días</td>
                <td className="py-4 px-6">
                  <div>
                    <span>{formatearFecha(fechaInicio)}</span>
                    <span className="ml-2 text-xs text-gray-500">{formatearHora(fechaInicio)}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <span>{formatearFecha(fechaFin)}</span>
                    <span className="ml-2 text-xs text-gray-500">{formatearHora(fechaFin)}</span>
                  </div>
                </td>
                <td className="py-4 px-6 relative">
                  <button
                    onClick={() => toggleMenu(id)}
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                  >
                    <FaEllipsisV className="w-5 h-5 text-gray-500" />
                  </button>
                  {menuAbierto === id && (
                    <div
                      className={`absolute right-0 ${
                        idx === categorias.length - 1 ? "bottom-0 mb-10" : "mt-2"
                      } w-32 bg-white border border-gray-200 rounded shadow-lg z-10`}
                      onMouseLeave={cerrarMenu}
                    >
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          cerrarMenu();
                          onEditar && onEditar(categoria);
                        }}
                      >
                        Editar
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        onClick={() => {
                          cerrarMenu();
                          onEliminar && onEliminar(id, nombre);
                        }}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
          {categorias.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="py-6 text-center text-gray-400 bg-white rounded-b-lg"
              >
                No hay categorías registradas.
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
      {categorias.map((categoria) => {
        const { id, nombre, cantidad, periodo, fechaInicio, fechaFin, moneda } = categoria;
        const isExpanded = expandedCards[id];
        const monedaFinal = moneda || "MXN";
        const colorMoneda = obtenerColorMoneda(monedaFinal);

        return (
          <div
            key={id}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            {/* Header del Card */}
            <div className="bg-blue-500 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="text-lg font-semibold capitalize">
                {nombre}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMoneda}`}>
                {monedaFinal}
              </span>
            </div>

            {/* Body del Card */}
            <div className="p-6 space-y-4">
              {/* Cantidad */}
              <div className="border-b pb-4">
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                  Presupuesto
                </h4>
                <p className="text-2xl font-bold text-gray-700">
                  {obtenerSimboloMoneda(monedaFinal)}{formatearMonto(cantidad)}
                </p>
              </div>

              {/* Período */}
              <div>
                <h4 className="text-xs font-bold text-gray-500 uppercase mb-3">
                  Información del Período
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Duración</p>
                    <p className="font-semibold text-gray-700">
                      {categoria.diasPeriodo || periodo} días
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Moneda</p>
                    <p className="font-semibold text-gray-700">{monedaFinal}</p>
                  </div>
                </div>
              </div>

              {/* Fechas Expandibles */}
              {isExpanded && (
                <div className="border-t border-gray-300 pt-4 space-y-3 animate-fadeIn">
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Fecha Inicio
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                      <p className="font-semibold text-gray-700">
                        {formatearFecha(fechaInicio)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatearHora(fechaInicio)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">
                      Fecha Fin
                    </h4>
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
                      <p className="font-semibold text-gray-700">
                        {formatearFecha(fechaFin)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {formatearHora(fechaFin)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Botón Ver Más/Menos */}
              <button
                onClick={() => toggleExpand(id)}
                className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 
                         text-blue-700 font-semibold rounded-lg transition-all duration-200 
                         border border-blue-200 text-sm"
              >
                {isExpanded ? "Ver menos" : "Ver fechas"}
              </button>

              {/* Botones de Acciones */}
              <div className="border-t pt-4 flex gap-2">
                <button
                  onClick={() => onEditar && onEditar(categoria)}
                  className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => onEliminar && onEliminar(id, nombre)}
                  className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {categorias.length === 0 && (
        <div className="col-span-full text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-400 text-lg">No hay categorías registradas.</p>
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

export default TablaCategorias;