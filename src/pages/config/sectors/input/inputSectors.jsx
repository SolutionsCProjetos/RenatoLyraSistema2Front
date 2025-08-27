import React, { useEffect, useState } from "react";
import { instance1 } from "../../../../api/axios";
import CheckList from "../../../checkList";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { BotaoGravar, BotaoVoltar } from "../../../../components/Butons";

export default function InputSector() {
    const [setor, setSetor] = useState("");
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage  } = useMensagem();

    const clearForm = () => {
        setSetor("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!setor.trim()) {
          showWarningMessage("O setor é obrigatório.");
          return;
        }
    
        try {
          const setorData = {
            setor
          };
          const response = await instance1.post("/setor", setorData);
    
          showSuccessMessage(response.data.message || "Setor cadastrado com sucesso!");
          clearForm();
        } catch (error) {
          if (error.response && error.response.data) {
            showErrorMessage(error.response.data.message || "Erro ao cadastrar o setor.");
          } else {
            showErrorMessage("Erro ao enviar os dados. Por favor, tente novamente.");
          }
        }
    };

    return (
        <>
            <form >
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
                    <div className="grid grid-cols-1 gap-4 ml-2">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Setor</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4 mx-2">
                        <CheckList
                            types="text"
                            descricao="Setor:"
                            placeholderInput="Financeiro"
                            value={setor}
                            onChange={(value) => setSetor(value)}
                            menssagemError=""
                        />
                    </div>
                    <div className="flex flex-row justify-end">
                        <BotaoGravar onClick={handleSubmit}/>
                        <BotaoVoltar />
                    </div> 
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    )
}
