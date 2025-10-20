import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import MaquinaDeEscribir from "../../components/funciones/MaquinaDeEscribir";
import Alerta from "../../components/funciones/Alerta";
import clienteAxios from "../../config/clienteAxios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alerta, setAlerta] = useState({});

  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if ([email, password].includes("")) {
      setAlerta({
        msg: "Todos los campos son obligatorios",
      });
      return;
    }
    try {
      const { data } = await clienteAxios.post("/usuarios/login", {
        email,
        password,
      });
      if (data.token) {
        localStorage.setItem("token", data.token);
        setAuth(data);
        navigate("/requisiciones");
      } else {
        setAlerta({ msg: "No se recibió token del servidor" });
      }
    } catch (error) {
      console.error(error?.response?.data || error.message);
      setAlerta({
        msg: error?.response?.data?.msg || "Credenciales incorrectas",
      });
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('/img/abstract_wave1.jpg')" }}
    >
      <div className="flex w-11/12 max-w-md md:max-w-5xl h-auto md:h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        <aside className="hidden md:flex flex-col justify-between w-1/2 p-10 bg-white/8 backdrop-blur-md border-r border-white/30 text-white">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-34 h-12 rounded-lg bg-white/10 border border-white/20">
                <img src="/img/logo_real.png" alt="" />
              </div>
              <div>
                <h3 className="text-xl font-bold leading-tight">
                  Laboratorio Optimex
                </h3>
                <p className="text-sm text-gray-200/90">
                  Sistema de gestión de requisiciones
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <h1 className="text-4xl font-extrabold tracking-tight leading-snug mb-4">
              Simplifica procesos, mejora resultados
            </h1>
            <p className="text-lg text-gray-200/80 mb-6">
              Administra tus compras con{" "}
              <span className="text-indigo-300 font-medium">
                <MaquinaDeEscribir />
              </span>
            </p>
          </div>
          <div className="text-sm text-gray-300/70 border-t border-white/10 pt-4">
            © {new Date().getFullYear()} Laboratorio Optimex · Todos los
            derechos reservados
          </div>
        </aside>
        <main className="w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-10">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-600 mb-2 text-center">
              Bienvenido(a)
            </h2>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Inicia sesión para continuar en el panel de control
            </p>
            {alerta.msg && <Alerta alerta={alerta} />}
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block">
                <span className="text-xs font-medium text-gray-700">
                  Correo electrónico
                </span>
                <input
                  type="email"
                  required
                  aria-label="Correo electrónico"
                  placeholder="correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full p-3 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium text-gray-700">
                  Contraseña
                </span>
                <input
                  type="password"
                  required
                  aria-label="Contraseña"
                  placeholder="●●●●●●●●"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2 w-full p-3 border border-gray-200 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              <button
                type="submit"
                className="w-full py-3 mt-2 bg-indigo-700 text-white rounded-md font-medium hover:bg-indigo-800 transition"
              >
                Iniciar sesión
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};
export default Login;
