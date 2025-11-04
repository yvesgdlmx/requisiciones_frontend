import { useContext } from "react";
import NotificacionesContext from "../context/NotificacionesProvider";

const useNotificaciones = () => {
  return useContext(NotificacionesContext);
};

export default useNotificaciones;