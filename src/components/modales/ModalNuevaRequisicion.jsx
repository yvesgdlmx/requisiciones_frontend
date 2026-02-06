import React from "react";
import Modal from "react-modal";
import FormNuevaRequisicion from "../formularios/FormNuevaRequisicion";

const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

Modal.setAppElement("#root");

const ModalNuevaRequisicion = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Nueva Requisición"
      overlayClassName="fixed inset-0 flex justify-center items-center z-50 p-4"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" } }}
      className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl outline-none overflow-hidden flex flex-col max-h-full mx-4"
    >
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">Creando requisición...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Header verde estilo admin */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 sm:p-6 flex justify-between items-center text-white">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold">Nueva Requisición</h2>
              <p className="text-xs sm:text-sm opacity-90">
                Completa el formulario para crear una nueva solicitud
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 py-1 px-2.5 rounded-full transition"
            >
              ✕
            </button>
          </div>

          {/* Body con scroll */}
          <div className="p-4 sm:p-6 overflow-y-auto">
            <FormNuevaRequisicion 
              onClose={onClose} 
              setModalLoading={setIsLoading}
            />
          </div>
        </>
      )}
    </Modal>
  );
};

export default ModalNuevaRequisicion;