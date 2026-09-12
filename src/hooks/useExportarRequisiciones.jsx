import { useContext } from "react";
import ExportarRequisicionesContext from "../context/ExportarRequisicionesProvider";

const useExportarRequisiciones = () => {
    return useContext(ExportarRequisicionesContext);
};

export default useExportarRequisiciones;
