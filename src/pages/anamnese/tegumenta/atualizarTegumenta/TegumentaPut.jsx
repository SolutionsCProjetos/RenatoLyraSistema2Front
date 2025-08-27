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

export default function TegumentaPut() {
    const inputRef = useRef(null);
    const { id } = useParams();
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [petNome, setPetNome] = useState('');
    const [parceiroNome, setParceiroNome] = useState("");
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

    const MAX_CHAR_COUNT = 300;

    useEffect(() => {
        const fetchReceber = async () => {
            try {
                const response = await instance1.get(`/tegumentarPet/${id}`);
                const data = response.data;
                console.log(data)
                setPetNome(data.pet?.nomePet || '');
                setParceiroNome(data.parceiro?.razaoSocial || '');
                setAlopecia(data.alopecia);
                SetDescamacao(data.descamacao);
                SetDescricaoGeral(data.descricaoGeral);
                setPuliciose(data.puliciose);
                setMeneiosCefalicos(data.meneiosCefalicos);
                setInfestacaoCarrapatos(data.infestacaoCarrapatos);
                setParceiroId(data.parceiroId);
                setHiperqueratose(data.hiperqueratose);
                setPustulas(data.pustulas);
                setEritema(data.eritema);
                SetPrurido(data.prurido);
                setEdema(data.edema);
                setNodulosOuMassas(data.nodulosOuMassas);
                setPetId(data.petId);
                SetCorTexturaPelo(data.corTexturaPelo);
                setSecrecaoOtologica(data.secrecaoOtologica);
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
            const response = await instance1.put(`/tegumentar/${id}`, {
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
            showSuccessMessage(response.data.message || "Sistema gastro atualizado com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao atualizar o sistema gastro.");
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
    return (
        <>
            <form key={formKey}>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl ">
                    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mx-2">
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
                        <BotaoAtualizar onClick={handleSubmit} />
                        < BotaoVoltar />
                    </div>
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    )

}