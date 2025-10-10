import React, { useEffect, useState } from "react";
const palabras = ["estrategia.", "control.", "eficiencia."];
function MaquinaDeEscribir() {
  const [indicePalabra, setIndicePalabra] = useState(0);
  const [textoActual, setTextoActual] = useState("");
  const [borrando, setBorrando] = useState(false);
  const velocidad = 120;
  useEffect(() => {
    let temporizador;
    const palabraActual = palabras[indicePalabra];
    if (!borrando) {
      // Escribir letra a letra
      if (textoActual.length < palabraActual.length) {
        temporizador = setTimeout(
          () => setTextoActual(palabraActual.slice(0, textoActual.length + 1)),
          velocidad
        );
      } else {
        // Esperar antes de borrar
        temporizador = setTimeout(() => setBorrando(true), 1100);
      }
    } else {
      // Borrado de forma más rápida
      if (textoActual.length > 0) {
        temporizador = setTimeout(
          () => setTextoActual(palabraActual.slice(0, textoActual.length - 1)),
          Math.floor(velocidad / 2)
        );
      } else {
        // Pasar a la siguiente palabra
        temporizador = setTimeout(() => {
          setBorrando(false);
          setIndicePalabra((i) => (i + 1) % palabras.length);
        }, 400);
      }
    }
    return () => clearTimeout(temporizador);
  }, [textoActual, borrando, indicePalabra]);
  return (
    <span className="font-semibold text-indigo-300">
      {textoActual}
      <span className="inline-block ml-1 animate-pulse"></span>
    </span>
  );
}
export default MaquinaDeEscribir;