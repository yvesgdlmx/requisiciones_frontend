import { Link } from "react-router-dom";
import { FiActivity, FiArrowRight, FiHelpCircle, FiPieChart, FiClock } from "react-icons/fi";

const temas = [
  {
    titulo: "Porcentaje por status",
    icono: FiPieChart,
    preguntas: [
      {
        pregunta: "¿Para qué sirve el filtro de fechas?",
        respuesta: "Selecciona las requisiciones por su fecha de creación. El reporte muestra cómo se distribuyen esas requisiciones según su status actual al consultar los datos. Si solo eliges una fecha inicial, incluye las creadas desde ese día; si solo eliges una fecha final, incluye las creadas hasta ese día. Sin fechas, considera todas las requisiciones disponibles en el reporte.",
      },
      {
        pregunta: "¿Muestra el status que tenían en esas fechas?",
        respuesta: "No. El rango determina cuáles requisiciones se incluyen, pero no reconstruye su status en el pasado. Una requisición creada en enero y concluida en febrero aparecerá como concluida cuando consultes enero después de ese cambio.",
      },
      {
        pregunta: "¿Cómo se calcula cada porcentaje?",
        respuesta: "Se divide la cantidad de requisiciones en un status entre el total de requisiciones incluidas y se multiplica por 100. Cada requisición se cuenta una sola vez, en su status actual; no se cuenta en cada etapa por la que pasó.",
      },
      {
        pregunta: "¿Por qué cambia el resultado si consulto el mismo periodo después?",
        respuesta: "Porque las requisiciones siguen avanzando. Aunque selecciones el mismo periodo de creación, sus status actuales pueden cambiar. Por eso, los periodos antiguos tienden a concentrarse en status finales, como concluida, cancelada o rechazada.",
      },
    ],
  },
  {
    titulo: "Tiempos de requisiciones",
    icono: FiClock,
    preguntas: [
      {
        pregunta: "¿Qué significan los tiempos de la tabla?",
        respuesta: "Indican cuánto tardó cada requisición entre las etapas señaladas en cada columna. Los tramos que comienzan en creada usan la fecha de creación; los demás usan las fechas de los cambios de status registrados en el historial.",
      },
      {
        pregunta: "¿Qué significa Pendiente?",
        respuesta: "Significa que todavía no se cuenta con las fechas necesarias para calcular ese tramo. Por ejemplo, si una requisición aún no llega a concluida, su tiempo de creada a concluida seguirá pendiente.",
      },
    ],
  },
  {
    titulo: "Historial de movimientos",
    icono: FiActivity,
    preguntas: [
      {
        pregunta: "¿Dónde puedo consultar los cambios de status?",
        respuesta: "En Historial de Movimientos puedes revisar los cambios de status registrados y buscar por folio, status, usuario o rol. Esto permite consultar el recorrido de una requisición. El reporte de porcentajes, en cambio, resume su status actual.",
      },
    ],
  },
];

const Ayuda = () => (
  <div className="w-full px-4 pb-6 pt-16 sm:px-6 md:pt-3 lg:px-8 2xl:px-10">
    <section className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
      <header className="border-b border-[#E2E8F0] px-5 py-6 sm:px-6">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#DBEAFE] bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#1E40AF]">
          <FiHelpCircle aria-hidden="true" /> Guía para administradores
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] sm:text-3xl">Centro de ayuda</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#64748B]">
          Consulta cómo interpretar los reportes y los movimientos de las requisiciones.
        </p>
      </header>

      <div className="space-y-6 bg-[#F8FAFC] p-5 sm:p-6">
        <div className="rounded-lg border border-[#DBEAFE] bg-[#EFF6FF] p-5 text-sm leading-6 text-[#334155]">
          <h2 className="font-semibold text-[#1E40AF]">Un ejemplo del filtro de fechas</h2>
          <p className="mt-2">
            Seleccionas del 1 al 31 de enero y hay 10 requisiciones creadas en ese periodo.
            Si al consultar el reporte 8 están concluidas y 2 siguen cotizando, verás
            <strong> 80 % concluidas y 20 % cotizando</strong>.
            Cuando las otras 2 concluyan y actualices el reporte, ese mismo periodo mostrará 100 % concluidas.
          </p>
        </div>

        {temas.map(({ titulo, icono, preguntas }) => {
          const Icono = icono;
          return (
          <section key={titulo} className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white">
            <h2 className="flex items-center gap-3 border-b border-[#E2E8F0] px-5 py-4 text-lg font-semibold text-[#334155]">
              <Icono className="shrink-0 text-[#2563EB]" aria-hidden="true" />
              {titulo}
            </h2>
            <div className="divide-y divide-[#E2E8F0]">
              {preguntas.map(({ pregunta, respuesta }) => (
                <details key={pregunta} className="group px-5 py-4">
                  <summary className="cursor-pointer rounded text-sm font-semibold text-[#334155] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2563EB]">
                    {pregunta}
                  </summary>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-[#64748B]">{respuesta}</p>
                </details>
              ))}
            </div>
          </section>
          );
        })}

        <div className="flex flex-wrap gap-3">
          <Link to="/requisiciones/reportes" className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1E40AF]">
            Ir a reportes <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to="/requisiciones/historial-status" className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm font-semibold text-[#334155] transition hover:bg-[#EFF6FF]">
            Ver historial de movimientos <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default Ayuda;
