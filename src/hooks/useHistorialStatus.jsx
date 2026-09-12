import { useContext } from "react";
import HistorialStatusContext from "../context/HistorialStatusProvider";

const useHistorialStatus = () => {
  return useContext(HistorialStatusContext);
};

export default useHistorialStatus;
