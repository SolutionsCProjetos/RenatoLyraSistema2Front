import React, { useState, useEffect, useRef } from "react";
import { instance1 } from "../../api/axios";
import CheckList from "../checkList/index";
import InputMask from "react-input-mask";
import BuscarRaca from "../Buscas/buscarRacas"
import useMensagem from "../layout/hooks/useMensagem";
import BuscarCliente from "../Buscas/buscaCliente";
import ModalVacinas from "../Buscas/modalVacinas";
import Mensagem from "../layout/hooks/Mensagem";
import { BotaoGravar, BotaoVoltar } from "../../components/Butons";

export default function Petinput() {
    const [formKey, setFormKey] = useState(Date.now());
    const [nomePet, setNomePet] = useState("");
    const [selectedCliente, setSelectedCliente] = useState("");
    const [raca, setRaca] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [especie, setEspecie] = useState("");
    const [pelagem, setPelagem] = useState("PELO MEDIO");
    const [corPelo, setCorPelo] = useState("");
    const [sexo, setSexo] = useState("MACHO");
    const [numeroChip, setNumerochip] = useState(null);
    const [porte, setPorte] = useState("MEDIO");
    const [situacao, setSituacao] = useState("VIVO");
    const [pesoAtual, setPesoAtual] = useState(0);
    const [vacinasAplicadas, setVacinasAplicadas] = useState([]);
    const [vacinaId, setVacinaId] = useState(null);
    const [historicoMedico, setHistoricoMedico] = useState([]);
    const [dataUltimaVacinacao, setDataUltimaVacinacao] = useState("");
    const [alergias, setAlergias] = useState("");
    const [obs, setObs] = useState('');
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 300;

    const handleAddVacina = (vacinasSelecionadas) => {
        const ids = vacinasSelecionadas.map((vacina) => vacina.id);
        const nomes = vacinasSelecionadas.map((vacina) => vacina.nomeVacina);

        setVacinaId(ids); // Armazena os IDs das vacinas
        setVacinasAplicadas(nomes); // Armazena os nomes das vacinas
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!nomePet.trim()) {
            showWarningMessage('O nome do pet é obrigatório.');
            return;
        }
        // Verificação correta para o selectedCliente
        if (!selectedCliente || !selectedCliente.id) {
            showWarningMessage('O nome do dono é obrigatório. Selecione um cliente válido.');
            return;
        }
        if (!raca.trim()) {
            showWarningMessage('A raça é obrigatória.');
            return;
        }
        if (!especie.trim()) {
            showWarningMessage('A especie é obrigatória.');
            return;
        }
        if (!dataNascimento.trim()) {
            showWarningMessage('A data de nascimento é obrigatória.');
            return;
        }
        const petInputs = {
            nomePet,
            clienteId: selectedCliente.id,
            raca,
            dataNascimento,
            especie,
            pelagem,
            corPelo,
            sexo,
            numeroChip: parseInt(numeroChip) || null,
            porte,
            situacao,
            pesoAtual: parseFloat(pesoAtual),
            obs,
            vacinasAplicadas,
            vacinaId: vacinaId ? parseInt(vacinaId) : null, // Corrigir aqui
            historicoMedico,
            dataUltimaVacinacao: dataUltimaVacinacao || null,
            alergias,
        };

        try {
            const response = await instance1.post('/pet', petInputs);
            clearForm();
            showSuccessMessage(response.data.message || 'Pet cadastrado com sucesso!');
        } catch (erro) {
            const errorMsg = erro.response?.data?.message || 'Erro ao cadastrar o Pet.';
            showErrorMessage(errorMsg);
        }
    };

    const clearForm = () => {
        setNomePet('');
        setSelectedCliente('');
        setRaca('');
        setDataNascimento('');
        setEspecie('');
        setPelagem('PELO MEDIO');
        setCorPelo('');
        setSexo('MACHO');
        setNumerochip(0);
        setPorte('MEDIO');
        setSituacao('VIVO');
        setPesoAtual(0);
        setObs('');
        setVacinasAplicadas([]);
        setDataUltimaVacinacao("");
        setVacinaId(null);
    };

    const handleSelectCliente = (cliente) => {
        if (typeof cliente === 'string') {
            setSelectedCliente({ razaoSocial: cliente });
        } else {
            setSelectedCliente(cliente);
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
                    <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
                        <h2 className="text-2xl text-black underline">Cadastro Pet</h2>
                    </div>
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
                        <BuscarCliente key={`cliente-${formKey}`} titulo="Dono do pet" onSelectCliente={handleSelectCliente} />
                        <BuscarRaca racaSel="Raça:" onSelectRaca={(racaSelecionada) => setRaca(racaSelecionada)} />
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
                                        placeholder="4587896541"
                                        onChange={(e) => setNumerochip(e.target.value)}
                                        className="px-3 py-2 border rounded-md"
                                        required
                                    />
                                }
                            />
                        <CheckList
                            descricao="Peso Atual:"
                            value={pesoAtual}
                            onChange={setPesoAtual}
                            inputComponent={
                                <div className="relative">
                                <input
                                    type="number"
                                    value={pesoAtual}
                                    onChange={(e) => setPesoAtual(e.target.value)}
                                    className="px-3 py-2 border rounded-md"
                                    required
                                />
                                <span className="absolute right-36 top-2/4 transform -translate-y-2/4 text-gray-700">KG</span>
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
                        <label htmlFor="descricao" className="block text-gray-700 mx-2 mb-4 mt-2 font-medium h-20">
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
                                {obs.length}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-row justify-end mt-11">
                        <BotaoGravar onClick={handleSubmit} />
                        <BotaoVoltar />
                    </div>
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    );
}
