import { useContext } from "react";
import AutorizacionContext from "../context/AutorizacionProvider";
const useAutorizacion = () => {
  return useContext(AutorizacionContext);
};
export default useAutorizacion;