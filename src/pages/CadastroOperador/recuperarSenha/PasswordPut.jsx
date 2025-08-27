import React, { useState } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoAtualizar } from "../../../components/Butons";

export default function PassPut() {
    const [token, setToken] = useState('');
    const [senha, setSenha] = useState('');
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await instance1.put(`/token`, {
                token,
                novaSenha: senha,  // Corrigido para usar o estado 'senha'
            });
            showSuccessMessage(response.data.message || 'Senha atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao enviar os dados: ', error);
            if (error.response && error.response.data) {
                showWarningMessage(error.response.data.message || 'Erro ao atualizar senha.');
            } else {
                showErrorMessage('Erro ao tentar a conexão com o banco!');
            }
        } 
    };

    return (  // Corrigido para retornar o JSX
        <>
            <form>
            <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
                <div className="grid grid-cols-1 gap-4 ml-4 mt-2">
                    <h2 className="text-2xl text-black underline col-start-1 row-start-1">Recuperação de senha</h2>
                </div>
                <div className="grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4 mt-4 ml-4 mr-4">
                    <CheckList
                        types="text"
                        descricao="Token:"
                        placeholderInput="Token"
                        value={token}
                        onChange={setToken}
                        menssagemError=""
                    />
                    <CheckList
                        types="password"
                        descricao="Nova senha:"
                        placeholderInput="*******"
                        value={senha}
                        onChange={setSenha}
                        menssagemError=""
                    />
                </div>
                <div className="flex flex-row justify-end mx-2">
                    <BotaoAtualizar onClick={handleSubmit} />
                </div>
            </div>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
            </form>
        </>
    );
}