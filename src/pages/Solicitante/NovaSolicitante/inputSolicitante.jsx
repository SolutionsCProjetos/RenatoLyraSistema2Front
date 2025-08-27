import React, { useState, useRef } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import { FaSearchLocation } from "react-icons/fa";
import CheckListNome from "../../checkList/nome/checkListNome";
import InputMask from "react-input-mask";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../components/Butons";

export default function SolicitanteInput() {
  const inputRef = useRef(null);
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefoneContato, setTelefoneContato] = useState("");
  const [tituloEleitor, setTituloEleitor] = useState("");
  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState("");
  const [loading, setLoading] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [zona, setZona] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [secao, setSecao] = useState("");
  const [formKey, setFormKey] = useState(Date.now());

  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!cpf.trim()) {
      showWarningMessage("O CPF é obrigatório!");
      return;
    } else if (!telefoneContato.trim()) {
      showWarningMessage("O telefone é obrigatório!");
      return;
    } 
    
    try {
      const response = await instance1.post("/solicitante", {
        nomeCompleto,
        cpf,
        titulo: tituloEleitor,
        telefoneContato,
        cep,
        endereco,
        bairro,
        num: numero,
        zona,
        pontoReferencia,
        email,
        secaoEleitoral: secao,
      });
      clearForm();
      console.log(response);
      showSuccessMessage(
        response.data.message || "Solicitante cadastrado com sucesso!"
      );
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error);
        showErrorMessage(
          error.response.data.message || "Erro ao cadastrar o solicitante."
        );
      } else {
        console.log(error);
        showErrorMessage(
          "Erro ao enviar os dados. Por favor, tente novamente."
        );
      }
    }
  };

  const BuscarEndereco = async () => {
    if (cep === "") {
      alert("Digite um CEP!");
      setCep("");
      return;
    }

    setLoading(true);
    setCepError("");
    try {
      const response = await instance2.get(`/${cep}/json/`);
      const data = response.data;
      console.log("Resposta da API ViaCEP:", data);

      if (data.erro) {
        setCepError("CEP não encontrado!");
        setLoading(false);
        return;
      }

      setEndereco(data.logradouro);
      setBairro(data.bairro);
      setPontoReferencia(data.complemento);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar o CEP:", err);
      setCepError("Erro ao buscar o CEP. Por favor, tente novamente.");
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEmail("");
    setTelefoneContato("");
    setCpf(""); // Limpa o valor selecionado
    setCep("");
    setEndereco("");
    setBairro("");
    setNumero("");
    setZona("Urbana");
    setPontoReferencia("");
    setNomeCompleto("");
    setTituloEleitor("");
    setSecao("");
  };

  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
          <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">
              Solicitante
            </h2>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Dados Pessoal</h3>
              <hr className="border-t border-black" />
            </div>
            <div className="col-span-2 w-full">
              <CheckListNome
                descricao="*Nome completo:"
                types="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value.toUpperCase())}
                messagemError=""
                inputComponent={
                  <input
                    type="text"
                    placeholder="Marcos Antonio"
                    value={nomeCompleto}
                    onChange={(e) =>
                      setNomeCompleto(e.target.value.toUpperCase())
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full uppercase"
                    required
                  />
                }
              />
            </div>
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
              descricao="Titulo de Eleitor:"
              types="text"
              value={tituloEleitor}
              onChange={(e) => setTituloEleitor(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  value={tituloEleitor}
                  mask="9999 9999 9999"
                  placeholder="0000 0000 0000"
                  onChange={(e) => setTituloEleitor(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              types="tel"
              descricao="*Telefone:"
              value={telefoneContato}
              onChange={setTelefoneContato}
              menssagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  mask="(99) 9 9999-9999"
                  value={telefoneContato}
                  placeholder="(81) 9 2325-5555"
                  onChange={(e) => setTelefoneContato(e.target.value)}
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
              inputComponent={
                <input
                  type="text"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                />
              }
              messagemError=""
            />
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Endereço</h3>
              <hr className="border-t border-black" />
            </div>
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
              {cepError && (
                <p className="top-14 mt-1 ml-2 absolute">{cepError}</p>
              )}
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
              descricao="Número:"
              placeholderInput="125"
              value={numero}
              onChange={setNumero}
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
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Zona:
              </span>
              <select
                id="Zona"
                value={zona}
                onChange={(e) => setZona(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                                focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                                disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="Urbana">Urbana</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
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
                  onChange={(e) =>
                    setPontoReferencia(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                />
              }
              menssagemError=""
            />
            <CheckList
              descricao="Seção Eleitoral:"
              types="text"
              value={secao}
              onChange={(e) => setSecao(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="088"
                  value={secao}
                  onChange={(e) => setSecao(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
          </div>
          <div className="flex flex-row justify-end mt-11">
            <BotaoGravar onClick={handleSubmit} />
            <BotaoVoltar />
          </div>
        </div>
      </form>
      <Mensagem
        successMessage={successMessage}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </>
  );
}
