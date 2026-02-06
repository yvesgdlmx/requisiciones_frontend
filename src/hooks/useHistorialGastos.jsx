import { useContext } from "react";
import HistorialGastosContext from "../context/HistorialGastosProvider";

const useHistorialGastos = () => {
  return useContext(HistorialGastosContext);
};

export default useHistorialGastos;