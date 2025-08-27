import React, { useState, useEffect, useRef, useContext } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import PetOverview from "../../../components/petoverView";
import useMensagem from "../../layout/hooks/useMensagem";
import BuscarCliente from "../../Buscas/buscaCliente";
import ModalVacinas from "../../Buscas/modalVacinas";
import BuscarRaca from "../../Buscas/buscarRacas"
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoAtualizar, BotaoVoltar, BotaoAnamnese } from "../../../components/Butons";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";

export default function Petinput() {
    const { id } = useParams();
    const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
    const [formKey, setFormKey] = useState(Date.now());
    const [nomePet, setNomePet] = useState('');
    const [selectedCliente, setSelectedCliente] = useState("");
    const [cliente, setCliente] = useState(null);
    const [raca, setRaca] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [especie, setEspecie] = useState('');
    const [pelagem, setPelagem] = useState('PELO MEDIO');
    const [corPelo, setCorPelo] = useState('');
    const [sexo, setSexo] = useState('MACHO');
    const [numeroChip, setNumerochip] = useState(0);
    const [porte, setPorte] = useState('MEDIO');
    const [situacao, setSituacao] = useState('VIVO');
    const [pesoAtual, setPesoAtual] = useState(0);
    const [pesoAtualizado, setPesoAtualizado] = useState("");
    const [historicoPesos, setHistoricoPesos] = useState([]);
    const [vacinasAplicadas, setVacinasAplicadas] = useState([]);
    const [vacinasDisponiveis, setVacinasDisponiveis] = useState([]); // Todas as vacinas do banco
    const [vacinaId, setVacinaId] = useState(null);
    const [historicoMedico, setHistoricoMedico] = useState([]);
    const [dataUltimaVacinacao, setDataUltimaVacinacao] = useState("");
    const [alergias, setAlergias] = useState("");
    const [obs, setObs] = useState('');
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const navigate = useNavigate();

    const MAX_CHAR_COUNT = 300;

    useEffect(() => {
        const fetchVacinas = async () => {
            try {
                const response = await instance1.get(`/vacina`);
                const vacinas = response.data.data || [];
                setVacinasDisponiveis(vacinas); // Salva todas as vacinas disponíveis
            } catch (error) {
                console.error("Erro ao buscar vacinas:", error);
                showErrorMessage("Erro ao carregar as vacinas.");
            }
        };

        fetchVacinas();
    }, []);

    useEffect(() => {
        if (vacinasAplicadas.length && vacinasDisponiveis.length) {
            // Atualiza o estado para marcar as vacinas já aplicadas como selecionadas
            const atualizadas = vacinasDisponiveis.map((vacina) => ({
                ...vacina,
                selecionada: vacinasAplicadas.includes(vacina.nomeVacina), // Verifica se foi aplicada
            }));
            setVacinasDisponiveis(atualizadas);
        }
    }, [vacinasAplicadas, vacinasDisponiveis]);

    const handleAddVacina = (vacinasSelecionadas) => {
        const ids = vacinasSelecionadas.map((vacina) => vacina.id);
        const nomes = vacinasSelecionadas.map((vacina) => vacina.nomeVacina);

        setVacinaId(ids);
        setVacinasAplicadas(nomes);

        // Atualiza as vacinas disponíveis para refletir as seleções
        const atualizadas = vacinasDisponiveis.map((vacina) => ({
            ...vacina,
            selecionada: ids.includes(vacina.id),
        }));
        setVacinasDisponiveis(atualizadas);
    };

    useEffect(() => {
        const fetchPet = async () => {
            try {
                const response = await instance1.get(`/pet/${id}`);
                const data = response.data.data;
                setNomePet(data.nomePet);
                setCliente(data.cliente.razaoSocial);
                setRaca(data.raca);
                setDataNascimento(data.dataNascimento?.split('T')[0] || null);
                setEspecie(data.especie);
                setPelagem(data.pelagem);
                setCorPelo(data.corPelo);
                setSexo(data.sexo);
                setNumerochip(data.numeroChip || null);
                setPorte(data.porte);
                setSituacao(data.situacao);
                setPesoAtualizado(data.pesoAtual || null)
                setPesoAtual(data.pesoAtual || null);
                setObs(data.obs || "");
                setHistoricoPesos(data.historicoPesos || []);

                if (data.vacinasRelacionadas && data.vacinasRelacionadas.length > 0) {
                    const vacinaInfo = data.vacinasRelacionadas[0]; // Pega o primeiro elemento
                    setHistoricoMedico(vacinaInfo.historicoMedico || []);
                    setVacinasAplicadas(vacinaInfo.vacinasAplicadas || []);
                    setDataUltimaVacinacao(vacinaInfo.dataUltimaVacinacao?.split('T')[0] || null);
                    setAlergias(vacinaInfo.alergias || "");
                } else {
                    // Se não houver vacinas relacionadas, limpa os valores
                    setHistoricoMedico([]);
                    setVacinasAplicadas([]);
                    setDataUltimaVacinacao(null);
                    setAlergias("");
                }
            } catch (error) {
                console.error("Erro ao buscar os dados do backend:", error);
                showErrorMessage("Erro ao buscar os dados.");
            }
        };

        fetchPet();
    }, [id]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const petInputs = {
            nomePet,
            cliente: cliente,
            raca,
            dataNascimento,
            especie,
            pelagem,
            corPelo,
            sexo,
            numeroChip: parseInt(numeroChip),
            porte,
            situacao,
            pesoAtual: parseFloat(pesoAtualizado),
            obs,
            historicoMedico,
            vacinasAplicadas,
            dataUltimaVacinacao,
            alergias,
            vacinaId,
        };

        try {
            const response = await instance1.put(`/pet/${id}`, petInputs);
            showSuccessMessage(response.data.message || 'Pet atualizado com sucesso!');
        } catch (erro) {
            const errorMsg = erro.response?.data?.message || 'Erro ao atualizar o Pet.';
            showErrorMessage(errorMsg);
        }
    };


    const handleObsChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setObs(value);
        }
    }

    return (
        <>
            <form>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-max h-full">
                    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
                        <CheckList
                            descricao="*Nome do pet:"
                            value={nomePet}
                            onChange={setNomePet}
                            inputComponent={
                                <input
                                    type="text"
                                    value={nomePet}
                                    placeholder="Max"
                                    onChange={(e) => setNomePet(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                    required
                                />
                            }
                        />
                        {/* <BuscarCliente key={`cliente-${formKey}`} titulo="Dono do pet" onSelectCliente={handleSelectCliente} />*/}
                        <CheckList
                            descricao="*Cliente:"
                            value={cliente}
                            onChange={setCliente}
                            inputComponent={
                                <input
                                    type="text"
                                    value={cliente}
                                    readOnly
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase"
                                />
                            }
                        />
                        <CheckList
                            value={raca}
                            onChange={setRaca}
                            inputComponent={
                                <BuscarRaca
                                    onSelectRaca={(novaRaca) => setRaca(novaRaca)}
                                    initialRaca={{ raca }} // Passa a raça inicial
                                    racaSel="Raça: "
                                />
                            }
                        />
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
                            descricao="Espécie:"
                            value={especie}
                            onChange={setEspecie}
                            inputComponent={
                                <input
                                    type="text"
                                    value={especie}
                                    placeholder="Ex: Cachorro, Gato"
                                    onChange={(e) => setEspecie(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                    required
                                />
                            }
                        />
                        <CheckList
                            descricao="Pelagem:"
                            value={pelagem}
                            onChange={setPelagem}
                            inputComponent={
                                <select value={pelagem} onChange={(e) => setPelagem(e.target.value)} className="px-3 py-2 border rounded-md">
                                    <option value="PELO CURTO">Pelo Curto</option>
                                    <option value="PELO MEDIO">Pelo Médio</option>
                                    <option value="PELO LONGO">Pelo Longo</option>
                                </select>
                            }
                        />
                        <CheckList
                            descricao="Sexo:"
                            value={sexo}
                            onChange={setSexo}
                            inputComponent={
                                <select value={sexo} onChange={(e) => setSexo(e.target.value)} className="px-3 py-2 border rounded-md">
                                    <option value="MACHO">Macho</option>
                                    <option value="FÊMEA">Fêmea</option>
                                </select>
                            }
                        />
                        <CheckList
                            descricao="Porte:"
                            value={porte}
                            onChange={setPorte}
                            inputComponent={
                                <select value={porte} onChange={(e) => setPorte(e.target.value)} className="px-3 py-2 border rounded-md">
                                    <option value="PEQUENO">Pequeno</option>
                                    <option value="MEDIO">Médio</option>
                                    <option value="GRANDE">Grande</option>
                                </select>
                            }
                        />
                        <CheckList
                            descricao="Situação:"
                            value={situacao}
                            onChange={setSituacao}
                            inputComponent={
                                <select value={situacao} onChange={(e) => setSituacao(e.target.value)} className="px-3 py-2 border rounded-md">
                                    <option value="VIVO">Vivo</option>
                                    <option value="MORTO">Morto</option>
                                </select>
                            }
                        />
                        <CheckList
                            descricao="Cor da pelagem:"
                            value={corPelo}
                            onChange={setCorPelo}
                            inputComponent={
                                <input
                                    type="text"
                                    value={corPelo}
                                    placeholder="Preta"
                                    onChange={(e) => setCorPelo(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                    required
                                />
                            }
                        />
                        <CheckList
                            descricao="Número do chip:"
                            value={numeroChip}
                            onChange={setNumerochip}
                            inputComponent={
                                <input
                                    type="number"
                                    value={numeroChip}
                                    onChange={(e) => setNumerochip(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                    required
                                />
                            }
                        />
                        <CheckList
                            descricao="Peso Atual:"
                            value={pesoAtualizado}
                            onChange={setPesoAtualizado}
                            inputComponent={
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={pesoAtualizado}
                                        onChange={(e) => setPesoAtualizado(e.target.value)}
                                        className="px-3 py-2 border rounded-md w-full pr-12"
                                        required
                                    />
                                    <span className="absolute right-44 top-2/4 transform -translate-y-2/4 text-gray-700">KG</span>
                                </div>
                            }
                        />
                        <CheckList
                            descricao="Data Última Vacinação:"
                            value={dataUltimaVacinacao}
                            onChange={setDataUltimaVacinacao}
                            inputComponent={
                                <input
                                    type="date"
                                    value={dataUltimaVacinacao}
                                    onChange={(e) => setDataUltimaVacinacao(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                />
                            }
                        />
                        <CheckList
                            descricao="Alergias:"
                            value={alergias}
                            onChange={setAlergias}
                            inputComponent={
                                <input
                                    type="text"
                                    value={alergias}
                                    placeholder="Alergia A, Alergia B"
                                    onChange={(e) => setAlergias(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                />
                            }
                        />
                        <ModalVacinas
                            vacinas={vacinasAplicadas}
                            vacinasAplicadas={vacinasAplicadas}
                            onSelectVacinas={handleAddVacina}
                        />
                    </div>
                    <div>
                        <label htmlFor="historicoMedico" className="block text-gray-700 mx-2 mb-6 mt-2 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Histórico Médico:</span>
                            <textarea
                                id="historicoMedico"
                                name="historicoMedico"
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                value={historicoMedico}
                                onChange={(e) => setHistoricoMedico(e.target.value)} // Corrigido para lidar com eventos
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {historicoMedico.length}/{MAX_CHAR_COUNT} caracteres {/* Corrigido */}
                            </div>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block text-gray-700 mx-2 mb-1 mt-7 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Observação:</span>
                            <textarea
                                id="descricao"
                                name="descricao"
                                value={obs}
                                onChange={handleObsChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {obs ? obs.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-row justify-end mt-11">
                        {user && (user.rule === 2) && (
                            <BotaoAnamnese onClick={() => navigate(`/irl/anamneseP/${id}`)} />
                        )}
                        {user && (user.rule !== 2) && (
                            <>
                                <BotaoAnamnese onClick={() => navigate(`/irl/anamnese/${id}`)} />
                                <BotaoAtualizar onClick={handleSubmit} />
                            </>
                        )}
                        <BotaoVoltar />
                    </div>
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    );
}
