import React, { useState } from "react";
import axios from "axios"; // Biblioteca para realizar requisições HTTP

const WhatsAppTest = () => {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  // Instância do Axios para facilitar as requisições
  const api = axios.create({
    baseURL: "http://localhost:3001", // Altere para o endereço do backend
  });

  // Verificar o status da conexão
  const checkStatus = async () => {
    try {
      const response = await api.get("/status");
      setStatus(response.data.status); // Atualiza o status exibido no frontend
      alert(`Status do cliente: ${response.data.status}`);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
      alert("Erro ao verificar o status. Veja o console para detalhes.");
    }
  };

  // Enviar mensagem de teste
  const sendMessage = async () => {
    if (!phone || !message) {
      alert("Por favor, insira o número de telefone e a mensagem.");
      return;
    }

    try {
      const response = await api.post("/send-test", { phone, message });
      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      alert("Erro ao enviar mensagem. Verifique o console para detalhes.");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão WhatsApp</h1>
      <button
        onClick={checkStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition mb-4"
      >
        Verificar Conexão
      </button>
      {status && <p className="text-lg font-medium mb-4">Status: {status}</p>}

      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Enviar Mensagem de Teste</h2>
        <input
          type="text"
          placeholder="Número de telefone (com código do país)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Digite sua mensagem"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition"
        >
          Enviar Mensagem
        </button>
      </div>
    </div>
  );
};

export default WhatsAppTest;
