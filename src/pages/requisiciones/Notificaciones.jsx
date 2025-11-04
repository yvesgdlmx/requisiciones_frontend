import React from 'react';
import {
  FiBell,
  FiClock,
  FiTrash2,
  FiSearch
} from 'react-icons/fi';
import useAuth from '../../hooks/useAuth';
import useNotificaciones from '../../hooks/useNotificaciones';

const Notificaciones = () => {
  const { auth } = useAuth();

  const {
    notificaciones,
    notificacionesFiltradas,
    totalNoLeidas,
    cargando,
    error,
    busqueda,
    setBusqueda,
    deletingId,
    marcarYIr,
    handleEliminarNotificacion,
    obtenerIcono,
    obtenerColorStatus,
    formatearFecha
  } = useNotificaciones();

  if (cargando) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center p-8 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <FiBell className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-600">Notificaciones</h1>
              <p className="text-gray-500 mt-1">
                {auth.rol === 'admin' || auth.rol === 'superadmin'
                  ? 'Mantente al día con las nuevas requisiciones y actualizaciones del sistema'
                  : 'Mantente al día con las actualizaciones de tus requisiciones'
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              {notificaciones.length} Notificaciones
            </p>
            {totalNoLeidas > 0 && (
              <p className="text-sm text-blue-600 font-medium">
                {totalNoLeidas} sin leer
              </p>
            )}
          </div>
        </div>

        <div className="p-8 border-b border-gray-200">
          <div className="relative max-w-md">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por requisición o mensaje..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="p-8">
          {notificacionesFiltradas.length === 0 ? (
            <div className="text-center py-16">
              <FiBell className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No hay notificaciones
              </h3>
              <p className="text-gray-500">
                {busqueda
                  ? 'No hay notificaciones que coincidan con tu búsqueda'
                  : 'Las notificaciones aparecerán aquí cuando haya actualizaciones'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {notificacionesFiltradas.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => marcarYIr(n)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      marcarYIr(n);
                    }
                  }}
                  className={`cursor-pointer flex items-start justify-between p-6 transition-all rounded-xl border ${
                    !n.leida
                      ? 'bg-blue-50/50 border-blue-200 shadow-sm'
                      : 'bg-white border-gray-200'
                  } hover:shadow-md hover:bg-gray-50`}
                >
                  <div className="flex items-start gap-5 flex-1">
                    <div className="mt-1">
                      {obtenerIcono(n.tipo)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        {!n.leida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {n.requisicion?.folio && (
                          <span className="text-sm font-semibold text-gray-900">
                            {n.requisicion.folio}
                          </span>
                        )}
                        {n.requisicion?.status && (
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${obtenerColorStatus(
                              n.requisicion.status
                            )}`}
                          >
                            {n.requisicion.status}
                          </span>
                        )}
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <FiClock className="w-4 h-4" />
                          {formatearFecha(n.fechaCreacion)}
                        </span>
                      </div>

                      <p className="text-gray-800 text-base mb-3 leading-relaxed">
                        {n.mensaje}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarNotificacion(n.id);
                      }}
                      disabled={deletingId === n.id}
                      className={`p-2 rounded-lg transition-colors ${
                        deletingId === n.id
                          ? 'text-gray-300 bg-red-50 cursor-wait'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title="Eliminar notificación"
                      aria-busy={deletingId === n.id}
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notificacionesFiltradas.length > 10 && (
          <div className="p-8 border-t border-gray-200 flex justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Cargar más notificaciones
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificaciones;