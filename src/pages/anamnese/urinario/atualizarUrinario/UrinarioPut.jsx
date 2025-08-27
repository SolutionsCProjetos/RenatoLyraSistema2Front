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

export default function UrinarioPut() {
    const inputRef = useRef(null);
    const { id } = useParams();
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [petNome, setPetNome] = useState('');
    const [parceiroNome, setParceiroNome] = useState("");
    const [disfuncaoHidrica, SetDisfuncaoHidrica] = useState("Normodipsia");
    const [crias, setCrias] = useState("Nenhuma");
    const [frequencia, setFrequencia] = useState("");
    const [coloracao, SetColoracao] = useState("");
    const [volume, SetVolume] = useState("");
    const [odor, SetOdor] = useState("");
    const [outrasAlteracoes, SetOutrasAlteracoes] = useState("");
    const [observacoesGerais, SetObservacoesGerais] = useState("");
    const [ultimoCio, setUltimoCio] = useState('');
    const [hematuria, setHematuria] = useState(true);
    const [disuria, setDisuria] = useState(true);
    const [cristaluria, setCristaluria] = useState(true);
    const [bacteriuria, setBacteriuria] = useState(true);
    const [piuria, setPiuria] = useState(true);
    const [estranguria, setEstranguria] = useState(true);
    const [secrecao, setSecrecao] = useState(true);
    const [castrado, setCastrado] = useState(true);
    const [partosNormais, setPartosNormais] = useState(true);
    const [anticoncepcional, setAnticoncepcional] = useState(true);
    const [cioRegular, setCioRegular] = useState(true);
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 50;
    const MAX_CHAR_COUNT_GERAIS = 300;

    useEffect(() => {
        const fetchReceber = async () => {
            try {
                const response = await instance1.get(`/urinarioPet/${id}`);
                const data = response.data;
                console.log(data)
                setPetNome(data.pet?.nomePet || '');
                setParceiroNome(data.parceiro?.razaoSocial || '');
                setPetId(data.petId);
                setParceiroId(data.parceiroId);
                SetDisfuncaoHidrica(data.disfuncaoHidrica);
                setFrequencia(data.frequencia);
                setCrias(data.crias);
                SetOutrasAlteracoes(data.outrasAlteracoes);
                SetVolume(data.volume);
                SetObservacoesGerais(data.observacoesGerais);
                setUltimoCio(data.ultimoCio ? data.ultimoCio.split('T')[0] : '');
                setHematuria(data.hematuria);
                SetColoracao(data.coloracao);
                SetOdor(data.odor);
                setDisuria(data.disuria);
                setCristaluria(data.cristaluria);
                setBacteriuria(data.bacteriuria);
                setPiuria(data.piuria);
                setEstranguria(data.estranguria);
                setSecrecao(data.secrecao);
                setCastrado(data.castrado);
                setPartosNormais(data.partosNormais);
                setAnticoncepcional(data.anticoncepcional);
                setCioRegular(data.cioRegular);
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
            const response = await instance1.put(`/urinario/${id}`, {
                petId,
                parceiroId,
                disfuncaoHidrica,
                coloracao,
                volume,
                frequencia,
                odor,
                hematuria,
                disuria,
                cristaluria,
                bacteriuria,
                piuria,
                estranguria,
                secrecao,
                castrado,
                partosNormais,
                anticoncepcional,
                cioRegular,
                outrasAlteracoes,
                observacoesGerais,
                ultimoCio,
                crias,
            });
            showSuccessMessage(response.data.message || "Sistema urinario atualizado com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao atualizar o sistema urinario.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };

    const handlefrequenciaChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setFrequencia(value);
        }
    };
    const handleColoracaoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetColoracao(value);
        }
    };
    const handleVolumeChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetVolume(value);
        }
    };
    const handleOdorChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            SetOdor(value);
        }
    };
    const handleAlteracoesChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT_GERAIS) {
            SetOutrasAlteracoes(value);
        }
    };
    const handleObservacaoChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT_GERAIS) {
            SetObservacoesGerais(value);
        }
    };

    const handleUltimoCioChange = (event) => {
        const value = event.target.value;
        const today = new Date().toISOString().split('T')[0]; // Data atual no formato 'YYYY-MM-DD'
      
        if (value > today) {
          showWarningMessage("A data recebida não pode ser posterior à data atual.");
          return; // Não atualiza o estado se a data for inválida
        }

        setUltimoCio(value)
    };

    return (
        <>
            <form key={formKey}>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl ">
                    <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4  mx-2">
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
                            <span className="block text-sm font-medium text-slate-700">hematuria:</span>
                            <select
                                id="hematuria"
                                value={hematuria}
                                onChange={(e) => setHematuria(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">disuria:</span>
                            <select
                                id="disuria"
                                value={disuria}
                                onChange={(e) => setDisuria(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">cristaluria:</span>
                            <select
                                id="cristaluria"
                                value={cristaluria}
                                onChange={(e) => setCristaluria(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">bacteriuria:</span>
                            <select
                                id="bacteriuria"
                                value={bacteriuria}
                                onChange={(e) => setBacteriuria(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">piuria:</span>
                            <select
                                id="piuria"
                                value={piuria}
                                onChange={(e) => setPiuria(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">estranguria:</span>
                            <select
                                id="estranguria"
                                value={estranguria}
                                onChange={(e) => setEstranguria(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">secrecao:</span>
                            <select
                                id="secrecao"
                                value={secrecao}
                                onChange={(e) => setSecrecao(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Castrado:</span>
                            <select
                                id="castrado"
                                value={castrado}
                                onChange={(e) => setCastrado(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Partos Normais:</span>
                            <select
                                id="partosNormais"
                                value={partosNormais}
                                onChange={(e) => setPartosNormais(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Anticoncepcional:</span>
                            <select
                                id="anticoncepcional"
                                value={anticoncepcional}
                                onChange={(e) => setAnticoncepcional(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Cio regular:</span>
                            <select
                                id="cioRegular"
                                value={cioRegular}
                                onChange={(e) => setCioRegular(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Disfunção hidrica:</span>
                            <select
                                id="disfuncaoHidrica"
                                value={disfuncaoHidrica}
                                onChange={(e) => SetDisfuncaoHidrica(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Normodipsia">Normodipsia</option>
                                <option value="Adepsia">Adepsia</option>
                                <option value="Polidipsia">Polidipsia</option>
                                <option value="Oligodipsia">Oligodipsia</option>
                            </select>
                        </div>
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Crias:</span>
                            <select
                                id="crias"
                                value={crias}
                                onChange={(e) => setCrias(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Nulipara">Nulipara</option>
                                <option value="Primipara">Primipara</option>
                                <option value="Pluripara">Pluripara</option>
                                <option value="Nenhuma">Nenhuma</option>
                            </select>
                        </div>
                        <CheckList
                            descricao="Ultimo cio:"
                            value={ultimoCio}
                            onChange={setUltimoCio}
                            inputComponent={
                                <input
                                    type="date"
                                    value={ultimoCio}
                                    onChange={handleUltimoCioChange}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                />
                            }
                        />
                    </div>
                    <div className="grid md:grid-cols-2 mb-11 sm:grid-cols-1">
                        <label htmlFor="frequencia" className="block text-gray-700 mx-2 mb-5 mt-1 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">frequência de evacuações:</span>
                            <textarea
                                id="frequencia"
                                name="frequencia"
                                value={frequencia}
                                onChange={handlefrequenciaChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {frequencia ? frequencia.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="coloracao" className="block text-gray-700 mx-2 mb-5 mt-1 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Coloração das fezes ou vômito:</span>
                            <textarea
                                id="coloracao"
                                name="coloracao"
                                value={coloracao}
                                onChange={handleColoracaoChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {coloracao ? coloracao.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="volume" className="block text-gray-700 mx-2 mb-5 mt-3 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Volume:</span>
                            <textarea
                                id="volume"
                                name="volume"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {volume ? volume.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="odor" className="block text-gray-700 mx-2 mb-5 mt-3 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Odor:</span>
                            <textarea
                                id="odor"
                                name="odor"
                                value={odor}
                                onChange={handleOdorChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {odor ? odor.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>                   
                        <label htmlFor="outras" className="block text-gray-700 mx-2 mt-3 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Outras alterações:</span>
                            <textarea
                                id="outras"
                                name="outras"
                                value={outrasAlteracoes}
                                onChange={handleAlteracoesChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {outrasAlteracoes ? outrasAlteracoes.length : 0}/{MAX_CHAR_COUNT} caracteres
                            </div>
                        </label>
                        <label htmlFor="observacao" className="block text-gray-700 mx-2 mt-3 font-medium h-20">
                            <span className="block text-sm font-medium text-slate-700">Descrição geral:</span>
                            <textarea
                                id="observacao"
                                name="observacao"
                                value={observacoesGerais}
                                onChange={handleObservacaoChange}
                                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                                placeholder="Digite aqui..."
                                rows="4"
                            ></textarea>
                            <div className="text-sm text-black text-end mt-1">
                                {observacoesGerais ? observacoesGerais.length : 0}/{MAX_CHAR_COUNT} caracteres
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