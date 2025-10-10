import { useContext } from "react";
import TodasRequisicionesContext from "../context/TodasRequisicionesProvider";
const useTodasRequisiciones = () => {
  return useContext(TodasRequisicionesContext);
};
export default useTodasRequisiciones;