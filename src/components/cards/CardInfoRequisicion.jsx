import React from "react";
import { capitalizeWords } from "../../helpers/FuncionesHelpers";
const CardInfoRequisicion = ({
  requisicion,
  updatedStatus, // valor del status editable
  statusOptions, // array de opciones de status
  handleStatusChange // función para cambiar el status
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-4 grid grid-cols-2 gap-4">
      <div>
        <span className="block font-semibold text-sm text-gray-600">
          Área:
        </span>
        <span className="text-md text-gray-800">
          {capitalizeWords(requisicion?.area)}
        </span>
      </div>
      <div>
        <span className="block font-semibold text-sm text-gray-600">
          Objetivo:
        </span>
        <span className="text-md text-gray-800">
          {requisicion?.objetivo}
        </span>
      </div>
      <div>
        <span className="block font-semibold text-sm text-gray-600">
          Solicitante:
        </span>
        <span className="text-md text-gray-800">
          {requisicion?.usuario
            ? `${requisicion.usuario.nombre} ${requisicion.usuario.apellido}`
            : requisicion?.solicitante}
        </span>
      </div>
      <div>
        <span className="block font-semibold text-sm text-gray-600">
          Status:
        </span>
        {handleStatusChange ? (
          <select
            value={updatedStatus}
            onChange={handleStatusChange}
            className="w-full border border-gray-300 rounded px-2 py-1 text-md text-gray-800"
          >
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>
                {capitalizeWords(status)}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-md text-gray-800">
            {capitalizeWords(requisicion?.status)}
          </span>
        )}
      </div>
      <div>
        <span className="block font-semibold text-sm text-gray-600">
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