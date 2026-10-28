import { useMemo, useState } from "react";
import { FiArrowUpRight, FiCalendar, FiCheckCircle, FiDownload, FiLayers, FiPieChart, FiRefreshCw } from "react-icons/fi";
import { formatearStatusRequisicion, normalizarStatusRequisicion } from "../../helpers/FuncionesHelpers";
import { exportarReporteStatusAExcel } from "../../services/excelService";
import "./ReportePorcentajesStatus.css";

const colores = {
  creada: "#8d91a6", cotizando: "#ed623e", "esperando autorizacion": "#dca345",
  autorizada: "#599d90", "proceso de pago": "#bf8399", "proveedor preparando envio": "#8581b5",
  "liberacion aduanal": "#ab89bf", "proceso de entrega": "#588fba", "entregada parcial": "#74afb0",
  concluida: "#489e78", rechazada: "#d37373", cancelada: "#a76e76", "sin status": "#9ca3af",
};
const numero = (n) => Number(n || 0).toLocaleString("es-MX");
const porcentaje = (n) => `${n.toFixed(2)} %`;

const ReportePorcentajesStatus = ({ requisiciones, cargando, error, actualizar }) => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [statusActivo, setStatusActivo] = useState(null);
  const rangoInvalido = Boolean(fechaInicio && fechaFin && fechaInicio > fechaFin);
  const filtradas = useMemo(() => {
    if (rangoInvalido) return [];
    const inicio = fechaInicio ? new Date(`${fechaInicio}T00:00:00`) : null;
    const fin = fechaFin ? new Date(`${fechaFin}T23:59:59.999`) : null;
    return requisiciones.filter((req) => {
      if (!inicio && !fin) return true;
      const fecha = new Date(req.fechaHora);
      return req.fechaHora && !Number.isNaN(fecha.getTime()) && (!inicio || fecha >= inicio) && (!fin || fecha <= fin);
    });
  }, [requisiciones, fechaInicio, fechaFin, rangoInvalido]);
  const resumen = useMemo(() => {
    const conteo = new Map();
    filtradas.forEach((req) => {
      const normalizado = normalizarStatusRequisicion(req.status) || "sin status";
      const status = normalizado.startsWith("proveedor preparando env") ? "proveedor preparando envio" : normalizado;
      conteo.set(status, (conteo.get(status) || 0) + 1);
    });
    let acumulado = 0;
    return [...conteo].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "es")).map(([status, cantidad]) => {
      const valor = cantidad / filtradas.length * 100;
      const item = { status, statusFormateado: formatearStatusRequisicion(status), cantidad, porcentaje: valor, color: colores[status] || "#64748b", inicio: acumulado };
      acumulado += valor;
      return item;
    });
  }, [filtradas]);
  const total = filtradas.length;
  const principal = resumen[0];
  const activo = resumen.find((item) => item.status === statusActivo);
  const concluidas = resumen.find((item) => item.status === "concluida");
  const finales = resumen.filter((item) => ["concluida", "rechazada", "cancelada"].includes(item.status)).reduce((sum, item) => sum + item.cantidad, 0);
  const top3 = resumen.slice(0, 3).reduce((sum, item) => sum + item.porcentaje, 0);
  const metricas = [
    { titulo: "Total analizado", valor: numero(total), detalle: `de ${numero(requisiciones.length)} requisiciones`, Icono: FiLayers },
    { titulo: "Status presentes", valor: numero(resumen.length), detalle: "en el periodo seleccionado", Icono: FiPieChart },
    { titulo: "Concluidas", valor: numero(concluidas?.cantidad), detalle: `${porcentaje(concluidas?.porcentaje || 0)} del total`, Icono: FiCheckCircle },
    { titulo: "Concentración top 3", valor: porcentaje(top3), detalle: "de las requisiciones analizadas", Icono: FiArrowUpRight },
  ];

  return (
    <>
      <div className="export-toolbar status-toolbar">
        <div className="export-filters">
          <div className="export-date-range"><FiCalendar aria-hidden="true" /><input aria-label="Fecha inicial de creación" type="date" value={fechaInicio} max={fechaFin || undefined} onChange={(e) => setFechaInicio(e.target.value)} /><span>—</span><input aria-label="Fecha final de creación" type="date" value={fechaFin} min={fechaInicio || undefined} onChange={(e) => setFechaFin(e.target.value)} /></div>
          {(fechaInicio || fechaFin) && <button type="button" className="export-clear" onClick={() => { setFechaInicio(""); setFechaFin(""); setStatusActivo(null); }}>Limpiar filtros</button>}
        </div>
        <div className="export-toolbar-actions">
          <button type="button" className="export-button" title="Actualizar reporte" aria-label="Actualizar reporte" disabled={cargando} onClick={actualizar}><FiRefreshCw className={cargando ? "animate-spin" : ""} /></button>
          <button type="button" className="export-button" disabled={cargando || !!error || total === 0} onClick={() => exportarReporteStatusAExcel(resumen, total, "reporte-status-requisiciones")}><FiDownload /> Exportar a Excel</button>
        </div>
      </div>
      <p className="status-period-note">Status actual de las requisiciones creadas en el periodo seleccionado.</p>
      {rangoInvalido && <p className="export-error" role="alert">La fecha inicial debe ser anterior o igual a la fecha final.</p>}
      {error && <div className="export-error" role="alert">{error}<button type="button" onClick={actualizar}>Reintentar</button></div>}

      <section className="export-metrics status-metrics" aria-label="Resumen del reporte" aria-busy={cargando}>
        {metricas.map((metrica) => {
          const Icono = metrica.Icono;
          return <div className="export-metric" key={metrica.titulo}><div className="export-metric-label"><Icono aria-hidden="true" />{metrica.titulo}</div><div className="export-metric-value">{cargando ? "—" : metrica.valor}<span>{metrica.detalle}</span></div></div>;
        })}
      </section>

      <section className="status-distribution" aria-labelledby="status-distribution-title" aria-busy={cargando}>
        <header className="status-panel-header"><div><h2 id="status-distribution-title"><FiPieChart />Distribución por status</h2><p>Participación de cada etapa sobre el total analizado.</p></div><span className="status-view-label"><i />{fechaInicio || fechaFin ? "Periodo filtrado" : "Vista general"}</span></header>
        {cargando ? <div className="status-empty" role="status"><FiRefreshCw className="animate-spin" /><p>Actualizando el reporte…</p></div>
          : error ? <div className="status-empty"><p>No se pudo actualizar el reporte. Intenta de nuevo.</p></div>
          : total === 0 ? <div className="status-empty"><FiPieChart /><h3>Sin requisiciones para este periodo</h3><p>Ajusta las fechas o limpia los filtros para consultar el reporte.</p></div>
          : <div className="status-chart-layout">
            <div className="status-chart-column">
              <div className="status-donut" onMouseLeave={() => setStatusActivo(null)}>
                <svg viewBox="0 0 280 280" role="img" aria-label={`Distribución de ${numero(total)} requisiciones por status. El detalle está en la lista contigua.`}>
                  <title>Porcentaje por status</title><desc>{resumen.map((item) => `${item.statusFormateado}: ${numero(item.cantidad)}, ${porcentaje(item.porcentaje)}`).join(". ")}</desc>
                  <circle cx="140" cy="140" r="109" fill="none" stroke="#f4f4f5" strokeWidth="36" />
                  {resumen.map((item) => <circle key={item.status} cx="140" cy="140" r="109" fill="none" stroke={item.color} strokeWidth={statusActivo === item.status ? "41" : "36"} pathLength="100" strokeDasharray={`${item.porcentaje} ${100 - item.porcentaje}`} strokeDashoffset={-item.inicio} transform="rotate(-90 140 140)" opacity={activo && statusActivo !== item.status ? 0.3 : 1} className="status-donut-segment" onMouseEnter={() => setStatusActivo(item.status)}><title>{`${item.statusFormateado}: ${porcentaje(item.porcentaje)}`}</title></circle>)}
                </svg>
                <div className="status-donut-center" aria-hidden="true"><span>{activo ? activo.statusFormateado : "Total de requisiciones"}</span><strong>{numero(activo?.cantidad ?? total)}</strong><small>{activo ? porcentaje(activo.porcentaje) : "100 % del periodo"}</small></div>
              </div>
              <div className="status-chart-caption"><span className="status-caption-rule" /><p>Cada requisición se cuenta una vez,<br />en su status actual.</p></div>
            </div>
            <div className="status-legend" role="list" aria-label="Cantidades y porcentajes por status">
              <div className="status-legend-heading" aria-hidden="true"><span>Status</span><span>Cantidad</span><span>Porcentaje</span></div>
              {resumen.map((item) => <div key={item.status} role="listitem" className={`status-legend-row ${statusActivo === item.status ? "is-active" : ""}`} onMouseEnter={() => setStatusActivo(item.status)} onMouseLeave={() => setStatusActivo(null)}>
                <button type="button" className="status-legend-name" aria-label={`${item.statusFormateado}: ${numero(item.cantidad)} requisiciones, ${porcentaje(item.porcentaje)}`} aria-pressed={statusActivo === item.status} onFocus={() => setStatusActivo(item.status)} onBlur={() => setStatusActivo(null)} onClick={() => setStatusActivo(item.status)}><i style={{ backgroundColor: item.color }} /><span>{item.statusFormateado}</span></button>
                <span className="status-legend-count">{numero(item.cantidad)}</span><span className="status-legend-percentage">{porcentaje(item.porcentaje)}</span>
              </div>)}
              <div className="status-legend-total"><span>Total</span><span>{numero(total)}</span><span>100.00 %</span></div>
            </div>
          </div>}
        {total > 0 && !cargando && !error && <footer className="status-panel-footer"><FiCheckCircle /><span>Las fechas filtran por creación; los porcentajes reflejan el status actual.</span></footer>}
      </section>

      {total > 0 && !cargando && !error && <section className="status-insights" aria-label="Lectura del reporte">
        <div><span className="status-insight-label">Mayor participación</span><p><i style={{ background: principal.color }} />{principal.statusFormateado}</p><small>{porcentaje(principal.porcentaje)} · {numero(principal.cantidad)} requisiciones</small></div>
        <div><span className="status-insight-label">En proceso</span><p>{numero(total - finales)} <span>requisiciones</span></p><small>{porcentaje((total - finales) / total * 100)} del total analizado</small></div>
        <div><span className="status-insight-label">En status final</span><p>{numero(finales)} <span>requisiciones</span></p><small>Concluidas, rechazadas o canceladas</small></div>
      </section>}
    </>
  );
};

export default ReportePorcentajesStatus;
