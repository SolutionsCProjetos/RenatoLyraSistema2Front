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

export default function LocoMotorPut() {
    const inputRef = useRef(null);
    const { id } = useParams();
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [petNome, setPetNome] = useState('');
    const [parceiroNome, setParceiroNome] = useState("");
    const [claudicacao, setClaudicacao] = useState("Nenhuma");
    const [dorTransporObstaculos, setDorTransporObstaculos] = useState("");
    const [paresia, setParesia] = useState("");
    const [impoteciaFuncional, setsetImpoteciaFuncional] = useState(true);
    const [descricaoGeral, setDescricaoGeral] = useState(true);
    const [inflamacao, setInflamacao] = useState(true);
    const [edema, setEdema] = useState(true);
    const [deformidade, setDeformidade] = useState(true);
    const [restricaoMovimento, setRestricaoMovimento] = useState(true);
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 300;

    useEffect(() => {
        const fetchReceber = async () => {
            try {
                const response = await instance1.get(`/locomotorPet/${id}`);
                const data = response.data;
                console.log(data)
                setPetNome(data.pet?.nomePet || '');
                setParceiroNome(data.parceiro?.razaoSocial || '');
                setClaudicacao(data.claudicacao);
                setDorTransporObstaculos(data.dorTransporObstaculos);
                setsetImpoteciaFuncional(data.setImpoteciaFuncional);
                setEdema(data.edema);
                setDescricaoGeral(data.descricaoGeral);
                setDeformidade(data.deformidade);
                setParceiroId(data.parceiroId);
                setRestricaoMovimento(data.restricaoMovimento);
                setPetId(data.petId);
                setParesia(data.paresia);
                setInflamacao(data.inflamacao);
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
            const response = await instance1.put(`/locomotor/${id}`, {
                petId,
                parceiroId,
                claudicacao,
                dorTransporObstaculos,
                paresia,
                impoteciaFuncional,
                descricaoGeral,
                inflamacao,
                edema,
                deformidade,
                restricaoMovimento,
            });
            showSuccessMessage(response.data.message || "Sistema locomotor atualizado com sucesso!");
        } catch (error) {
            console.log(error)
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao atualizar o sistema locomotor.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };

    const handleclaudicacaoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setClaudicacao(value);
        }
    };
    const handledorTransporObstaculosChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setDorTransporObstaculos(value);
        }
    };
    const handleParesiaChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setParesia(value);
        }
    };
    const handleimpoteciaFuncionalChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setImpoteciaFuncional(value);
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
                            descricao="Pet:"
                            value={petNome}
                            onChange={setPetNome}
                            readOnly
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="Parceiro:"
                            value={parceiroNome}
                            onChange={setParceiroNome}
                            readOnly
                            menssagemError=""
                        />

                        <div>
                            <span className="block text-sm font-medium text-slate-700">inflamação:</span>
                            <select
                                id="inflamacao"
                                value={inflamacao}
                                onChange={(e) => setInflamacao(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Edema:</span>
                            <select
                                id="edema"
                                value={edema}
                                onChange={(e) => setEdema(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Deformidades:</span>
                            <select
                                id="deformidade"
                                value={deformidade}
                                onChange={(e) => setDeformidade(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Restrições de movimento:</span>
                            <select
                                id="restricaoMovimento"
                                value={restricaoMovimento}
                                onChange={(e) => setRestricaoMovimento(e.target.value)}
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
                            <label htmlFor="claudicacao" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">claudicação:</span>
                                <textarea
                                    id="claudicacao"
                                    name="claudicacao"
                                    value={claudicacao}
                                    onChange={handleclaudicacaoChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {claudicacao ? claudicacao.length : 0}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="dorTransporObstaculos" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Dor ao transpor obstáculos:</span>
                                <textarea
                                    id="dorTransporObstaculos"
                                    name="dorTransporObstaculos"
                                    value={dorTransporObstaculos}
                                    onChange={handledorTransporObstaculosChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {dorTransporObstaculos ? dorTransporObstaculos.length : 0}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="peresia" className="block text-gray-700 mx-2 mb-11  font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">Paresia:</span>
                                <textarea
                                    id="peresia"
                                    name="peresia"
                                    value={paresia}
                                    onChange={handleParesiaChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {paresia ? paresia.length : 0}/{MAX_CHAR_COUNT} caracteres
                                </div>
                            </label>
                        </div>
                        <div>
                            <label htmlFor="impoteciaFuncional" className="block text-gray-700 mx-2 mb-11 font-medium h-20">
                                <span className="block text-sm font-medium text-slate-700">impotência funcional:</span>
                                <textarea
                                    id="impoteciaFuncional"
                                    name="impoteciaFuncional"
                                    value={impoteciaFuncional}
                                    onChange={handleimpoteciaFuncionalChange}
                                    className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                    placeholder="Digite aqui..."
                                    rows="4"
                                ></textarea>
                                <div className="text-sm text-black text-end mt-1">
                                    {impoteciaFuncional ? impoteciaFuncional.length : 0}/{MAX_CHAR_COUNT} caracteres
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