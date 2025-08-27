import React, { useState, useRef } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import CheckListNome from "../../checkList/nome/checkListNome";
import InputMask from "react-input-mask";
import { FaSearchLocation } from "react-icons/fa";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../components/Butons";

export default function CandidatoInput() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("Disponivel");
  const [departamento, setDepartamento] = useState("Privado");
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [cnh, setCnh] = useState("");
  const [contato, setContato] = useState("");
  const [telefone2, setTelefone2] = useState("");
  const [cepError, setCepError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tituloEleitor, setTituloEleitor] = useState("");
  const [zonaEleitoral, setZonaEleitoral] = useState("");
  const [secao, setSecao] = useState("");
  const [dependentes, setDependentes] = useState(0);
  const [cidadeEleitoral, setCidadeEleitoral] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [areaAtuacao2, setAreaAtuacao2] = useState("");
  const [areaAtuacao3, setAreaAtuacao3] = useState("");
  const [areaAtuacao4, setAreaAtuacao4] = useState("");
  const [areaAtuacao5, setAreaAtuacao5] = useState("");
  const [estCivil, setEstCivil] = useState("Solteiro");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [uf, setUf] = useState("");
  const [cidade, setCidade] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [categoria, setCategoria] = useState("NaoTem");
  const [obs, setObs] = useState("");
  const [expProfissional, setExpProfissional] = useState("");
  const [documentos, setDocumentos] = useState("");
  const [historico, setHistorico] = useState([]);
  const [novaEmpresa, setNovaEmpresa] = useState("");
  const [novaFuncao, setNovaFuncao] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaDataDemissao, setNovaDataDemissao] = useState("");

  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();

  const MAX_CHAR_COUNT = 300;
  const MAX_CHAR_COUNT_EXP = 400;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!nome.trim()) {
      showWarningMessage("O nome do candidato é obrigatório!");
      return;
    } else if (!cpf.trim()) {
      showWarningMessage("O CPF é obrigatório!");
      return;
    } else if (!contato.trim()) {
      showWarningMessage("O telefone é obrigatório!");
      return;
    } else if (!dataNascimento.trim()) {
      showWarningMessage("A data de nascimento do candidato é obrigatório!");
      return;
    }

    //const formattedCpf = cpf.replace(/[^\d]+/g, '');  // Remove tudo que não for número
    const formattedrg = rg.replace(/[^\d]+/g, ""); // Remove tudo que não for número

    try {
      const response = await instance1.post("/emprego", {
        rg: formattedrg,
        cpf: cpf,
        status,
        departamento,
        email,
        cnh,
        contato,
        nome,
        tituloEleitor,
        zonaEleitoral,
        cidadeEleitoral,
        secao,
        dependentes,
        areaAtuacao,
        areaAtuacao2,
        areaAtuacao3,
        areaAtuacao4,
        areaAtuacao5,
        estCivil,
        dataNascimento,
        cep,
        endereco,
        numero,
        bairro,
        uf,
        cidade,
        pontoReferencia,
        telefone2,
        obs,
        expProfissional,
        documentos,
        categoria,
        historico, // Adicionando o array de histórico
      });
      clearForm();
      console.log(response);
      showSuccessMessage(
        response.data.message || "Candidato cadastrado com sucesso!"
      );
    } catch (error) {
      if (error.response && error.response.data) {
        console.log(error);
        showErrorMessage(
          error.response.data.message || "Erro ao cadastrar o candidato."
        );
      } else {
        console.log(error);
        showErrorMessage(
          "Erro ao enviar os dados. Por favor, tente novamente."
        );
      }
    }
  };

  const handleObsChange = (event) => {
    const { value } = event.target;
    if (value.length <= MAX_CHAR_COUNT) {
      setObs(value);
    }
  };
  const handleEXPChange = (event) => {
    const { value } = event.target;
    if (value.length <= MAX_CHAR_COUNT_EXP) {
      setExpProfissional(value);
    }
  };

  const clearForm = () => {
    setStatus("Ativo");
    setDepartamento("Privado");
    setEmail("");
    setCnh("");
    setContato("");
    setCpf(""); // Limpa o valor selecionado
    setRg(""); // Limpa o valor selecionado
    setNome("");
    setDataNascimento("");
    setTituloEleitor("");
    setZonaEleitoral("");
    setCidadeEleitoral("");
    setSecao("");
    setDependentes(0);
    setAreaAtuacao("");
    setAreaAtuacao2("");
    setAreaAtuacao3("");
    setAreaAtuacao4("");
    setAreaAtuacao5("");
    setEstCivil("");
    setCategoria("");
    setCep("");
    setEndereco("");
    setBairro("");
    setNumero("");
    setUf("");
    setCidade("");
    setPontoReferencia("");
    setObs("");
    setExpProfissional("");
    setDocumentos("");
    setHistorico([]);
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
      setUf(data.uf);
      setCidade(data.localidade);
      setPontoReferencia(data.complemento);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar o CEP:", err);
      setCepError("Erro ao buscar o CEP. Por favor, tente novamente.");
      setLoading(false);
    }
  };

  return (
    <>
      <form>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
          <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">
              Candidato
            </h2>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Dados Pessoais</h3>
              <hr className="border-t border-black" />
            </div>
            <div className="col-span-1">
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
            </div>
            <div className="col-span-2 w-full">
              <CheckListNome
                descricao="*Candidato:"
                types="text"
                value={nome}
                onChange={(e) => setNome(e.target.value.toUpperCase())}
                messagemError=""
                inputComponent={
                  <input
                    type="text"
                    placeholder="Marcos Antonio"
                    value={nome}
                    onChange={(e) => setNome(e.target.value.toUpperCase())}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full uppercase"
                    required
                  />
                }
              />
            </div>
            <CheckList
              descricao="*Data de Nascimento:"
              types="date"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              messagemError=""
              inputComponent={
                <input
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              types="text"
              descricao="RG:"
              value={rg}
              onChange={setRg}
              menssagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  value={rg}
                  mask="9.999.999"
                  placeholder="1.312.332"
                  onChange={(e) => setRg(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="CNH:"
              types="text"
              value={cnh}
              onChange={setCnh}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="XXXXXXXXXX"
                  value={cnh}
                  onChange={(e) => setCnh(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                />
              }
            />
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Categoria:
              </span>
              <select
                id="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="A">A</option>
                <option value="AB">AB</option>
                <option value="B">B</option>
                <option value="AC">AC</option>
                <option value="C">C</option>
                <option value="AD">AD</option>
                <option value="D">D</option>
                <option value="AE">AE</option>
                <option value="E">E</option>
                <option value="NaoTem">NÃO POSSUI CNH</option>
              </select>
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Estado civil:
              </span>
              <select
                id="estadoCivil"
                value={estCivil}
                onChange={(e) => setEstCivil(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="Solteiro">SOLTEIRO</option>
                <option value="Casado">CASADO</option>
                <option value="Viúvo">VIÚVO</option>
                <option value="Divorciado">DIVORCIADO</option>
                <option value="Separado juridicamente">
                  SEPARADO JURIDICAMENTE
                </option>
              </select>
            </div>
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
              value={telefone2}
              onChange={setTelefone2}
              menssagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  mask="(99) 9 9999-9999"
                  value={telefone2}
                  placeholder="(81) 9 2325-5555"
                  onChange={(e) => setTelefone2(e.target.value)}
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
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Status:
              </span>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                    focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                    disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="Trabalhando">Trabalhando</option>
                <option value="Disponivel">Disponivel</option>
              </select>
            </div>
            <CheckList
              descricao="Area de Atuação:"
              types="text"
              value={areaAtuacao}
              onChange={(e) => setAreaAtuacao(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="Função"
                  value={areaAtuacao}
                  onChange={(e) => setAreaAtuacao(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Area de Atuação 2:"
              types="text"
              value={areaAtuacao2}
              onChange={(e) => setAreaAtuacao2(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="Função"
                  value={areaAtuacao2}
                  onChange={(e) => setAreaAtuacao2(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Area de Atuação 3:"
              types="text"
              value={areaAtuacao3}
              onChange={(e) => setAreaAtuacao3(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="Função"
                  value={areaAtuacao3}
                  onChange={(e) => setAreaAtuacao3(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Area de Atuação 4:"
              types="text"
              value={areaAtuacao4}
              onChange={(e) => setAreaAtuacao4(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="Função"
                  value={areaAtuacao4}
                  onChange={(e) => setAreaAtuacao4(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Area de Atuação 5:"
              types="text"
              value={areaAtuacao5}
              onChange={(e) => setAreaAtuacao5(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="Função"
                  value={areaAtuacao5}
                  onChange={(e) => setAreaAtuacao5(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Departamento:
              </span>
              <select
                id="Departamento"
                value={departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="Publico">Publico</option>
                <option value="Privado">Privado</option>
              </select>
            </div>
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Eleitoral</h3>
              <hr className="border-t border-black" />
            </div>
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
              descricao="Zona Eleitoral:"
              types="text"
              value={zonaEleitoral}
              onChange={(e) => setZonaEleitoral(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="142"
                  value={zonaEleitoral}
                  onChange={(e) =>
                    setZonaEleitoral(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
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
            <CheckList
              descricao="Cidade Eleitoral:"
              types="text"
              value={cidadeEleitoral}
              onChange={(e) => setCidadeEleitoral(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="Caruaru"
                  value={cidadeEleitoral}
                  onChange={(e) =>
                    setCidadeEleitoral(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Dependentes:"
              types="number"
              value={dependentes}
              onChange={(e) => setDependentes(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="number"
                  placeholder="2"
                  value={dependentes}
                  onChange={(e) => setDependentes(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
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
              {loading && <p>Buscando endereço...</p>}
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
              placeholderInput="CARUARU"
              value={cidade}
              onChange={setCidade}
              inputComponent={
                <input
                  type="text"
                  placeholder="CARUARU"
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
                  onChange={(e) =>
                    setPontoReferencia(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                />
              }
              menssagemError=""
            />
            <div className="flex gap-1">
              <CheckList
                types="text"
                descricao="Url Documentos::"
                value={documentos}
                onChange={setDocumentos}
              />
            </div>
          </div>
          <div className="col-span-3 mt-2 mx-2">
            <h3 className=" text-lg font-semibold">Informações extras</h3>
            <hr className="border-t border-black" />
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-gray-700 mx-2 mb-8 mt-2 font-medium h-20"
            >
              <span className="block text-sm font-medium text-slate-700">
                Observação:
              </span>
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
          <div>
            <label
              htmlFor="expProfissional"
              className="block text-gray-700 mx-2 mb-4 font-medium h-20"
            >
              <span className="block text-sm font-medium text-slate-700">
                Exp. Profissional:
              </span>
              <textarea
                id="expProfissional"
                name="profissio"
                value={expProfissional}
                onChange={handleEXPChange}
                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                placeholder="Digite aqui..."
                rows="4"
              ></textarea>
              <div className="text-sm text-black text-end mt-1">
                {expProfissional.length}/{MAX_CHAR_COUNT_EXP} caracteres
              </div>
            </label>
          </div>
          <div className="mt-8 mx-2">
            <h2 className="text-xl mb-2 text-black underline">
              Histórico de Empresas
            </h2>
            <div className="grid md:grid-cols-3 sm:grid-cols-1">
              <CheckList
                descricao="Empresa:"
                types="text"
                value={novaEmpresa}
                onChange={(e) => setNovaEmpresa(e.target.value.toUpperCase())}
                messagemError=""
                inputComponent={
                  <input
                    type="text"
                    placeholder="Empresa"
                    value={novaEmpresa}
                    onChange={(e) =>
                      setNovaEmpresa(e.target.value.toUpperCase())
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                    required
                  />
                }
              />
              <CheckList
                descricao="Função:"
                types="text"
                value={novaFuncao}
                onChange={(e) => setNovaFuncao(e.target.value.toUpperCase())}
                messagemError=""
                inputComponent={
                  <input
                    type="text"
                    placeholder="Função"
                    value={novaFuncao}
                    onChange={(e) =>
                      setNovaFuncao(e.target.value.toUpperCase())
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                    required
                  />
                }
              />
              <CheckList
                descricao="Data adimissão:"
                types="date"
                value={novaData}
                onChange={(e) => setNovaData(e.target.value)}
                messagemError=""
                inputComponent={
                  <input
                    type="date"
                    value={novaData}
                    onChange={(e) => setNovaData(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                }
              />
              <CheckList
                descricao="Data demissão:"
                types="date"
                value={novaDataDemissao}
                onChange={(e) => setNovaDataDemissao(e.target.value)}
                messagemError=""
                inputComponent={
                  <input
                    type="date"
                    value={novaDataDemissao}
                    onChange={(e) => setNovaDataDemissao(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                }
              />
            </div>
            <button
              type="button"
              onClick={() => {
                if (novaEmpresa && novaFuncao && novaData) {
                  setHistorico([
                    ...historico,
                    {
                      empresas: novaEmpresa,
                      funcao: novaFuncao,
                      data: novaData,
                      dataDemissao: novaDataDemissao || "", // Permite que fique vazio se não for preenchido
                    },
                  ]);
                  setNovaEmpresa("");
                  setNovaFuncao("");
                  setNovaData("");
                  setNovaDataDemissao("");
                }
              }}
              className="bg-sky-700 py-1 mt-2 px-16 rounded hover:bg-sky-800 transition duration-300"
            >
              <p className="block text-sm font-medium text-slate-100">
                Adicionar Histórico
              </p>
            </button>

            {/* Lista de Histórico */}
            <ul className="mt-2">
              {historico.map((item, index) => (
                <li key={index} className="flex justify-between border-b py-1">
                  <span>
                    {item.empresas} - {item.funcao} ({item.data})
                    {item.dataDemissao ? ` - ${item.dataDemissao}` : ""}{" "}
                    {/* Só exibe se houver data */}
                  </span>
                  <button
                    onClick={() =>
                      setHistorico(historico.filter((_, i) => i !== index))
                    }
                    className="text-red-500"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-row justify-end">
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
