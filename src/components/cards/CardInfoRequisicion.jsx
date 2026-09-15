import React from "react";
import { capitalizeWords, formatearStatusRequisicion } from "../../helpers/FuncionesHelpers";

const CardInfoRequisicion = ({
  requisicion,
  updatedStatus,
  statusOptions,
  handleStatusChange,
}) => {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-md">
      <div>
        <span className="block text-sm font-semibold text-gray-600">
          Área:
        </span>
        <span className="text-md text-gray-800">
          {capitalizeWords(requisicion?.area)}
        </span>
      </div>
      <div>
        <span className="block text-sm font-semibold text-gray-600">
          Objetivo:
        </span>
        <span className="text-md text-gray-800">
          {requisicion?.objetivo}
        </span>
      </div>
      <div>
        <span className="block text-sm font-semibold text-gray-600">
          Solicitante:
        </span>
        <span className="text-md text-gray-800">
          {requisicion?.usuario
            ? `${requisicion.usuario.nombre} ${requisicion.usuario.apellido}`
            : requisicion?.solicitante}
        </span>
      </div>
      <div>
        <span className="block text-sm font-semibold text-gray-600">
          Status:
        </span>
        {handleStatusChange ? (
          <select
            value={updatedStatus}
            onChange={handleStatusChange}
            className="text-md w-full rounded border border-gray-300 px-2 py-1 text-gray-800"
          >
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {formatearStatusRequisicion(status)}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-md text-gray-800">
            {formatearStatusRequisicion(requisicion?.status)}
          </span>
        )}
      </div>
      <div>
        <span className="block text-sm font-semibold text-gray-600">
          Prioridad:
        </span>
        <span className="text-md text-gray-800">
          {capitalizeWords(requisicion?.prioridad)}
        </span>
      </div>
    </div>
  );
};

export default CardInfoRequisicion;
