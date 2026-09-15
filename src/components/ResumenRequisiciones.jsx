import React from "react";
import { formatearStatusRequisicion } from "../helpers/FuncionesHelpers";

const ResumenRequisiciones = ({
  detallesDeStatus,
  agrupacionStatus,
  titulo,
  onClickStatus,
  statusSeleccionado,
}) => {
  const estadosConTotal = [
    ...detallesDeStatus,
    { status: "Total General", color: "bg-[#DBEAFE]", textColor: "text-[#1E40AF]" },
  ];

  const totalGeneral = Object.values(agrupacionStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="mb-6 hidden lg:block">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#334155]">{titulo}</h2>
          <p className="text-sm text-[#64748B]">Filtra por status desde el resumen.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[#E2E8F0] bg-[#E2E8F0] xl:grid-cols-7">
        {estadosConTotal.map((item) => {
          const isTotal = item.status === "Total General";
          const isActivo = isTotal ? !statusSeleccionado : statusSeleccionado === item.status;
          const total = isTotal ? totalGeneral : agrupacionStatus[item.status] || 0;

          return (
            <button
              type="button"
              key={item.status}
              className={`bg-white px-4 py-4 text-left transition hover:bg-[#F8FAFC] ${
                isActivo ? "shadow-inner ring-2 ring-inset ring-[#2563EB]" : ""
              }`}
              onClick={() => onClickStatus && onClickStatus(item.status)}
            >
              <div className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${item.color}`} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                    {isTotal ? "Total" : formatearStatusRequisicion(item.status)}
                  </p>
                  <p className={`mt-1 text-2xl font-semibold ${item.textColor}`}>
                    {total}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ResumenRequisiciones;
