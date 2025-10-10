import React from 'react';
import { capitalizeWords } from '../helpers/FuncionesHelpers';

const ResumenRequisiciones = ({ detallesDeStatus, agrupacionStatus, titulo, onClickStatus, statusSeleccionado }) => {
  // Creamos un nuevo arreglo que incluye "Total General" al final
  const estadosConTotal = [
    ...detallesDeStatus,
    { status: 'Total General', color: 'bg-gray-400', textColor: 'text-gray-800' }
  ];

  return (
    <div className="mb-6 hidden lg:block">
      <div className="p-2 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-sky-50">
        <div className="bg-white rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-500 mb-4 uppercase">{titulo}</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-6 gap-4">
            {estadosConTotal.map((item) => {
              const isActivo = statusSeleccionado === item.status;
              return (
                <li
                  key={item.status}
                  className={`flex items-center space-x-3 cursor-pointer p-2 rounded transition 
                    ${isActivo ? 'bg-blue-100 border border-blue-400 shadow-inner' : 'hover:bg-gray-100'}`}
                  onClick={() => onClickStatus && onClickStatus(item.status)}
                >
                  <div className={`w-6 h-6 ${item.color} rounded-full`} />
                  <div>
                    <p className="text-sm text-gray-600">
                      {item.status === 'Total General' ? 'Total General' : capitalizeWords(item.status)}
                    </p>
                    <p className={`text-lg font-bold ${item.textColor}`}>
                      {item.status === 'Total General'
                        ? Object.values(agrupacionStatus).reduce((a,b) => a+b, 0)
                        : agrupacionStatus[item.status] || 0}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumenRequisiciones;
