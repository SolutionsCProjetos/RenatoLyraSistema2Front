import React from 'react';

const RecuperarModal = ({ isOpen, token, onCopy, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Token</h2>
                <p className="mb-4">Token de recuperação:</p>
                <div className="bg-gray-100 p-2 rounded mb-6">
                    <span className="text-sm text-gray-700">{token}</span>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={onCopy}
                        className="bg-cyan-900 text-white py-2 px-4 rounded hover:bg-cyan-950 transition-colors duration-200"
                    >
                        Copiar
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 transition-colors duration-200"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RecuperarModal;
