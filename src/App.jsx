import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import AuthLayout from "./layouts/AuthLayout";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import { MisRequisicionesProvider } from "./context/MisRequisicionesProvider";
import { TodasRequisicionesProvider } from "./context/TodasRequisicionesProvider";
import { AutorizacionProvider } from "./context/AutorizacionProvider";
import { CrearRequisicionProvider } from "./context/CrearRequisicionProvider";
import { NotificacionesProvider } from "./context/NotificacionesProvider";

// Carga perezosa de los layouts y páginas
const LayoutProtegido = lazy(() => import("./layouts/LayoutProtegido"));
const Login = lazy(() => import("./pages/perfil/Login"));
const MisRequisiciones = lazy(() =>
  import("./pages/requisiciones/MisRequisiciones")
);
const TodasRequisiciones = lazy(() =>
  import("./pages/requisiciones/TodasRequisiciones")
);
const EnAutorizacion = lazy(() =>
  import("./pages/requisiciones/EnAutorizacion")
);
const Registrar = lazy(() => import("./pages/perfil/Registrar"));
const Notificaciones = lazy(() =>
  import("./pages/requisiciones/Notificaciones")
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>
            {/* ✅ ENVUELVE LayoutProtegido con NotificacionesProvider */}
            <Route 
              path="/requisiciones" 
              element={
                <NotificacionesProvider>
                  <LayoutProtegido />
                </NotificacionesProvider>
              }
            >
              <Route
                index
                element={
                  <MisRequisicionesProvider>
                    <CrearRequisicionProvider>
                      <MisRequisiciones />
                    </CrearRequisicionProvider>
                  </MisRequisicionesProvider>
                }
              />
              <Route
                path="todas-requisiciones"
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <TodasRequisicionesProvider>
                      <TodasRequisiciones />
                    </TodasRequisicionesProvider>
                  </RoleProtectedRoute>
                }
              />
              <Route
                path="en-autorizacion"
                element={
                  <RoleProtectedRoute allowedRoles={["superadmin"]}>
                    <AutorizacionProvider>
                      <EnAutorizacion />
                    </AutorizacionProvider>
                  </RoleProtectedRoute>
                }
              />
              {/* ✅ QUITA NotificacionesProvider de aquí ya que está arriba */}
              <Route
                path="notificaciones"
                element={<Notificaciones />}
              />
              <Route
                path="registrar"
                element={
                  <RoleProtectedRoute allowedRoles={["admin"]}>
                    <Registrar />
                  </RoleProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/requisiciones" />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;