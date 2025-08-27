import React from 'react';

const ModalInfor = ({ show, onClose, user }) => {
    if (!show) {
        return null;
    }

    const getSaudacao = () => {
        const horaAtual = new Date().getHours();
        if (horaAtual < 12) {
            return `Olá ${user.nome}, Bom dia!`;
        } else if (horaAtual < 18) {
            return `Olá ${user.nome}, Boa tarde!`;
        } else {
            return `Olá ${user.nome}, Boa noite!`;
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-blue-100 p-4 rounded shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Operações atrasadas!</h2>
                <p>{getSaudacao()} Você tem atividades atrasadas, atualize a data para solução da pendência ou encerre a operação. Agradecemos!</p>
                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="bg-blue-950 text-white py-2 px-4 rounded mr-2"
                    >
                        Entendido!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalInfor;
