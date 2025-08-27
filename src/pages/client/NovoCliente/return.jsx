import CheckList from "../../checkList";
import InputMask from "react-input-mask";
import { FaSearchLocation } from 'react-icons/fa';
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../components/Butons";
export function returns() {
    <>
    <form>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
            <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
                <h2 className="text-2xl text-black underline col-start-1 row-start-1">Cliente</h2>
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
                <CheckList
                    types="text"
                    descricao="*CNPJ:"
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
                    descricao="*CPF proprietário:"
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
                    descricao="*Razao social:"
                    types="text"
                    value={razaoSocial}
                    onChange={(e) => setRazaoSocial(e.target.value.toUpperCase())}
                    messagemError=""
                    inputComponent={
                        <input
                            type="text"
                            placeholder="GOOGLE BRASIL LTDA."
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
                            placeholder="GOOGLE"
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
                    descricao="Indicação:"
                    types="text"
                    value={indicacao}
                    onChange={setIndicacao}
                    messagemError=""
                    inputComponent={
                        <input
                            type="text"
                            placeholder="Paulo"
                            value={indicacao}
                            onChange={(e) => setIndicacao(e.target.value.toUpperCase())}
                            className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                        />
                    }
                />
                <CheckList
                    descricao="Cod. cliente:"
                    types="Number"
                    value={codigoCliente}
                    onChange={setCodigoCliente}
                    placeholderInput="45782"
                    messagemError=""
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
                    descricao="Contador:"
                    placeholderInput="renato"
                    value={contador}
                    onChange={setContador}
                    inputComponent={
                        <input
                            type="text"
                            placeholder="Ao lado da praça"
                            value={contador}
                            onChange={(e) => setContador(e.target.value.toUpperCase())}
                            className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                        />
                    }
                    menssagemError=""
                />
                <div>
                    <span className="block text-sm font-medium text-slate-700">Situação:</span>
                    <select
                        id="situacao"
                        value={situacao}
                        onChange={(e) => setSituacao(e.target.value)}
                        className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                        required
                    >
                        <option value="Liberado">Liberado</option>
                        <option value="Bloqueado">Bloqueado</option>
                    </select>
                </div>
                <CheckList
                    descricao="Venc. certificado:"
                    value={vencimentoCertificado}
                    onChange={(e) => setVencimentoCertificado(e.target.value)}
                    inputComponent={
                        <input
                            type="date"
                            value={vencimentoCertificado}
                            onChange={(e) => setVencimentoCertificado(e.target.value)}
                            className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    }
                />
                <CheckList
                    descricao="Venc. contrato:"
                    value={vencimentoContrato}
                    onChange={(e) => setVencimentoContrato(e.target.value)}
                    inputComponent={
                        <input
                            type="date"
                            value={vencimentoContrato}
                            onChange={(e) => setVencimentoContrato(e.target.value)}
                            className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                        />
                    }
                />
            </div>
            <div className="mt-2 mx-2">
                <label className="block text-gray-700 font-medium">Status:</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="Cliente"
                            checked={status === "Cliente"}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Cliente</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="Negociando"
                            checked={status === "Negociando"}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Em Negociação</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="status"
                            value="Cancelado"
                            checked={status === "Cancelado"}
                            onChange={(e) => setStatus(e.target.value)}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Cancelado</span>
                    </label>
                </div>
            </div>
            <div className="mt-2 mx-2">
                <label className="block text-gray-700 font-medium">Prioridade:</label>
                <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="prioridade"
                            value="Alta"
                            checked={prioridade === "Alta"}
                            onChange={(e) => setPrioridade(e.target.value)}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Alta</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="prioridade"
                            value="Normal"
                            checked={prioridade === "Normal"}
                            onChange={(e) => setPrioridade(e.target.value)}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Normal</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            name="prioridade"
                            value="Baixa"
                            checked={prioridade === "Baixa"}
                            onChange={(e) => setPrioridade(e.target.value)}
                            className="form-radio text-blue-600"
                        />
                        <span className="ml-2">Baixa</span>
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
}

