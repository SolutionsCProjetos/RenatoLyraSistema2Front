import React, { useEffect, useState } from "react";
import CheckList from "../../../checkList";
import { instance1 } from "../../../../api/axios";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { BotaoAtualizar, BotaoVoltar } from "../../../../components/Butons";
import { useParams } from "react-router-dom";

export default function InputSector() {
    const {id} = useParams();
    const [setor, setSetor] = useState("");
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage  } = useMensagem();

    useEffect(() => {
        const fetchCadastro = async () => {
          try {
            const response = await instance1.get(`/setor/${id}`);
            const data = response.data;
            setSetor(data.setor);
          } catch (error) {
            console.error("Erro ao buscar os dados do backend: ", error);
            showErrorMessage(error.response?.data?.message || 'Erro ao carregar dados do setor.');
          }
        };
        fetchCadastro();
      }, [id]);

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
          const response = await instance1.put(`/setor/${id}`, setorData);
          console.log(setorData);
          showSuccessMessage(response.data.message || "Setor atualizado com sucesso!");
        } catch (error) {
          if (error.response && error.response.data) {
            showErrorMessage(error.response.data.message || "Erro ao atualizar o setor.");
          } else {
            showErrorMessage("Erro ao enviar os dados. Por favor, tente novamente.");
          }
        }
    };

    return (
        <>
            <form >
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
                    <div className="grid grid-cols-1 gap-4 ml-2 mx-2">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Atualizador de setor</h2>
                    </div>
                    <div className="grid  gap-4 mx-2">
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
                        <BotaoAtualizar onClick={handleSubmit}/>
                        <BotaoVoltar />
                    </div> 
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    )
}
