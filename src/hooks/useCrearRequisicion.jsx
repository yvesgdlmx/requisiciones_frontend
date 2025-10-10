import { useContext } from "react";
import CrearRequisicionContext from "../context/CrearRequisicionProvider";
const useCrearRequisicion = () => {
  return useContext(CrearRequisicionContext);
};
export default useCrearRequisicion;