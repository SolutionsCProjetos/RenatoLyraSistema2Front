import React from "react";

function Mensagem({ successMessage, errorMessage, warningMessage }) {
  return (
    <div>
      {successMessage && (
        <div className="bg-green-100 border border-green-500 text-green-700 px-4 py-3 rounded absolute top-14 right-2" role="alert">
          <strong className="font-bold">Sucesso: </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}
      {errorMessage && (
        <div className="bg-red-100 border border-red-500 text-red-700 px-4 py-3 rounded absolute top-14 right-2" role="alert">
          <strong className="font-bold">Erro: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}
      {warningMessage && (
        <div className="bg-yellow-100 border border-yellow-500 text-yellow-700 px-4 py-3 rounded absolute top-14 right-2" role="alert">
          <strong className="font-bold">Aviso: </strong>
          <span className="block sm:inline">{warningMessage}</span>
        </div>
      )}
    </div>
  );
}

export default Mensagem;
