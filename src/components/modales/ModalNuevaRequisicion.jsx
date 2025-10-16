import React from "react";
import Modal from "react-modal";
import FormNuevaRequisicion from "../formularios/FormNuevaRequisicion";

// Componente Spinner personalizado
const LoadingSpinner = () => (
  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
);

// Configuración de react-modal.
Modal.setAppElement("#root");

const ModalNuevaRequisicion = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Nueva Requisición"
      overlayClassName="fixed inset-0 flex justify-center items-center"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.42)" } }}
      className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl outline-none mx-4 max-h-[90vh] overflow-y-auto relative"
    >
      {isLoading ? (
        // Cuando está cargando, mostrar solo el spinner
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-center">
            <LoadingSpinner />
            <p className="text-gray-600 font-medium mt-4">Creando requisición...</p>
          </div>
        </div>
      ) : (
        // Cuando no está cargando, mostrar el contenido normal
        <>
          <h2 className="text-2xl font-bold mb-6 text-gray-500 text-center">
            Nueva Requisición
          </h2>
          <FormNuevaRequisicion 
            onClose={onClose} 
            setModalLoading={setIsLoading}
          />
        </>
      )}
    </Modal>
  );
};

export default ModalNuevaRequisicion;