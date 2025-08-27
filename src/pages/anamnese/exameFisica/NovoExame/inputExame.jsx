import React, { useState, useRef } from "react";
import { instance1, instance2 } from "../../../../api/axios";
import CheckList from "../../../checkList";
import InputMask from "react-input-mask";
import SearchPet from "../../../Buscas/buscarPet";
import SearchParceiro from "../../../Buscas/buscarParceiro";
import { FaSearchLocation } from 'react-icons/fa';
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../../components/Butons";

export default function InputExame() {
    const inputRef = useRef(null);
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [frequenciaCardiaca, setFrequenciaCardiaca] = useState("");
    const [frequenciaRespiratoria, setFrequenciaRespiratoria] = useState("");
    const [temperatura, setTemperatura] = useState("");
    const [tempoPreenchimentoCapilar, setTempoPreenchimentoCapilar] = useState("");
    const [mucosas, setMucosas] = useState("Normal");
    const [desidratacao, setDesidratacao] = useState("Hidratado");
    const [estadoCorporal, setEstadoCorporal] = useState("Ideal");
    const [linfonodos, setLinfonodos] = useState("");
    const [linfonodosObs, setLinfonodosObs] = useState("");
    const [observacoesRespiratorias, setObservacoesRespiratorias] = useState("");
    const [pressaoArterial, setPressaoArterial] = useState("");
    const [descricaoGeral, setDescricaoGeral] = useState("");
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 300;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await instance1.post('/exameFisico', {
                petId,
                parceiroId,
                frequenciaCardiaca: parseFloat(frequenciaCardiaca) || 0,
                frequenciaRespiratoria: parseFloat(frequenciaRespiratoria) || 0,
                temperatura: parseFloat(temperatura) || 0,
                tempoPreenchimentoCapilar: parseFloat(tempoPreenchimentoCapilar) || 0,
                pressaoArterial: parseFloat(pressaoArterial) || 0,
                mucosas,
                desidratacao,
                estadoCorporal,
                linfonodos,
                linfonodosObs,
                observacoesRespiratorias,
                descricaoGeral,
            });      console.log(response);      
            clearForm();
            showSuccessMessage(response.data.message || "Parceiro cadastrado com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao cadastrar o parceiro.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };

    const handleObsChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setDescricaoGeral(value);
        }
    };
    const handleLinfoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setLinfonodos(value);
        }
    };
    const handleLinfoOBSChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setLinfonodosObs(value);
        }
    };
    const handleObsRespChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setObservacoesRespiratorias(value);
        }
    };

    const clearForm = () => {
        setPetId('');
        setParceiroId('');
        setFrequenciaCardiaca(0);
        setFrequenciaRespiratoria(0);
        setTemperatura(0);
        setTempoPreenchimentoCapilar(0);
        setMucosas('Normal'); // Limpa o valor selecionado
        setDesidratacao('Hidratado');
        setEstadoCorporal('Ideal');
        setLinfonodos("");
        setLinfonodosObs('');
        setObservacoesRespiratorias('');
        setPressaoArterial('');
        setDescricaoGeral('');
        setFormKey(Date.now());
    };

    return (
        <>
            <form key={formKey}>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
                    <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Exame fisico</h2>
                    </div>
                    <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4 mt-2 mx-2">
                        <SearchPet petSel="Pet:" onSelectPet={(petId) => setPetId(petId)} />
                        <SearchParceiro parceiroSel="Parceiro:" onSelectParceiro={(parceiroId) => setParceiroId(parceiroId)} />
                        <CheckList
                            descricao="Frequência Cardíaca:"
                            types="number"
                            value={frequenciaCardiaca}
                            onChange={(value) => setFrequenciaCardiaca(value)}
                        />
                        <CheckList
                            descricao="Frequência Respiratória:"
                            types="number" 
                            value={frequenciaRespiratoria}
                            onChange={(value) => setFrequenciaRespiratoria(value)}
                        />
                        <CheckList
                            descricao="Pressão arterial:"
                            types="number"
                            value={pressaoArterial}
                            onChange={(value) => setPressaoArterial(value)}
                        />
                        <CheckList
                            descricao="Temperatura:"
                            types="number"
                            value={temperatura}
                            onChange={(value) => setTemperatura(value)}
                        />
                        <CheckList
                            descricao="Tempo preenchimento capilar:"
                            types="number"
                            value={tempoPreenchimentoCapilar}
                            onChange={(value) => setTempoPreenchimentoCapilar(value)}
                        />
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Mucosas:</span>
                            <select
                                id="mucosas"
                                value={mucosas}
                                onChange={(e) => setMucosas(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Normal">Normal</option>
                                <option value="Cianotica">Cianotica</option>
                                <option value="Hipocorada">Hipocorada</option>
                                <option value="Icteria">Icteria</option>
                                <option value="Perlacia">Perlacia</option>
                            </select>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Desidratação:</span>
                            <select
                                id="prioridade"
                                value={desidratacao}
                                onChange={(e) => setDesidratacao(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Hidratado">Hidratado</option>
                                <option value="Leve">Leve</option>
                                <option value="Moderado">Moderado</option>
                                <option value="Grave">Grave</option>
                            </select>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Estado corporal:</span>
                            <select
                                id="corporal"
                                value={estadoCorporal}
                                onChange={(e) => setEstadoCorporal(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Caquético">Caquético</option>
                                <option value="Magro">Magro</option>
                                <option value="Ideal">Ideal</option>
                                <option value="Sobrepeso">Sobrepeso</option>
                                <option value="Obeso">Obeso</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 sm:grid-cols-1">
                        <div>
                            <label htmlFor="linfo" className="block text-gray-700 mx-2 mb-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Linfonodo:</span>
                                <textarea
                                    id="linfo"
                                    name="linfo"
                                    value={linfonodos}
                                    onChange={handleLinfoChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {linfonodos.length}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="linfo" className="block text-gray-700 mx-2 mb-4  font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Linfonodos Obs:</span>
                                <textarea
                                    id="linfosb"
                                    name="linfosb"
                                    value={linfonodosObs}
                                    onChange={handleLinfoOBSChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {linfonodosObs.length}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block text-gray-700 mx-2 mt-8 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Observacões respiratorias:</span>
                                <textarea
                                    id="respiratoria"
                                    name="respiratoria"
                                    value={observacoesRespiratorias}
                                    onChange={handleObsRespChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {observacoesRespiratorias.length}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div className="mb-12">
                            <label htmlFor="descricao" className="block text-gray-700 mx-2 mt-8 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Descrição geral:</span>
                                <textarea
                                    id="descricao"
                                    name="descricao"
                                    value={descricaoGeral}
                                    onChange={handleObsChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {descricaoGeral.length}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-row justify-end">
                        <BotaoGravar onClick={handleSubmit}
                        />
                        < BotaoVoltar />
                    </div>
                </div>
            </form >
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    )
}