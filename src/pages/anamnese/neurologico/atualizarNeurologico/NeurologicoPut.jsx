import React, { useState, useEffect, useRef } from "react";
import { instance1 } from "../../../../api/axios";
import CheckList from "../../../checkList";
import InputMask from "react-input-mask";
import SearchPet from "../../../Buscas/buscarPet";
import SearchParceiro from "../../../Buscas/buscarParceiro";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoAtualizar } from "../../../../components/Butons";
import { useParams } from "react-router-dom";

export default function NeurologicoPut() {
    const inputRef = useRef(null);
    const { id } = useParams();
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [petNome, setPetNome] = useState('');
    const [parceiroNome, setParceiroNome] = useState("");
    const [convulsoes, setConvulsoes] = useState("");
    const [alteracaoComportamental, SetAlteracaoComportamental] = useState("");
    const [andarEmCirculo, setAndarEmCirculo] = useState(true);
    const [headTilt, setHeadTilt] = useState(true);
    const [paralisia, setParalisia] = useState(true);
    const [tremores, setTremores] = useState(true);
    const [ataxia, setataxia] = useState(true);
    const [reflexosAlterados, setReflexosAlterados] = useState(true);
    const [nistagmo, setNistagmo] = useState(true);
    const [descricaoGeral, setDescricaoGeral] = useState("");
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 150;

    useEffect(() => {
        const fetchReceber = async () => {
            try {
                const response = await instance1.get(`/neuroPet/${id}`);
                const data = response.data;
                console.log(data)
                setPetNome(data.pet?.nomePet || '');
                setParceiroNome(data.parceiro?.razaoSocial || '');
                setConvulsoes(data.convulsoes);
                SetAlteracaoComportamental(data.alteracaoComportamental);
                setAndarEmCirculo(data.andarEmCirculo);
                setTremores(data.tremores);
                setHeadTilt(data.headTilt);
                setataxia(data.ataxia);
                setParceiroId(data.parceiroId);
                setReflexosAlterados(data.reflexosAlterados);
                setNistagmo(data.nistagmo);
                setPetId(data.petId);
                setParalisia(data.paralisia);
                setDescricaoGeral(data.descricaoGeral);
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
            const response = await instance1.put(`/neuro/${id}`, {
                petId,
                parceiroId,
                convulsoes,
                alteracaoComportamental,
                andarEmCirculo,
                headTilt,
                nistagmo,
                paralisia,
                tremores,
                reflexosAlterados,
                ataxia,
                descricaoGeral
            });
            showSuccessMessage(response.data.message || "Sistema neurologico atualizado com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao atualizar o sistema neurologico.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };

    const handleconvulsoesChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setConvulsoes(value);
        }
    };
    const handlealteracaoComportamentalChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetAlteracaoComportamental(value);
        }
    };
    const handleDescricaoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setDescricaoGeral(value);
        }
    };

    return (
        <>
            <form key={formKey}>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl ">
                    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4  mx-2">
                        <SearchPet petSel="Pet:" onSelectPet={(petId) => setPetId(petId)} />
                        <CheckList
                            types="text"
                            CheckList="Pet:"
                            value={petNome}
                            onChange={setPetNome}
                            readOnly
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            CheckList="Parceiro:"
                            value={parceiroNome}
                            onChange={setParceiroNome}
                            readOnly
                            menssagemError=""
                        />
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Anda em circulo:</span>
                            <select
                                id="andarEmCirculo"
                                value={andarEmCirculo}
                                onChange={(e) => setAndarEmCirculo(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">HeadTilt:</span>
                            <select
                                id="headTilt"
                                value={headTilt}
                                onChange={(e) => setHeadTilt(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Nistagmo:</span>
                            <select
                                id="nistagmo"
                                value={nistagmo}
                                onChange={(e) => setNistagmo(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Paralisia:</span>
                            <select
                                id="paralisia"
                                value={paralisia}
                                onChange={(e) => setParalisia(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Tremores:</span>
                            <select
                                id="tremores"
                                value={tremores}
                                onChange={(e) => setTremores(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Ataxia:</span>
                            <select
                                id="ataxia"
                                value={ataxia}
                                onChange={(e) => setAtaxia(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Reflexos alterados:</span>
                            <select
                                id="reflexosAlterados"
                                value={reflexosAlterados}
                                onChange={(e) => setReflexosAlterados(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value={true}>Sim</option>
                                <option value={false}>Não</option>
                            </select>
                        </div>

                    </div>
                    <div className="grid md:grid-cols-2 sm:grid-cols-1">
                        <div>
                            <label htmlFor="convulsoes" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Convulsões:</span>
                                <textarea
                                    id="convulsoes"
                                    name="convulsoes"
                                    value={convulsoes}
                                    onChange={handleconvulsoesChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {convulsoes ? convulsoes.length : 0}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="alteracaoComportamental" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Alteração comportamental:</span>
                                <textarea
                                    id="alteracaoComportamental"
                                    name="alteracaoComportamental"
                                    value={alteracaoComportamental}
                                    onChange={handlealteracaoComportamentalChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {alteracaoComportamental ? alteracaoComportamental.length : 0}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="mb-12">
                        <label htmlFor="descricao" className="block text-gray-700 mx-2  font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Descrição geral:</span>
                            <textarea
                                id="descricao"
                                name="descricao"
                                value={descricaoGeral}
                                onChange={handleDescricaoChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {descricaoGeral ? descricaoGeral.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                    </div>
                    <div className="flex flex-row justify-end">
                        <BotaoAtualizar onClick={handleSubmit} />
                        < BotaoVoltar />
                    </div>
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    )

}