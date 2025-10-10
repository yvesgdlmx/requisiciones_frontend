import React from "react";
import Modal from "react-modal";
import FormNuevaRequisicion from "../formularios/FormNuevaRequisicion";
// Configuración de react-modal.
Modal.setAppElement("#root");
const ModalNuevaRequisicion = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Nueva Requisición"
      overlayClassName="fixed inset-0 flex justify-center items-center"
      style={{ overlay: { backgroundColor: "rgba(0, 0, 0, 0.42)" } }}
      className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-xl outline-none mx-4 max-h-[90vh] overflow-y-auto"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-500 text-center">
        Nueva Requisición
      </h2>
      {/* Se renderiza el formulario y se le pasa la función onClose */}
      <FormNuevaRequisicion onClose={onClose} />
    </Modal>
  );
};
export default ModalNuevaRequisicion;