import React, { useState, useEffect, useRef, useContext } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import PetOverview from "../../../components/petoverView";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoAtualizar, BotaoVoltar, BotaoAnamnese } from "../../../components/Butons";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";

export default function PetGeral() {
    const { id } = useParams();
    const [pesoAtual, setPesoAtual] = useState(0);
    const [dataNascimento, setDataNascimento] = useState('');
    const [nomePet, setNomePet] = useState('');
    const [idadePet, setIdadePet] = useState("");
    const [historicoPesos, setHistoricoPesos] = useState([]);
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();


    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await instance1.get(`/pet/${id}`);
                const data = response.data.data;
                setNomePet(data.nomePet);
                setDataNascimento(data.dataNascimento?.split('T')[0] || null);
                setPesoAtual(data.pesoAtual || null);
                setHistoricoPesos(data.historicoPesos || []);
            } catch (error) {
                console.error("Erro ao buscar os dados do backend:", error);
                showErrorMessage("Erro ao buscar os dados.");
            }
        };

        fetchPet();
    }, [id]);

    useEffect(() => {
        if (dataNascimento) {
            const nascimento = new Date(dataNascimento);
            const hoje = new Date();
            const idade = hoje.getFullYear() - nascimento.getFullYear();
            const meses = hoje.getMonth() - nascimento.getMonth();
            setIdadePet(`${idade} ano(s) e ${meses < 0 ? 12 + meses : meses} mes(es)`);
        } else {
            setIdadePet("Data de nascimento não informada");
        }
    }, [dataNascimento]);

    return (
        <>
            <form>
                <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-4">
                    <h6 className="text-2xl text-black underline">{nomePet}</h6>
                </div>
                <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-4">
                    <CheckList
                        descricao="Data Nascimento:"
                        value={dataNascimento}
                        onChange={setDataNascimento}
                        inputComponent={
                            <input
                                type="date"
                                value={dataNascimento}
                                onChange={(e) => setDataNascimento(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                                required
                            />
                        }
                    />
                    <CheckList
                        descricao="Idade:"
                        value={idadePet}
                        inputComponent={
                            <input
                                type="text"
                                value={idadePet}
                                readOnly
                                className="px-3 py-2 border rounded-md bg-gray-200 cursor-not-allowed"
                            />
                        }
                    />
                </div>
            </form>
            <div className="mt-5 mx-4">
                <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
                <PetOverview
                    pesoAtual={pesoAtual}
                    historicoPesos={historicoPesos}
                />
            </div>
        </>
    )
}