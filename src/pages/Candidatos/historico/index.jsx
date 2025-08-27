import React, { useState, useEffect, useRef, useContext } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList";
import CheckListNome from "../../checkList/nome/checkListNome";
import InputMask from "react-input-mask";
import useMensagem from "../../layout/hooks/useMensagem";
import { FaSearchLocation } from 'react-icons/fa';
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar, BotaoAtualizar } from "../../../components/Butons";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";

export default function CandidatoPut() {
    const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
    const inputRef = useRef(null);
    const { id } = useParams();
    const [status, setStatus] = useState("Disponivel");
    const [departamento, setDepartamento] = useState("Privado");
    const [nome, setNome] = useState("");
    const [rg, setRg] = useState("");
    const [cpf, setCpf] = useState("");
    const [email, setEmail] = useState("");
    const [cnh, setCnh] = useState("");
    const [contato, setContato] = useState("");
    const [telefone2, setTelefone2] = useState('');//ok
    const [cepError, setCepError] = useState('');
    const [loading, setLoading] = useState(false);
    const [tituloEleitor, setTituloEleitor] = useState("");
    const [zonaEleitoral, setZonaEleitoral] = useState("");
    const [cidadeEleitoral, setCidadeEleitoral] = useState("");
    const [secao, setSecao] = useState("");
    const [dependentes, setDependentes] = useState(0);
    const [areaAtuacao, setAreaAtuacao] = useState("");
    const [estCivil, setEstCivil] = useState("Solteiro");
    const [dataNascimento, setDataNascimento] = useState("");
    const [cep, setCep] = useState('');//ok
    const [endereco, setEndereco] = useState('');//ok
    const [numero, setNumero] = useState('');//ok
    const [bairro, setBairro] = useState('');//ok
    const [uf, setUf] = useState('');//ok
    const [cidade, setCidade] = useState('');//ok
    const [pontoReferencia, setPontoReferencia] = useState('');//ok
    const [categoria, setCategoria] = useState("");//ok
    const [obs, setObs] = useState('');//ok
    const [expProfissional, setExpProfissional] = useState('');//ok
    const [documentos, setDocumentos] = useState('');//ok
    const [historico, setHistorico] = useState([]);
    const [historicoN, setHistoricoN] = useState([]);
    const [historicoRemover, setHistoricoRemover] = useState([]);

    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const handleRemoveHistorico = (index, id) => {
        // Se o histórico removido já existir no banco, adicionamos o ID à lista de remoção
        if (id) {
            setHistoricoRemover([...historicoRemover, id]);
        }

        // Atualiza o estado local para remover do frontend
        setHistoricoN(historicoN.filter((_, i) => i !== index));
    };

    useEffect(() => {
        const fetchReceber = async () => {
            try {
                const response = await instance1.get(`/emprego/${id}`);
                const data = response.data;
                console.log(data);
                setObs(data.obs ? data.obs : '');
                setExpProfissional(data.expProfissional ? data.expProfissional : '');
                setHistoricoN(data.historico || []);
            } catch (error) {
                console.error("Erro ao buscar os dados do backend: ", error);
                showErrorMessage('Erro ao buscar os dados.');
            }
        };
        fetchReceber();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await instance1.put(`/emprego/${id}`, {
                historico, // Novos históricos adicionados
                historicoRemover, // Lista de IDs para remoção
            });

            showSuccessMessage(response.data.message || "Candidato atualizado com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao atualizar o candidato.");
            } else {
                console.log(error);
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };

    return (
        <>
            <form>
                {historicoN.length > 0 && (
                    <div className="mt-4 mx-2">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Histórico Profissional</h3>
                        <table className="w-full border-collapse border border-gray-300">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Empresa</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Função</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">Adissão</th>
                                    <th className="border border-gray-300 px-4 py-2 text-left">demissão</th>
                                    <th className="border border-gray-300 px-4 py-2 text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {historicoN.map((item, index) => (
                                    <tr key={index} className="bg-white">
                                        <td className="border border-gray-300 px-4 py-2">{item.empresas}</td>
                                        <td className="border border-gray-300 px-4 py-2">{item.funcao}</td>
                                        <td className="border border-gray-300 px-4 py-2">{new Date(item.data).toLocaleDateString("pt-BR")}</td>
                                        <td className="border border-gray-300 px-4 py-2">
                                            {item.dataDemissao ? new Date(item.dataDemissao).toLocaleDateString("pt-BR") : 'Atual'}
                                        </td>
                                        <td className="border border-gray-300 px-4 py-2 text-center">
                                            <button
                                                onClick={() => handleRemoveHistorico(index, item.id)} // Agora também passa o ID
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                Remover
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                <div className="flex flex-row justify-end">
                    <BotaoAtualizar onClick={handleSubmit} />
                    < BotaoVoltar />
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    );
}