import React, { useEffect, useState } from "react";
import { instance1 } from "../../../api/axios";

const WhatsAppQR = () => {
    const [qrCode, setQrCode] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

    useEffect(() => {
        const fetchQrCode = async () => {
            try {
                const response = await instance1.get("/qrcode");
                if (response.data.qr) {
                    setQrCode(response.data.qr); // Armazena o QR Code em base64
                } else {
                    console.log(response.data.message);
                }
            } catch (error) {
                console.error("Erro ao buscar QR Code:", error);
            }
        };

        fetchQrCode();

        // Atualiza o QR Code a cada 5 segundos
        const interval = setInterval(fetchQrCode, 5000);

        return () => clearInterval(interval); // Limpa o intervalo ao desmontar
    }, []);

    const handleOpenModal = () => setIsModalOpen(true); // Abrir modal
    const handleCloseModal = () => setIsModalOpen(false); // Fechar modal

    return (
        <div className="p-4">
            {/* Botão para abrir o modal */}
            <button
                onClick={handleOpenModal}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            >
                Conectar WhatsApp
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
                        <h1 className="text-lg font-semibold text-center mb-4">
                            Escaneie o QR Code para conectar ao WhatsApp
                        </h1>
                        {qrCode ? (
                            <img
                                src={qrCode}
                                alt="QR Code para WhatsApp"
                                className="w-full h-auto mb-4"
                            />
                        ) : (
                            <p className="text-center text-gray-500">Aguardando QR Code...</p>
                        )}
                        <button
                            onClick={handleCloseModal}
                            className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition w-full"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WhatsAppQR;
