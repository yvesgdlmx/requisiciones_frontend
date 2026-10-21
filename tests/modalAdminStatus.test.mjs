import { test } from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { build } from "esbuild";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

// Renderiza los selectores reales; sustituye servicios y el portal del modal.
const stubs = {
  "../../hooks/useAuth": "export default () => ({ auth: globalThis.usuarioPrueba });",
  "../../hooks/useCategorias": "export default () => ({ categoriasFiltradas: [] });",
  "react-modal": "const Modal = ({children}) => children; Modal.setAppElement = () => {}; export default Modal;",
  "@react-pdf/renderer": "export const PDFDownloadLink = () => null;",
  "../herramientasPDF/RequisicionPDF": "export default () => null;",
  "../cards/CardArticulo": "export default () => null;",
};
const compilado = await build({
  entryPoints: [new URL("../src/components/modales/ModalAdminDetalleRequisicion.jsx", import.meta.url).pathname.replace(/^\/(\w:)/, "$1")],
  bundle: true, write: false, format: "cjs", platform: "node", packages: "external",
  define: { "import.meta.env.VITE_BACKEND_URL": '""' },
  plugins: [{
    name: "dependencias-prueba",
    setup(builder) {
      builder.onResolve({ filter: /.*/ }, ({ path }) =>
        Object.hasOwn(stubs, path) ? { path, namespace: "prueba" } : undefined);
      builder.onLoad({ filter: /.*/, namespace: "prueba" }, ({ path }) => ({ contents: stubs[path] }));
    },
  }],
});
const modulo = { exports: {} };
new Function("require", "module", "exports", compilado.outputFiles[0].text)(
  createRequire(import.meta.url), modulo, modulo.exports);
const Modal = modulo.exports.default;

test("admin puede desplegar los siguientes status sin un rol guardado en localStorage", () => {
  globalThis.usuarioPrueba = { rol: "admin" };
  globalThis.localStorage = { getItem: () => null };
  try {
    const html = renderToStaticMarkup(React.createElement(Modal, {
      isOpen: true, requisicion: { status: "creada", archivos: [], articulos: [] },
    }));
    const selectores = [...html.matchAll(/<select([^>]*)>([\s\S]*?)<\/select>/g)]
      .filter(([, , opciones]) => opciones.includes('value="creada"'));
    assert.equal(selectores.length, 2, "Se verifican móvil y escritorio");
    for (const [, atributos, opciones] of selectores) {
      assert.doesNotMatch(atributos, /disabled/);
      assert.deepEqual([...opciones.matchAll(/<option[^>]*value="([^"]*)"/g)].map((opcion) => opcion[1]),
        ["creada", "cancelada", "esperando autorizacion", "aprobada"]);
    }
  } finally {
    delete globalThis.usuarioPrueba;
    delete globalThis.localStorage;
  }
});
