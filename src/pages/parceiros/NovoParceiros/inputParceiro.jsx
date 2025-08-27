import React, { useState, useRef } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList";
import InputMask from "react-input-mask";
import SearchTipo from "../../Buscas/buscarTipo";
import { FaSearchLocation } from 'react-icons/fa';
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../components/Butons";

export default function ParceiroInput() {
    const inputRef = useRef(null);
    const [status, setStatus] = useState("Ativo");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [contato, setContato] = useState("");
    const [cpf, setCpf] = useState("");
    const [cnpj, setCnpj] = useState("");
    const [cepError, setCepError] = useState('');
    const [loading, setLoading] = useState(false);
    const [razaoSocial, setRazaoSocial] = useState("");
    const [fantasia, setFantasia] = useState("");
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [num, setNum] = useState('');
    const [bairro, setBairro] = useState('');
    const [uf, setUf] = useState('');
    const [cidade, setCidade] = useState('');
    const [pontoReferencia, setPontoReferencia] = useState('');
    const [telefone_2, setTelefone_2] = useState('');
    const [obsEnd, setObsEnd] = useState('');
    const [rule, setRule] = useState('2');
    const [obs, setObs] = useState('');
    const [tipoId, setTipoId] = useState(''); // Altere para armazenar o tipoId
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    const MAX_CHAR_COUNT = 300;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!razaoSocial.trim()) {
            showWarningMessage('a razão social é obrigatória!');
            return;
        } if (!contato.trim()) {
            showWarningMessage('O telefone é obrigatório!');
            return;
        } if (!senha.trim()) {
            showWarningMessage("A senha é obrigatória.");
            return;
        } if (!email.trim()) {
            showWarningMessage("Informe um e-mail.");
            return;
        }

        const formattedCpf = cpf.replace(/[^\d]+/g, '');  // Remove tudo que não for número
        const formattedCnpj = cnpj.replace(/[^\d]+/g, '');  // Remove tudo que não for número

        try {
            const response = await instance1.post('/parceiro', {
                cnpj: formattedCnpj,
                cpf: formattedCpf,
                status,
                email,
                senha,
                contato,
                razaoSocial,
                fantasia,
                cep,
                endereco,
                num,
                bairro,
                uf,
                cidade,
                pontoReferencia,
                telefone_2,
                obsEnd,
                rule,
                obs,
                tipoId
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

    const handleObsChange = (event) => {
        const { value } = event.target;
        if (value.length <= MAX_CHAR_COUNT) {
            setObs(value);
        }
    };

    const clearForm = () => {
        setStatus('Ativo');
        setEmail('');
        setSenha('');
        setContato('');
        setTelefone_2('');
        setCpf(''); // Limpa o valor selecionado
        setCnpj(''); // Limpa o valor selecionado
        setRazaoSocial('');
        setFantasia('');
        setCep('');
        setEndereco('');
        setNum('');
        setBairro('');
        setUf('');
        setCidade('');
        setPontoReferencia('');
        setObsEnd('');
        setObs('');
        setTipoId('');
        setFormKey(Date.now());
    };

    const BuscarEndereco = async () => {
        if (cep === '') {
            alert("Digite um CEP!");
            setCep('');
            return;
        }

        setLoading(true);
        setCepError('');
        try {
            const response = await instance2.get(`/${cep}/json/`);
            const data = response.data;
            console.log('Resposta da API ViaCEP:', data);

            if (data.erro) {
                setCepError("CEP não encontrado!");
                setLoading(false);
                return;
            }

            setEndereco(data.logradouro);
            setBairro(data.bairro);
            setUf(data.uf);
            setCidade(data.localidade);
            setPontoReferencia(data.complemento);
            setLoading(false);
        } catch (err) {
            console.error('Erro ao buscar o CEP:', err);
            setCepError('Erro ao buscar o CEP. Por favor, tente novamente.');
            setLoading(false);
        }
    }

    return (
        <>
            <form key={formKey}>
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
                    <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Parceiro</h2>
                    </div>
                    <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
                        <SearchTipo tipoSel="Comercio:" onSelectTipo={(tipoId) => setTipoId(tipoId)} />
                        <CheckList
                            types="text"
                            descricao="CNPJ:"
                            value={cnpj}
                            onChange={setCnpj}
                            menssagemError=""
                            inputComponent={
                                <InputMask
                                    ref={inputRef}
                                    value={cnpj}
                                    mask="99.999.999/9999-99"
                                    placeholder="12.312.332/0001-51"
                                    onChange={(e) => setCnpj(e.target.value)}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            }
                        />
                        <CheckList
                            types="text"
                            descricao="*CPF:"
                            value={cpf}
                            onChange={setCpf}
                            menssagemError=""
                            inputComponent={
                                <InputMask
                                    ref={inputRef}
                                    value={cpf}
                                    mask="999.999.999-99"
                                    placeholder="135.477.445-02"
                                    onChange={(e) => setCpf(e.target.value)}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            }
                        />
                        <CheckList
                            descricao="*Razão Social:"
                            types="text"
                            value={razaoSocial}
                            onChange={(e) => setRazaoSocial(e.target.value.toUpperCase())}
                            messagemError=""
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="Google"
                                    value={razaoSocial}
                                    onChange={(e) => setRazaoSocial(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                    required
                                />
                            }
                        />
                        <CheckList
                            descricao="Fantasia:"
                            types="text"
                            value={fantasia}
                            onChange={(e) => setFantasia(e.target.value.toUpperCase())}
                            messagemError=""
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="Google LTDa brasil"
                                    value={fantasia}
                                    onChange={(e) => setFantasia(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                    required
                                />
                            }
                        />
                        <CheckList
                            types="tel"
                            descricao="*Telefone:"
                            value={contato}
                            onChange={setContato}
                            menssagemError=""
                            inputComponent={
                                <InputMask
                                    ref={inputRef}
                                    mask="(99) 9 9999-9999"
                                    value={contato}
                                    placeholder="(81) 9 2325-5555"
                                    onChange={(e) => setContato(e.target.value)}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            }
                        />
                        <CheckList
                            types="tel"
                            descricao="Telefone 2:"
                            value={telefone_2}
                            onChange={setTelefone_2}
                            menssagemError=""
                            inputComponent={
                                <InputMask
                                    ref={inputRef}
                                    mask="(99) 9 9999-9999"
                                    value={telefone_2}
                                    placeholder="(81) 9 2325-5555"
                                    onChange={(e) => setTelefone_2(e.target.value)}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                    required
                                />
                            }
                        />
                        <CheckList
                            descricao="E-mail:"
                            types="text"
                            value={email}
                            onChange={setEmail}
                            placeholderInput="email@email.com"
                            messagemError=""
                        />
                        <CheckList
                            types="password"
                            descricao="Senha:"
                            placeholderInput="*******"
                            value={senha}
                            onChange={setSenha}
                            menssagemError="A senha não pode estar vazia"
                        />
                        <div className="relative">
                            <CheckList
                                types="text"
                                descricao="Cep:"
                                value={cep}
                                onChange={setCep}
                                menssagemError=""
                                inputComponent={
                                    <InputMask
                                        ref={inputRef}
                                        mask="99999-999"
                                        value={cep}
                                        onChange={(e) => setCep(e.target.value)}
                                        placeholder="55520-000"
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 pl-4"
                                    />
                                }
                            />
                            <button
                                type="button"
                                onClick={BuscarEndereco}
                                className="absolute left-11 top-7 mt-1 ml-36"
                            >
                                <FaSearchLocation />
                            </button>
                            {loading && <p>Buscando endereço...</p>}
                            {cepError && <p className="top-14 mt-1 ml-2 absolute">{cepError}</p>}
                        </div>
                        <CheckList
                            types="text"
                            descricao="Endereço:"
                            placeholderInput="R: Joao mendes ferreira"
                            value={endereco}
                            onChange={setEndereco}
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="R: Joao mendes ferreira"
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                />
                            }
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="Num:"
                            placeholderInput="A-125"
                            value={num}
                            onChange={setNum}
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="Bairro: "
                            placeholderInput="Salgado"
                            value={bairro}
                            onChange={setBairro}
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="Salgado"
                                    value={bairro}
                                    onChange={(e) => setBairro(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                />
                            }
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="Uf:"
                            placeholderInput="PE"
                            value={uf}
                            onChange={setUf}
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="PE"
                                    value={uf}
                                    onChange={(e) => setUf(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                />
                            }
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="Cidade:"
                            placeholderInput="Bezzeros"
                            value={cidade}
                            onChange={setCidade}
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="Bezzeros"
                                    value={cidade}
                                    onChange={(e) => setCidade(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                />
                            }
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="Ponto Referencia:"
                            placeholderInput="Ao lado da praça"
                            value={pontoReferencia}
                            onChange={setPontoReferencia}
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="Ao lado da praça"
                                    value={pontoReferencia}
                                    onChange={(e) => setPontoReferencia(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                />
                            }
                            menssagemError=""
                        />
                        <CheckList
                            types="text"
                            descricao="complemento:"
                            placeholderInput="galpão, loja..."
                            value={obsEnd}
                            onChange={setObsEnd}
                            inputComponent={
                                <input
                                    type="text"
                                    placeholder="Ao lado da praça"
                                    value={obsEnd}
                                    onChange={(e) => setObsEnd(e.target.value.toUpperCase())}
                                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                />
                            }
                            menssagemError=""
                        />
                        <div>
                            <span className="block text-sm font-medium text-slate-700">Status:</span>
                            <select
                                id="status"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                                required
                            >
                                <option value="Ativo">Ativo</option>
                                <option value="Desativado">Desativado</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block text-gray-700 mx-2 mb-4 font-medium h-20">
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