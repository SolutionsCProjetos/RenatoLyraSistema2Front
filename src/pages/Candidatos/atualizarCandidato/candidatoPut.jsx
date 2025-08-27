import React, { useState, useEffect, useRef, useContext } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList";
import CheckListNome from "../../checkList/nome/checkListNome";
import InputMask from "react-input-mask";
import useMensagem from "../../layout/hooks/useMensagem";
import { FaSearchLocation } from "react-icons/fa";
import Mensagem from "../../layout/hooks/Mensagem";
import {
  BotaoVoltar,
  BotaoGravar,
  BotaoAtualizar,
} from "../../../components/Butons";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";

export default function CandidatoPut() {
  const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
  const inputRef = useRef(null);
  const { id } = useParams();
  const [status, setStatus] = useState("Disponivel");
  const [departamento, setDepartamento] = useState("Privado");
  const [nome, setNome] = useState("");
  const [rg, setRg] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [cnh, setCnh] = useState("");
  const [contato, setContato] = useState("");
  const [telefone2, setTelefone2] = useState(""); //ok
  const [cepError, setCepError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tituloEleitor, setTituloEleitor] = useState("");
  const [zonaEleitoral, setZonaEleitoral] = useState("");
  const [cidadeEleitoral, setCidadeEleitoral] = useState("");
  const [secao, setSecao] = useState("");
  const [dependentes, setDependentes] = useState(0);
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [areaAtuacao2, setAreaAtuacao2] = useState("");
  const [areaAtuacao3, setAreaAtuacao3] = useState("");
  const [areaAtuacao4, setAreaAtuacao4] = useState("");
  const [areaAtuacao5, setAreaAtuacao5] = useState("");
  const [estCivil, setEstCivil] = useState("Solteiro");
  const [dataNascimento, setDataNascimento] = useState("");
  const [cep, setCep] = useState(""); //ok
  const [endereco, setEndereco] = useState(""); //ok
  const [numero, setNumero] = useState(""); //ok
  const [bairro, setBairro] = useState(""); //ok
  const [uf, setUf] = useState(""); //ok
  const [cidade, setCidade] = useState(""); //ok
  const [pontoReferencia, setPontoReferencia] = useState(""); //ok
  const [categoria, setCategoria] = useState(""); //ok
  const [obs, setObs] = useState(""); //ok
  const [expProfissional, setExpProfissional] = useState(""); //ok
  const [documentos, setDocumentos] = useState(""); //ok
  const [novaEmpresa, setNovaEmpresa] = useState("");
  const [novaFuncao, setNovaFuncao] = useState("");
  const [novaData, setNovaData] = useState("");
  const [novaDataDemissao, setNovaDataDemissao] = useState("");
  const [historico, setHistorico] = useState([]);
  const [historicoN, setHistoricoN] = useState([]);
  const [historicoRemover, setHistoricoRemover] = useState([]);

  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();

  const MAX_CHAR_COUNT = 300;
  const MAX_CHAR_EXP = 400;

  const handleRemoveHistorico = (index, id) => {
    // Se o histórico removido já existir no banco, adicionamos o ID à lista de remoção
    if (id) {
      setHistoricoRemover([...historicoRemover, id]);
    }

    // Atualiza o estado local para remover do frontend
    setHistoricoN(historicoN.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const fetchReceber = async () => {
      try {
        const response = await instance1.get(`/emprego/${id}`);
        const data = response.data;
        console.log(data);

        setStatus(data.status);
        setDepartamento(data.departamento);
        setNome(data.nome);
        setCpf(data.cpf);
        setRg(data.rg);
        setEmail(data.email);
        setTituloEleitor(data.tituloEleitor);
        setZonaEleitoral(data.zonaEleitoral);
        setCidadeEleitoral(data.cidadeEleitoral);
        setSecao(data.secao);
        setDependentes(data.dependentes);
        setAreaAtuacao(data.areaAtuacao);
        setAreaAtuacao2(data.areaAtuacao2);
        setAreaAtuacao3(data.areaAtuacao3);
        setAreaAtuacao4(data.areaAtuacao4);
        setAreaAtuacao5(data.areaAtuacao5);
        setContato(data.contato);
        setDocumentos(data.documentos);
        setTelefone2(data.telefone2);
        setDataNascimento(
          data.dataNascimento ? data.dataNascimento.split("T")[0] : ""
        );
        setCep(data.cep);
        setEndereco(data.endereco);
        setNumero(data.numero);
        setBairro(data.bairro);
        setUf(data.uf);
        setCidade(data.cidade);
        setPontoReferencia(data.pontoReferencia);
        setCnh(data.cnh);
        setCategoria(data.categoria);
        setObs(data.obs ? data.obs : "");
        setExpProfissional(data.expProfissional ? data.expProfissional : "");
        setHistoricoN(data.historico || []);
      } catch (error) {
        console.error("Erro ao buscar os dados do backend: ", error);
        showErrorMessage("Erro ao buscar os dados.");
      }
    };
    fetchReceber();
  }, [id]);

  const handleObsChange = (event) => {
    const { value } = event.target;
    if (value.length <= MAX_CHAR_COUNT) {
      setObs(value);
    }
  };
  const handleEXPChange = (event) => {
    const { value } = event.target;
    if (value.length <= MAX_CHAR_EXP) {
      setExpProfissional(value);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await instance1.put(`/emprego/${id}`, {
        rg,
        cpf,
        status,
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
        historico, // Novos históricos adicionados
        historicoRemover, // Lista de IDs para remoção
      });

      showSuccessMessage(
        response.data.message || "Candidato atualizado com sucesso!"
      );
    } catch (error) {
      if (error.response && error.response.data) {
        showErrorMessage(
          error.response.data.message || "Erro ao atualizar o candidato."
        );
      } else {
        console.log(error);
        showErrorMessage(
          "Erro ao enviar os dados. Por favor, tente novamente."
        );
      }
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
          <div className="grid md:grid-cols-4 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <div className="col-span-4">
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
                  onChange={(e) =>
                    setAreaAtuacao2(e.target.value.toUpperCase())
                  }
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
                  onChange={(e) =>
                    setAreaAtuacao3(e.target.value.toUpperCase())
                  }
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
                  onChange={(e) =>
                    setAreaAtuacao4(e.target.value.toUpperCase())
                  }
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
                  onChange={(e) =>
                    setAreaAtuacao5(e.target.value.toUpperCase())
                  }
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
            <div className="col-span-4">
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
            <div className="col-span-4">
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
              placeholderInput="A-125"
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
              descricao="UF:"
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
              descricao="Ponto Referência:"
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
                descricao="Url Documentos:"
                value={documentos}
                onChange={setDocumentos}
              />
            </div>
          </div>
          <div className="col-span-4 mt-2 mx-2">
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
                {expProfissional.length}/{MAX_CHAR_EXP} caracteres
              </div>
            </label>
          </div>
          <div className="mt-8 mx-2">
            <h2 className="text-xl mb-2 text-black underline">
              Histórico de Empresas
            </h2>
            <div className="grid md:grid-cols-4 sm:grid-cols-1">
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
              className="bg-sky-700 py-1 mt-2 px-11 rounded hover:bg-sky-800 transition duration-300"
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

          {historicoN.length > 0 && (
            <div className="mt-4 mx-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Histórico Profissional
              </h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Empresa
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Função
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Adissão
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      demissão
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historicoN.map((item, index) => (
                    <tr key={index} className="bg-white">
                      <td className="border border-gray-300 px-4 py-2">
                        {item.empresas}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.funcao}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(item.data).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {item.dataDemissao
                          ? new Date(item.dataDemissao).toLocaleDateString(
                              "pt-BR"
                            )
                          : "Atual"}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <button
                          onClick={() => handleRemoveHistorico(index, item.id)} // Agora também passa o ID
                          className="text-red-500 hover:text-red-700"
                        >
                          Remover
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex flex-row justify-end">
            <BotaoAtualizar onClick={handleSubmit} />
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
