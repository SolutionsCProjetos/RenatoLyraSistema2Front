import React from 'react';

const ConfirmationModal = ({ show, onClose, onConfirm, descricao }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Confirmar Exclusão</h2>
                <p>Tem certeza que deseja deletar este(a) {descricao}?</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-800 py-2 px-4 rounded mr-2"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white py-2 px-4 rounded"
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
