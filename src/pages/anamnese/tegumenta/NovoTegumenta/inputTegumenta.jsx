import React, { useState, useRef } from "react";
import { instance1 } from "../../../../api/axios";
import CheckList from "../../../checkList";
import SearchPet from "../../../Buscas/buscarPet";
import SearchParceiro from "../../../Buscas/buscarParceiro";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../../components/Butons";

export default function InputTegumenta() {
    const inputRef = useRef(null);
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [prurido, SetPrurido] = useState("");
    const [alopecia, setAlopecia] = useState("");
    const [descamacao, SetDescamacao] = useState("");
    const [corTexturaPelo, SetCorTexturaPelo] = useState("");
    const [descricaoGeral, SetDescricaoGeral] = useState("");
    const [meneiosCefalicos, setMeneiosCefalicos] = useState(true);
    const [secrecaoOtologica, setSecrecaoOtologica] = useState(true);
    const [puliciose, setPuliciose] = useState(true);
    const [infestacaoCarrapatos, setInfestacaoCarrapatos] = useState(true);
    const [hiperqueratose, setHiperqueratose] = useState(true);
    const [pustulas, setPustulas] = useState(true);
    const [eritema, setEritema] = useState(true);
    const [edema, setEdema] = useState(true);
    const [nodulosOuMassas, setNodulosOuMassas] = useState(true);
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 320;

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await instance1.post('/tegumentar', {
                petId,
                parceiroId,
                prurido,
                alopecia,
                descamacao,
                meneiosCefalicos,
                secrecaoOtologica,
                puliciose,
                corTexturaPelo,
                edema,
                nodulosOuMassas,
                descricaoGeral,
                infestacaoCarrapatos,
                hiperqueratose,
                eritema,
                pustulas,
            });
            clearForm();
            showSuccessMessage(response.data.message || "Sistema tegumentar cadastrado com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao cadastrar o sistema tegumentar.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };


    const handlePruridoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetPrurido(value);
        }
    };
    const handlealopeciaChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setAlopecia(value);
        }
    };
    const handledescamacaoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetDescamacao(value);
        }
    };
    const handleCorTexturaPeloChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetCorTexturaPelo(value);
        }
    };
    const handleDescricaoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetDescricaoGeral(value);
        }
    };


    const clearForm = () => {
        setPetId('');
        setParceiroId('');
        SetPrurido(''); // Limpa o valor selecionado
        setAlopecia("");
        SetDescamacao("");
        SetCorTexturaPelo("");
        SetDescricaoGeral("");
        setMeneiosCefalicos(true);
        setSecrecaoOtologica(true);
        setPuliciose(true);
        setInfestacaoCarrapatos(true);
        setHiperqueratose(true);
        setPustulas(true);
        setEritema(true);
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
                            <span className="block text-sm font-medium text-slate-700">Meneios cefalicos:</span>
                            <select
                                id="meneiosCefalicos"
                                value={meneiosCefalicos}
                                onChange={(e) => setMeneiosCefalicos(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Secreção otologica:</span>
                            <select
                                id="secrecaoOtologica"
                                value={secrecaoOtologica}
                                onChange={(e) => setSecrecaoOtologica(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Puliciose:</span>
                            <select
                                id="puliciose"
                                value={puliciose}
                                onChange={(e) => setPuliciose(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Infestação de carrapatos:</span>
                            <select
                                id="infestacaoCarrapatos"
                                value={infestacaoCarrapatos}
                                onChange={(e) => setInfestacaoCarrapatos(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Hiperqueratose:</span>
                            <select
                                id="hiperqueratose"
                                value={hiperqueratose}
                                onChange={(e) => setHiperqueratose(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Pustulas:</span>
                            <select
                                id="pustulas"
                                value={pustulas}
                                onChange={(e) => setPustulas(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Eritema:</span>
                            <select
                                id="eritema"
                                value={eritema}
                                onChange={(e) => setEritema(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Nodulos ou massas:</span>
                            <select
                                id="nodulos"
                                value={nodulosOuMassas}
                                onChange={(e) => setNodulosOuMassas(e.target.value)}
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
                        <label htmlFor="alopecia" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Alopecia:</span>
                            <textarea
                                id="alopecia"
                                name="alopecia"
                                value={alopecia}
                                onChange={handlealopeciaChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {alopecia ? alopecia.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="corTexturaPelo" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Cor e textura do pelo:</span>
                            <textarea
                                id="corTexturaPelo"
                                name="corTexturaPelo"
                                value={corTexturaPelo}
                                onChange={handleCorTexturaPeloChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {corTexturaPelo ? corTexturaPelo.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="descamacao" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Descamação:</span>
                            <textarea
                                id="descamacao"
                                name="descamacao"
                                value={descamacao}
                                onChange={handledescamacaoChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {descamacao ? descamacao.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="prurido" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Prurido:</span>
                            <textarea
                                id="prurido"
                                name="prurido"
                                value={prurido}
                                onChange={handlePruridoChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {prurido ? prurido.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
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