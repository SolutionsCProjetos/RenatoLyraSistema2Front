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

export default function InputManejo() {
    const inputRef = useRef(null);
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [alimentacao, setAlimentacao] = useState("");
    const [tipoAlimentacao, setTipoAlimentacao] = useState("Ração");
    const [horariosAlimentacao, setHorariosAlimentacao] = useState("");
    const [acessoAguaFresca, setAcessoAguaFresca] = useState(true);
    const [ambiente, setAmbiente] = useState("Interno");
    const [atividadeFisica, setAtividadeFisica] = useState("");
    const [contatoComOutrosAnimais, setContatoComOutrosAnimais] = useState("Pouco");
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 300;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await instance1.post('/manejo', {
                petId,
                parceiroId,
                alimentacao,
                horariosAlimentacao,
                acessoAguaFresca,
                atividadeFisica,
                tipoAlimentacao,
                ambiente,
                contatoComOutrosAnimais,
            });
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

    const handleAlimentaChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setAlimentacao(value);
        }
    };
    const handleAtividadeChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setAtividadeFisica(value);
        }
    };
    const handleHorariosChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setHorariosAlimentacao(value);
        }
    };

    const clearForm = () => {
        setPetId('');
        setParceiroId('');
        setAlimentacao("");
        setHorariosAlimentacao("");
        setAcessoAguaFresca("");
        setAtividadeFisica("");
        setTipoAlimentacao('Ração'); // Limpa o valor selecionado
        setAmbiente('Ambos');
        setContatoComOutrosAnimais('Pouco');
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
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Acesso a àgua fresca:</span>
                            <select
                                id="acessoAguaFresca"
                                value={acessoAguaFresca}
                                onChange={(e) => setAcessoAguaFresca(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value={true}>Sim</option>
                                <option value={false}>Não</option>
                            </select>
                        </div>
    
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Tipo alimentacao:</span>
                            <select
                                id="tipoAlimentacao"
                                value={tipoAlimentacao}
                                onChange={(e) => setTipoAlimentacao(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Ração">Ração</option>
                                <option value="Comida Natural">Natural</option>
                                <option value="Ambos">Ambos</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Ambiente:</span>
                            <select
                                id="ambient"
                                value={ambiente}
                                onChange={(e) => setAmbiente(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Interno">Interno</option>
                                <option value="Externo">Externo</option>
                                <option value="Ambos">Ambos</option>
                            </select>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Contato com outros animais:</span>
                            <select
                                id="animais"
                                value={contatoComOutrosAnimais}
                                onChange={(e) => setContatoComOutrosAnimais(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Nenhum">Nenhum</option>
                                <option value="Pouco">Pouco</option>
                                <option value="Frequentemente">Frequentemente</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 sm:grid-cols-1">
                        <div>
                            <label htmlFor="alimentacao" className="block text-gray-700 mx-2 mb-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Alimentação:</span>
                                <textarea
                                    id="alimentacao"
                                    name="alimentacao"
                                    value={alimentacao}
                                    onChange={handleAlimentaChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {alimentacao.length}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="horario" className="block text-gray-700 mx-2 mb-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Horarios da Alimentação:</span>
                                <textarea
                                    id="horario"
                                    name="horario"
                                    value={horariosAlimentacao}
                                    onChange={handleHorariosChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {horariosAlimentacao.length}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="linfo" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Atividade Fisica:</span>
                            <textarea
                                id="linfo"
                                name="linfo"
                                value={atividadeFisica}
                                onChange={handleAtividadeChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {atividadeFisica.length}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
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