import React from "react";

const TablaHistorialStatus = ({ historial }) => {
  const formatearFechaMexico = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const capitalizar = (texto) => {
    if (!texto) return "Sin dato";
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  };

  const getStatusColor = (status) => {
    const colores = {
      creada: "bg-gray-100 text-gray-800",
      rechazada: "bg-red-100 text-red-800",
      cotizando: "bg-blue-100 text-blue-800",
      aprobada: "bg-green-100 text-green-800",
      "esperando autorizacion": "bg-yellow-100 text-yellow-800",
      autorizada: "bg-cyan-100 text-cyan-800",
      "proceso de pago": "bg-pink-100 text-pink-800",
      "proveedor preparando envío": "bg-indigo-100 text-indigo-800",
      "liberacion aduanal": "bg-purple-100 text-purple-800",
      "proceso de entrega": "bg-orange-100 text-orange-800",
      "entregada parcial": "bg-teal-100 text-teal-800",
      concluida: "bg-green-200 text-green-900",
      cancelada: "bg-red-200 text-red-900",
    };

    return colores[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-xl border border-gray-200">
      <table className="min-w-full whitespace-nowrap">
        <thead className="text-[14px] 2xl:text-[16px] bg-blue-500 text-white">
          <tr className="border-b border-gray-200">
            <th className="px-4 py-2 text-left font-semibold">
              Folio
            </th>
            <th className="px-4 py-2 text-left font-semibold">
              Status anterior
            </th>
            <th className="px-4 py-2 text-left font-semibold">
              Status nuevo
            </th>
            <th className="px-4 py-2 text-left font-semibold">
              Usuario
            </th>
            <th className="px-4 py-2 text-left font-semibold">
              Rol
            </th>
            <th className="px-4 py-2 text-left font-semibold">
              Fecha cambio
            </th>
          </tr>
        </thead>

        <tbody className="font-normal text-gray-700 text-[14px] 2xl:text-[16px]">
          {historial.map((item, index) => (
            <tr
              key={item.id}
              className={`border-b border-gray-200 transition-colors ${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-blue-50`}
            >
              <td className="px-4 py-4 font-semibold text-gray-700">
                {item.requisicion?.folio || "Sin folio"}
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-xl text-sm font-medium whitespace-nowrap ${getStatusColor(
                    item.statusAnterior
                  )}`}
                >
                  {capitalizar(item.statusAnterior)}
                </span>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`inline-block px-3 py-1 rounded-xl text-sm font-medium whitespace-nowrap ${getStatusColor(
                    item.statusNuevo
                  )}`}
                >
                  {capitalizar(item.statusNuevo)}
                </span>
              </td>

              <td className="px-4 py-4">
                {item.usuarioNombre || "Sin usuario"}
              </td>

              <td className="px-4 py-4 capitalize">
                {item.usuarioRol || "Sin rol"}
              </td>

              <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">
                {formatearFechaMexico(item.fechaCambio)}
              </td>
            </tr>
          ))}

          {historial.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-4 text-center text-gray-400">
                No hay movimientos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaHistorialStatus;
