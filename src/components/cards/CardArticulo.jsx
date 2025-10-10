import React, { useState } from "react";
import { capitalizeWords } from "../../helpers/FuncionesHelpers";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";
const CardArticulo = ({ articulo, indice }) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpen = () => setIsOpen(!isOpen);
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-4 mb-4">
      {/* Encabezado colapsable */}
      <div
        className="flex justify-between items-center cursor-pointer pb-2"
        onClick={toggleOpen}
      >
        <h4 className="text-md font-bold text-gray-500">
          {`Artículo ${indice + 1}`}
        </h4>
        <span className="text-gray-600 text-md">
          {isOpen ? <AiOutlineUp /> : <AiOutlineDown />}
        </span>
      </div>
      {/* Contenido desplegable */}
      {isOpen && (
        <div className="mt-4 text-gray-700 space-y-2">
          <div>
            <span className="font-semibold">Cantidad: </span>
            <span>{articulo.cantidad}</span>
          </div>
          <div>
            <span className="font-semibold">Unidad de Medida: </span>
            <span>{capitalizeWords(articulo.unidadMedida)}</span>
          </div>
          <div>
            <span className="font-semibold">Número de Parte: </span>
            <span>{articulo.numeroParte || "No asignado"}</span>
          </div>
          <div>
            <span className="font-semibold">Descripción: </span>
            <span>{articulo.descripcion || "Sin descripción"}</span>
          </div>
        </div>
      )}
    </div>
  );
};
export default CardArticulo;