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
import { CategoriasProvider } from "./context/CategoriasProvider";
import { HistorialGastosProvider } from "./context/HistorialGastosProvider";
import { HistorialStatusProvider } from "./context/HistorialStatusProvider";
import { ExportarRequisicionesProvider } from "./context/ExportarRequisicionesProvider";

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
const ListadoCategorias = lazy(() =>
  import("./pages/categorias/ListadoCategorias")
);
const HistorialGastos = lazy(() =>
  import("./pages/categorias/HistorialGastos")
);
const HistorialStatus = lazy(() =>
  import("./pages/requisiciones/HistorialStatus")
);
const ExportarRequisiciones = lazy(() =>
    import("./pages/requisiciones/ExportarRequisiciones")
)

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Cargando...</div>}>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
            </Route>

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
                      <CategoriasProvider>
                        <TodasRequisiciones />
                      </CategoriasProvider>
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

              <Route path="notificaciones" element={<Notificaciones />} />

              <Route
                path="registrar"
                element={
                  <RoleProtectedRoute allowedRoles={["admin"]}>
                    <Registrar />
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="categorias"
                element={
                  <RoleProtectedRoute allowedRoles={["superadmin"]}>
                    <CategoriasProvider>
                      <ListadoCategorias />
                    </CategoriasProvider>
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="historial-gastos"
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <HistorialGastosProvider>
                      <HistorialGastos />
                    </HistorialGastosProvider>
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="historial-status"
                element={
                  <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <HistorialStatusProvider>
                      <HistorialStatus />
                    </HistorialStatusProvider>
                  </RoleProtectedRoute>
                }
              />

              <Route
                path="exportar-requisiciones"
                element={
                    <RoleProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <ExportarRequisicionesProvider>
                        <ExportarRequisiciones />
                    </ExportarRequisicionesProvider>
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
