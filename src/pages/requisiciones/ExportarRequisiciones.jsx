import AvatarIniciales from "../../components/AvatarIniciales";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiActivity, FiArrowDown, FiArrowUp, FiCalendar, FiCheckCircle, FiChevronLeft,
  FiChevronRight, FiChevronsDown, FiDownload, FiFileText, FiFilter,
  FiHelpCircle, FiPackage, FiPaperclip, FiRefreshCw, FiSearch, FiTruck,
} from "react-icons/fi";
import useExportarRequisiciones from "../../hooks/useExportarRequisiciones";
import { exportarRequisicionesAExcel } from "../../services/excelService";
import { formatearStatusRequisicion, normalizarStatusRequisicion } from "../../helpers/FuncionesHelpers";
import "./ExportarRequisiciones.css";

const numero = (valor) => Number(valor || 0).toLocaleString("es-MX");
const fecha = (valor) => {
  const date = new Date(valor);
  return valor && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString("es-MX", { timeZone: "America/Mexico_City", day: "2-digit", month: "short", year: "numeric" })
    : "Sin fecha";
};
const dia = (valor) => {
  const date = new Date(valor);
  if (!valor || Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Mexico_City", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
};
const solicitante = (req) => req.usuario
  ? `${req.usuario.nombre || ""} ${req.usuario.apellido || ""}`.trim() || "Sin solicitante"
  : typeof req.solicitante === "string" ? req.solicitante : "Sin solicitante";

const crearLinea = (valores, maximo) => {
  const puntos = valores.map((valor, index) => [48 + index * (904 / Math.max(valores.length - 1, 1)), 172 - (valor / maximo) * 144]);
  // Curvas suaves sin sobrepasar el valor de los extremos de cada tramo.
  return puntos.map(([x, y], i) => i === 0 ? `M ${x} ${y}`
    : `C ${(puntos[i - 1][0] + x) / 2} ${puntos[i - 1][1]}, ${(puntos[i - 1][0] + x) / 2} ${y}, ${x} ${y}`).join(" ");
};

const ExportarRequisiciones = () => {
  const {
    requisiciones, requisicionesFiltradas, cargando, error,
    modoExportacion, setModoExportacion, fechaInicio, setFechaInicio,
    fechaFin, setFechaFin, folio, setFolio, statusFiltro, setStatusFiltro,
    statusDisponibles, obtenerRequisiciones,
  } = useExportarRequisiciones();
  const [paginacion, setPaginacion] = useState({ pagina: 1, datos: null });
  const [orden, setOrden] = useState({ campo: "fechaHora", ascendente: false });
  const [puntoActivo, setPuntoActivo] = useState(null);
  const [verDisponibles, setVerDisponibles] = useState(true);
  const total = requisicionesFiltradas.length;
  const rangoInvalido = modoExportacion === "rango" && fechaInicio && fechaFin && fechaInicio > fechaFin;
  const puedeExportar = total > 0 && !cargando && !error && !rangoInvalido;

  const ordenadas = useMemo(() => [...requisicionesFiltradas].sort((a, b) => {
    const valor = (req) => orden.campo === "solicitante" ? solicitante(req)
      : orden.campo === "fechaHora" ? new Date(req.fechaHora).getTime() || 0
      : orden.campo === "articulos" ? req.articulos?.length || 0 : req[orden.campo] || "";
    const x = valor(a), y = valor(b);
    return (typeof x === "number" ? x - y : String(x).localeCompare(String(y), "es", { numeric: true })) * (orden.ascendente ? 1 : -1);
  }), [requisicionesFiltradas, orden]);
  const paginas = Math.max(1, Math.ceil(total / 8));
  const pagina = paginacion.datos === requisicionesFiltradas ? Math.min(paginacion.pagina, paginas) : 1;
  const inicio = (pagina - 1) * 8;
  const filas = ordenadas.slice(inicio, inicio + 8);

  const grafica = useMemo(() => {
    const seleccion = new Map(), disponibles = new Map();
    requisiciones.forEach((req) => { const key = dia(req.fechaHora); if (key) disponibles.set(key, (disponibles.get(key) || 0) + 1); });
    requisicionesFiltradas.forEach((req) => { const key = dia(req.fechaHora); if (key) seleccion.set(key, (seleccion.get(key) || 0) + 1); });
    const claves = [...seleccion.keys()].sort();
    const fin = modoExportacion === "rango" && fechaFin ? fechaFin : claves.at(-1) || dia(new Date());
    const dias = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(`${fin}T12:00:00Z`);
      date.setUTCDate(date.getUTCDate() - 13 + i);
      const key = date.toISOString().slice(0, 10);
      return { key, etiqueta: date.toLocaleDateString("es-MX", { timeZone: "UTC", day: "numeric", month: "short" }), seleccion: seleccion.get(key) || 0, disponibles: disponibles.get(key) || 0 };
    });
    const max = Math.max(4, ...dias.map((d) => Math.max(d.seleccion, verDisponibles ? d.disponibles : 0)));
    const paso = Math.max(1, Math.ceil(max / 4));
    return { dias, maximo: paso * 4, paso };
  }, [requisiciones, requisicionesFiltradas, modoExportacion, fechaFin, verDisponibles]);

  const totalArticulos = requisicionesFiltradas.reduce((sum, req) => sum + (req.articulos?.length || 0), 0);
  const conProveedor = requisicionesFiltradas.filter((req) => req.proveedor).length;
  const conArchivos = requisicionesFiltradas.filter((req) => req.archivos?.length).length;
  const concluidas = requisicionesFiltradas.filter((req) => req.status === "concluida").length;
  const metricas = [
    { titulo: "Requisiciones", valor: total, Icono: FiFileText, detalle: `de ${numero(requisiciones.length)} disponibles` },
    { titulo: "Artículos", valor: totalArticulos, Icono: FiPackage, detalle: "incluidos en la selección" },
    { titulo: "Con proveedor", valor: conProveedor, Icono: FiTruck, detalle: "con proveedor registrado" },
    { titulo: "Concluidas", valor: concluidas, Icono: FiCheckCircle, detalle: "con proceso finalizado" },
    { titulo: "Con archivos", valor: conArchivos, Icono: FiPaperclip, detalle: "con documentos adjuntos" },
  ];

  const cambiarOrden = (campo) => {
    setOrden((actual) => ({ campo, ascendente: actual.campo === campo ? !actual.ascendente : true }));
    setPaginacion({ pagina: 1, datos: requisicionesFiltradas });
  };
  const exportar = () => {
    if (!puedeExportar) return;
    const sufijo = statusFiltro ? `-${statusFiltro.replaceAll(" ", "-")}` : "";
    const nombre = modoExportacion === "folio" ? `requisicion-${folio.trim() || "folio"}`
      : modoExportacion === "rango" ? `requisiciones-${fechaInicio}-${fechaFin}` : "requisiciones-todas";
    exportarRequisicionesAExcel(ordenadas, `${nombre}${sufijo}`);
  };
  const limpiar = () => {
    setModoExportacion("todas"); setFechaInicio(""); setFechaFin(""); setFolio(""); setStatusFiltro("");
  };
  const columnas = [
    ["solicitante", "Solicitante"], ["folio", "Folio"], ["fechaHora", "Fecha de creación"],
    ["status", "Status"], ["articulos", "Artículos"], ["proveedor", "Proveedor"],
  ];

  return (
    <div className="export-page">
      <header className="export-header">
        <div>
          <h1>Exportar requisiciones</h1>
          <nav aria-label="Ruta de navegación" className="export-breadcrumb">
            <Link to="/requisiciones">Requisiciones</Link><FiChevronRight aria-hidden="true" /><span>Exportar</span>
          </nav>
        </div>
        <div className="export-header-actions">
          <span className="export-format"><span /> Excel · .xlsx</span>
          <Link className="export-button" to="/requisiciones/ayuda"><FiHelpCircle /> Ayuda</Link>
        </div>
      </header>

      <div className="export-tabs" role="group" aria-label="Tipo de exportación">
        {[["todas", "Todas"], ["rango", "Por fecha"], ["folio", "Por folio"]].map(([valor, texto]) => (
          <button key={valor} type="button" aria-pressed={modoExportacion === valor} className={modoExportacion === valor ? "is-active" : ""} onClick={() => setModoExportacion(valor)}>
            {texto}{valor === "todas" && <span>{numero(requisiciones.length)}</span>}
          </button>
        ))}
      </div>

      <div className="export-toolbar">
        <div className="export-filters">
          <label className="export-select"><FiFilter aria-hidden="true" /><select aria-label="Filtrar por status" value={statusFiltro} onChange={(e) => setStatusFiltro(e.target.value)}><option value="">Todos los status</option>{statusDisponibles.map((status) => <option key={status} value={status}>{formatearStatusRequisicion(status)}</option>)}</select></label>
          {modoExportacion === "rango" && <div className="export-date-range"><FiCalendar aria-hidden="true" /><input aria-label="Fecha inicial de creación" type="date" value={fechaInicio} max={fechaFin || undefined} onChange={(e) => setFechaInicio(e.target.value)} /><span>—</span><input aria-label="Fecha final de creación" type="date" value={fechaFin} min={fechaInicio || undefined} onChange={(e) => setFechaFin(e.target.value)} /></div>}
          {modoExportacion === "folio" && <label className="export-folio"><FiSearch aria-hidden="true" /><input aria-label="Buscar por folio" placeholder="Buscar folio, ej. C26-00001" value={folio} onChange={(e) => setFolio(e.target.value)} /></label>}
          {(modoExportacion !== "todas" || statusFiltro) && <button className="export-clear" type="button" onClick={limpiar}>Limpiar filtros</button>}
        </div>
        <div className="export-toolbar-actions">
          <button className="export-button export-refresh" type="button" title="Actualizar requisiciones" aria-label="Actualizar requisiciones" disabled={cargando} onClick={obtenerRequisiciones}><FiRefreshCw className={cargando ? "animate-spin" : ""} /></button>
          <button className="export-button export-download" type="button" disabled={!puedeExportar} onClick={exportar}><FiDownload /> Exportar a Excel</button>
        </div>
      </div>
      {modoExportacion === "rango" && <p className="export-filter-note">El rango corresponde a la fecha de creación de las requisiciones.</p>}
      {rangoInvalido && <p className="export-error" role="alert">La fecha inicial debe ser anterior o igual a la fecha final.</p>}
      {error && <div className="export-error" role="alert">{error}<button type="button" onClick={obtenerRequisiciones}>Reintentar</button></div>}

      <div aria-busy={cargando}>
        <section className="export-metrics" aria-label="Resumen de la selección">
          {metricas.map((metrica) => {
            const Icono = metrica.Icono;
            return <div className="export-metric" key={metrica.titulo}><div className="export-metric-label"><Icono aria-hidden="true" />{metrica.titulo}</div><div className="export-metric-value">{cargando ? "—" : numero(metrica.valor)}<span>{metrica.detalle}</span></div></div>;
          })}
        </section>

        <section className="export-chart-panel" aria-labelledby="export-chart-title">
          <div className="export-chart-heading">
            <div><h2 id="export-chart-title"><FiActivity />Requisiciones por fecha</h2><div className="export-chart-total">{cargando ? "—" : numero(total)}<span>en la selección</span></div></div>
            <a className="export-view-table" href="#export-preview">Ver registros <FiChevronRight /></a>
          </div>
          <div className="export-chart-meta"><p>{grafica.dias[0].etiqueta} – {grafica.dias.at(-1).etiqueta} · {grafica.dias.at(-1).key.slice(0, 4)} · Fecha de creación</p><div className="export-chart-legend"><span><i className="selection-dot" />Selección</span><button type="button" aria-pressed={verDisponibles} onClick={() => setVerDisponibles(!verDisponibles)} className={!verDisponibles ? "is-muted" : ""}><i />Disponibles</button></div></div>
          <div className="export-chart-scroll">
            <svg className="export-chart" viewBox="0 0 976 210" role="img" aria-label={`Requisiciones creadas por día: selección y disponibles. Del ${grafica.dias[0].etiqueta} al ${grafica.dias.at(-1).etiqueta}.`} onMouseLeave={() => setPuntoActivo(null)}>
              <title>Requisiciones por fecha de creación</title>
              <desc>{grafica.dias.map((d) => `${d.etiqueta}: ${d.seleccion} seleccionadas, ${d.disponibles} disponibles`).join(". ")}</desc>
              {[0, 1, 2, 3, 4].map((i) => <g key={i}><line x1="48" x2="952" y1={172 - i * 36} y2={172 - i * 36} stroke="#e9e9eb" strokeDasharray="2 4" /><text x="31" y={176 - i * 36} textAnchor="end" fill="#73737c" fontSize="12">{numero(i * grafica.paso)}</text></g>)}
              {verDisponibles && <path d={crearLinea(grafica.dias.map((d) => d.disponibles), grafica.maximo)} fill="none" stroke="#c7c7cb" strokeWidth="1.6" />}
              <path d={crearLinea(grafica.dias.map((d) => d.seleccion), grafica.maximo)} fill="none" stroke="#ed623e" strokeWidth="2" />
              {grafica.dias.map((d, i) => <g key={d.key}><text x={48 + i * 904 / 13} y="198" textAnchor="middle" fill="#71717a" fontSize="12">{d.etiqueta}</text><rect x={48 + i * 904 / 13 - 24} y="12" width="48" height="164" fill="transparent" onMouseEnter={() => setPuntoActivo(i)}><title>{`${fecha(`${d.key}T12:00:00Z`)}: ${d.seleccion} seleccionadas / ${d.disponibles} disponibles`}</title></rect></g>)}
              {puntoActivo !== null && <g pointerEvents="none"><line x1={48 + puntoActivo * 904 / 13} x2={48 + puntoActivo * 904 / 13} y1="20" y2="172" stroke="#e4a28f" strokeDasharray="3 3" /><circle cx={48 + puntoActivo * 904 / 13} cy={172 - grafica.dias[puntoActivo].seleccion / grafica.maximo * 144} r="4" fill="#ed623e" stroke="white" strokeWidth="2" /><rect x={Math.min(782, Math.max(48, 48 + puntoActivo * 904 / 13 - 72))} y="2" width="170" height="28" rx="5" fill="#292930" /><text x={Math.min(782, Math.max(48, 48 + puntoActivo * 904 / 13 - 72)) + 85} y="19" fill="white" fontSize="12" textAnchor="middle">{grafica.dias[puntoActivo].etiqueta}: {grafica.dias[puntoActivo].seleccion} seleccionadas</text></g>}
            </svg>
          </div>
          <p className="export-chart-footnote">Últimos 14 días del periodo mostrado. Disponibles incluye todas las requisiciones creadas en esas mismas fechas.</p>
        </section>

        <section className="export-table-panel" id="export-preview" aria-labelledby="export-table-title">
          <div className="export-table-heading"><h2 id="export-table-title">Vista previa <span>{numero(total)}</span></h2><span className="export-table-note"><FiCheckCircle /> 2 hojas: Requisiciones y Artículos</span></div>
          <div className="export-table-scroll"><table className="export-table"><thead><tr>{columnas.map(([campo, titulo]) => <th key={campo} scope="col" aria-sort={orden.campo === campo ? orden.ascendente ? "ascending" : "descending" : "none"}><button type="button" onClick={() => cambiarOrden(campo)}>{titulo}{orden.campo === campo ? orden.ascendente ? <FiArrowUp /> : <FiArrowDown /> : <FiChevronsDown />}</button></th>)}</tr></thead><tbody>
            {cargando ? <tr><td colSpan="6" className="export-table-empty"><FiRefreshCw className="animate-spin" /> Cargando requisiciones…</td></tr>
              : error ? <tr><td colSpan="6" className="export-table-empty">No se pudo actualizar la información. Intenta de nuevo.</td></tr>
              : filas.length === 0 ? <tr><td colSpan="6" className="export-table-empty"><FiSearch />{modoExportacion === "rango" && (!fechaInicio || !fechaFin) ? "Selecciona ambas fechas para consultar las requisiciones." : modoExportacion === "folio" && !folio.trim() ? "Escribe un folio para consultar las requisiciones." : "No hay requisiciones con los filtros seleccionados."}</td></tr>
              : filas.map((req) => <tr key={req.id || req.folio}><td><div className="export-person"><AvatarIniciales nombre={solicitante(req)} size={30} /><div><span>{solicitante(req)}</span><small>{req.area || "Sin área"}</small></div></div></td><td className="export-folio-cell">{req.folio || "Sin folio"}</td><td className="export-date-cell">{fecha(req.fechaHora)}</td><td><span className={`export-status ${["concluida", "autorizada"].includes(req.status) ? "is-green" : ["rechazada", "cancelada"].includes(req.status) ? "is-red" : normalizarStatusRequisicion(req.status) === "esperando autorizacion" ? "is-amber" : "is-neutral"}`}><i />{formatearStatusRequisicion(req.status) || "Sin status"}</span></td><td className="export-number-cell">{numero(req.articulos?.length)}</td><td>{req.proveedor || <span className="export-no-data">Sin asignar</span>}</td></tr>)}
          </tbody></table></div>
          <footer className="export-table-footer"><span>{total === 0 ? "0 registros" : `${numero(inicio + 1)}–${numero(Math.min(inicio + 8, total))} de ${numero(total)} requisiciones`}<small>La descarga incluye todos los resultados filtrados.</small></span><div className="export-pagination"><button type="button" className="export-button" aria-label="Página anterior" disabled={pagina <= 1 || cargando} onClick={() => setPaginacion({ pagina: pagina - 1, datos: requisicionesFiltradas })}><FiChevronLeft /></button><span>{pagina} / {paginas}</span><button type="button" className="export-button" aria-label="Página siguiente" disabled={pagina >= paginas || cargando} onClick={() => setPaginacion({ pagina: pagina + 1, datos: requisicionesFiltradas })}><FiChevronRight /></button></div></footer>
        </section>
      </div>
    </div>
  );
};

export default ExportarRequisiciones;
