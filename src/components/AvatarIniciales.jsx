const colores = ["#489e78", "#bf8120", "#8581b5", "#588fba", "#c27b85", "#548f91"];

const AvatarIniciales = ({ nombre, size = 34 }) => {
  const texto = typeof nombre === "string" ? nombre.trim().replace(/\s+/g, " ") : "";
  const normalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const sinNombre = !texto || /^(sin (solicitante|usuario|comprador|nombre)|esperando comprador)$/i.test(texto);
  const hash = Array.from(normalizado).reduce((valor, letra) => ((valor * 31) + letra.codePointAt(0)) >>> 0, 0);
  const iniciales = sinNombre ? "?" : texto.split(" ").slice(0, 2).map((parte) => Array.from(parte)[0]).join("").toLocaleUpperCase("es-MX");

  return (
    <span
      aria-hidden="true"
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        width: size, height: size, borderRadius: "50%", backgroundColor: sinNombre ? "#94a3b8" : colores[hash % colores.length],
        color: "#fff", fontSize: Math.max(12, Math.round(size * 0.34)), fontWeight: 500, lineHeight: 1, letterSpacing: "0.02em",
      }}
    >
      {iniciales}
    </span>
  );
};

export default AvatarIniciales;
