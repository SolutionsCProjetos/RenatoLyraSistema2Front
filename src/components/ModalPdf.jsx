import React from "react";

function ModalPdf({ isOpen, onClose, onSubmit, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="bg-gray-500 text-white p-2 mr-2">
            Cancelar
          </button>
          <button onClick={onSubmit} className="bg-green-500 text-white p-2">
            Gerar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModalPdf;
