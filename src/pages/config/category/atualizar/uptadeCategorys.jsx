import React, { useEffect, useState } from "react";
import CheckList from "../../../checkList";
import { instance1 } from "../../../../api/axios";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { BotaoAtualizar, BotaoVoltar } from "../../../../components/Butons";
import { useParams } from "react-router-dom";

export default function PutCategorys() {
    const { id } = useParams();
    const [categoria, setCategoria] = useState("");
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    useEffect(() => {
        const fetchCadastro = async () => {
            try {
                const response = await instance1.get(`/categoria/${id}`);
                const data = response.data;
                setCategoria(data.categoria); // Ajuste aqui
            } catch (error) {
                console.error("Erro ao buscar os dados do backend: ", error);
                showErrorMessage(error.response?.data?.message || 'Erro ao carregar dados da categoria.');
            }
        };
        fetchCadastro();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!categoria.trim()) {
            showWarningMessage("A categoria é obrigatória.");
            return;
        }

        try {
            const categoriaData = { categoria };
            const response = await instance1.put(`/categoria/${id}`, categoriaData); // Ajuste aqui

            showSuccessMessage(response.data.message || "Categoria atualizada com sucesso!");

        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao atualizar a categoria.");
            } else {
                showErrorMessage("Erro ao enviar os dados. Por favor, tente novamente.");
            }
        }
    };

    return (
        <>
            <form>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
                    <div className="grid grid-cols-1 gap-4 ml-2 mx-2">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Atualizador de Categoria</h2>
                    </div>
                    <div className="grid gap-4 mx-2">
                        <CheckList
                            types="text"
                            descricao="Categoria:"
                            placeholderInput=""
                            value={categoria}
                            onChange={(value) => setCategoria(value)}
                            menssagemError=""
                        />
                    </div>
                    <div className="flex flex-row justify-end">
                        <BotaoAtualizar onClick={handleSubmit} />
                        <BotaoVoltar />
                    </div>
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    );
}
