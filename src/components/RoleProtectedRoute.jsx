import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { auth, cargando } = useAuth();
  if (cargando) return <div>Cargando...</div>;
  // Si el usuario tiene alguno de los roles permitidos, se renderiza el contenido
  if (allowedRoles.includes(auth.rol)) {
    return children;
  }
  
  // Si no tiene permisos, redirige al área de requisiciones (o a otra ruta que consideres)
  return <Navigate to="/requisiciones" />;
};
export default RoleProtectedRoute;