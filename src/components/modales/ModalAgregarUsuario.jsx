import React, { useState, useEffect } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const camposIniciales = {
  nombre: "",
  apellido: "",
  area: "",
  rol: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const ModalAgregarUsuario = ({
  isOpen,
  onRequestClose,
  onSubmit,
  usuarioInicial = null,
  modo = "agregar"
}) => {
  const [form, setForm] = useState(camposIniciales);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (usuarioInicial) {
      setForm({
        ...usuarioInicial,
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm(camposIniciales);
    }
    setError("");
  }, [usuarioInicial, isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.nombre ||
      !form.apellido ||
      !form.area ||
      !form.rol ||
      !form.email ||
      (modo === "agregar" && (!form.password || !form.confirmPassword)) ||
      (modo === "editar" && form.password && !form.confirmPassword)
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }
    // Validar confirmación de contraseña si se está cambiando
    if ((modo === "agregar" || (modo === "editar" && form.password)) && form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    // Solo enviar password si se cambió
    const { confirmPassword, ...usuarioData } = form;
    if (modo === "editar" && !usuarioData.password) {
      delete usuarioData.password;
    }
    onSubmit(usuarioData);
    setForm(camposIniciales);
    setError("");
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel={modo === "agregar" ? "Agregar Usuario" : "Editar Usuario"}
      overlayClassName="fixed inset-0 flex justify-center items-center"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.42)" } }}
      className="w-full max-w-lg p-0 bg-transparent rounded-lg shadow-xl outline-none mx-4 max-h-[90vh] overflow-y-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-lg mx-auto border border-gray-200 w-full"
        autoComplete="off"
      >
        <header className="mb-8 pb-2">
          <h2 className="text-2xl font-bold text-gray-500 text-center mb-2">
            {modo === "agregar" ? "Agregar Usuario" : "Editar Usuario"}
          </h2>
          <p className="text-gray-500 text-center">
            {modo === "agregar"
              ? "Ingresa la información para crear un nuevo usuario."
              : "Modifica la información del usuario."}
          </p>
        </header>
        <section className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={form.nombre}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={form.apellido}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Área
              </label>
              <input
                type="text"
                name="area"
                id="area"
                value={form.area}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                required
              />
            </div>
            <div>
              <label htmlFor="rol" className="block text-sm font-medium text-gray-700">
                Rol
              </label>
              <select
                name="rol"
                id="rol"
                value={form.rol}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
                required
              >
                <option value="">Selecciona un rol</option>
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="superadmin">Superadmin</option>
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition"
              required
            />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition pr-10"
                required={modo === "agregar"}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-9 right-3 text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M3 3l18 18" />
                  </svg>
                )}
              </button>
            </div>
            {(modo === "agregar" || (modo === "editar" && form.password)) && (
              <div className="relative">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmar Contraseña
                </label>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 block w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-300 transition pr-10"
                  required={modo === "agregar" || (modo === "editar" && form.password)}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute top-9 right-3 text-gray-500 hover:text-blue-600 focus:outline-none"
                >
                  {showConfirm ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95M6.873 6.872A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.293 5.95M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            )}
          </div>
        </section>
        {error && (
          <div className="mb-4 text-red-600 bg-red-100 p-2 rounded text-center text-sm">
            {error}
          </div>
        )}
        <footer className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onRequestClose}
            className="px-6 py-3 border rounded-md border-gray-400 text-gray-800 hover:bg-gray-100 transition duration-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          >
            {modo === "agregar" ? "Guardar" : "Actualizar"}
          </button>
        </footer>
      </form>
    </Modal>
  );
};

export default ModalAgregarUsuario;