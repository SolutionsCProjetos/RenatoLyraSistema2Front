import React from 'react';

const ConfirmLogoutModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute mt-20 w-full inset-0 flex items-center justify-center bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl h-44 w-72">
                <h2 className="text-lg font-semibold mb-4">Confirmação de Logout</h2>
                <p className="mb-6">Você realmente quer sair?</p>
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded mr-2 hover:bg-gray-600 transition-colors duration-200"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-800 text-white py-2 px-4 rounded hover:bg-red-900 transition-colors duration-200"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmLogoutModal;
