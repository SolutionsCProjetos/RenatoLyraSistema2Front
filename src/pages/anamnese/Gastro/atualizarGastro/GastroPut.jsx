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

export default function GastroPut() {
    const inputRef = useRef(null);
    const { id } = useParams();
    const [petId, setPetId] = useState('');
    const [parceiroId, setParceiroId] = useState("");
    const [petNome, setPetNome] = useState('');
    const [parceiroNome, setParceiroNome] = useState("");
    const [apetite, SetApetite] = useState("Nenhuma");
    const [frequencia, setFrequencia] = useState("");
    const [coloracao, SetColoracao] = useState("");
    const [hematemese, setHematemese] = useState(true);
    const [diarreia, setDiarreia] = useState(true);
    const [melena, setMelena] = useState(true);
    const [hematoquesia, setHematoquesia] = useState(true);
    const [disquesia, setDisquesia] = useState(true);
    const [tenesmo, setTenesmo] = useState(true);
    const [aquesia, setAquesia] = useState(true);
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 300;

    useEffect(() => {
        const fetchReceber = async () => {
            try {
                const response = await instance1.get(`/gastroPet/${id}`);
                const data = response.data;
                console.log(data)
                setPetNome(data.pet?.nomePet || '');
                setParceiroNome(data.parceiro?.razaoSocial || '');
                SetApetite(data.apetite);
                setFrequencia(data.frequencia);
                setHematemese(data.hematemese);
                setHematoquesia(data.hematoquesia);
                setDiarreia(data.diarreia);
                setDisquesia(data.disquesia);
                setParceiroId(data.parceiroId);
                setTenesmo(data.tenesmo);
                setAquesia(data.aquesia);
                setPetId(data.petId);
                SetColoracao(data.coloracao);
                setMelena(data.melena);
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
            const response = await instance1.put(`/gastro/${id}`, {
                petId,
                parceiroId,
                apetite,
                frequencia,
                coloracao,
                hematemese,
                diarreia,
                melena,
                hematoquesia,
                disquesia,
                aquesia,
                tenesmo,
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
                            <span className="block text-sm font-medium text-slate-700">Hematemese:</span>
                            <select
                                id="hematemese"
                                value={hematemese}
                                onChange={(e) => setHematemese(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Diarreia:</span>
                            <select
                                id="diarreia"
                                value={diarreia}
                                onChange={(e) => setDiarreia(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Melena:</span>
                            <select
                                id="melena"
                                value={melena}
                                onChange={(e) => setMelena(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Hematoquesia:</span>
                            <select
                                id="hematoquesia"
                                value={hematoquesia}
                                onChange={(e) => setHematoquesia(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Disquesia:</span>
                            <select
                                id="disquesia"
                                value={disquesia}
                                onChange={(e) => setDisquesia(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Tenesmo:</span>
                            <select
                                id="tenesmo"
                                value={tenesmo}
                                onChange={(e) => setTenesmo(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Aquesia:</span>
                            <select
                                id="aquesia"
                                value={aquesia}
                                onChange={(e) => setAquesia(e.target.value)}
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
                            <span className="block text-sm font-medium text-slate-700">Apetite:</span>
                            <select
                                id="apetite"
                                value={apetite}
                                onChange={(e) => SetApetite(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Normorexia">Normorexia</option>
                                <option value="Anorexia">Anorexia</option>
                                <option value="Hipofagia">Hipofagia</option>
                                <option value="Polifagia">Polifagia</option>
                            </select>
                        </div>

                    </div>
                    <div>
                        <label htmlFor="frequencia" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
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
                        <label htmlFor="coloracao" className="block text-gray-700 mx-2 mb-11 mt-4 font-medium h-20">
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