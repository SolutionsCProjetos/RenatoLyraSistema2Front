import React, { useState, useEffect, useRef, useContext } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList";
import CheckListNome from "../../checkList/nome/checkListNome";
import InputMask from "react-input-mask";
import useMensagem from "../../layout/hooks/useMensagem";
import { FaSearchLocation } from "react-icons/fa";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoAtualizar } from "../../../components/Butons";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";
import SetorDemandasBuscas from "../../Buscas/buscarSetorDemanda";
import SolicitanteSearch from "../../Buscas/buscarSolicitante";

export default function CandidatoPut() {
  const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
  const inputRef = useRef(null);
  const { id } = useParams();
  const [status, setStatus] = useState("Pendente");
  const [prioridade, setPrioridade] = useState("P0");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [setor, setSetor] = useState("saude");
  const [telefoneContato, setTelefoneContato] = useState("");
  const [cepError, setCepError] = useState("");
  const [loading, setLoading] = useState(false);
  const [tituloEleitor, setTituloEleitor] = useState("");
  const [zonaEleitoral, setZonaEleitoral] = useState("");
  const [secao, setSecao] = useState("");
  const [dataSolicitacao, setDataSolicitacao] = useState("");
  const [dataTermino, setDataTermino] = useState("");
  const [diasEmAberto, setDiasEmAberto] = useState(0);
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [zona, setZona] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [reincidencia, setReincidencia] = useState("Não");
  const [meioSolicitacao, setMeioSolicitacao] = useState("WhatsApp");
  const [observacoes, setObservacoes] = useState("");
  const [envioCobranca1, setEnvioCobranca1] = useState("");
  const [envioCobranca2, setEnvioCobranca2] = useState("");
  const [envioParaResponsavel, setEnvioParaResponsavel] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [solicitanteAtual, setSolicitanteAtual] = useState("");
  const [anexarDocumentos, setAnexarDocumentos] = useState("");
  const [formKey, setFormKey] = useState(Date.now());

  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();

  useEffect(() => {
    if (dataSolicitacao) {
      const inicio = new Date(dataSolicitacao);
      const fim = dataTermino ? new Date(dataTermino) : new Date(); // se não tiver término, usa hoje

      // Calcula diferença em milissegundos
      const diffTime = fim.getTime() - inicio.getTime();
      const diffDias = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // converte pra dias

      setDiasEmAberto(diffDias > 0 ? diffDias : 0);
    } else {
      setDiasEmAberto(0);
    }
  }, [dataSolicitacao, dataTermino]);

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
        const response = await instance1.get(`/demanda/${id}`);
        const data = response.data;
        setCpf(data.cpf),
          setSetor(data.setor),
          setPrioridade(data.prioridade),
          setStatus(data.status),
          setDataSolicitacao(
            data.dataSolicitacao ? data.dataSolicitacao.split("T")[0] : ""
          ),
          setDataTermino(
            data.dataTermino ? data.dataTermino.split("T")[0] : ""
          ),
          setCep(data.cep || data.solicitante.cep),
          setEndereco(data.endereco || data.solicitante.endereco),
          setBairro(data.bairro || data.solicitante.bairro),
          setNumero(data.num || data.solicitante.num),
          setZona(data.zona || data.solicitante.zona),
          setPontoReferencia(
            data.pontoReferencia || data.solicitante.pontoReferencia
          ),
          setSolicitante(data.solicitanteId),
          setSolicitanteAtual(data.solicitant),
          setNomeCompleto(data.solicitante.nomeCompleto),
          setTituloEleitor(data.solicitante.titulo),
          setTelefoneContato(data.solicitante.telefoneContato),
          setObservacoes(data.observacoes),
          setReincidencia(data.reincidencia),
          setMeioSolicitacao(data.meioSolicitacao),
          setEmail(data.solicitante.email),
          setZonaEleitoral(data.solicitante.zonaEleitoral),
          setSecao(data.solicitante.secaoEleitoral),
          setAnexarDocumentos(data.anexarDocumentos),
          setEnvioCobranca1(data.envioCobranca1),
          setEnvioCobranca2(data.envioCobranca2),
          setEnvioParaResponsavel(data.envioParaResponsavel);
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
      const response = await instance1.put(`/demanda/${id}`, {
        setor,
        prioridade,
        status,
        dataSolicitacao,
        solicitant: solicitanteAtual,
        dataTermino,
        cep,
        endereco,
        bairro,
        num: numero,
        zona,
        pontoReferencia,
        solicitanteId: solicitante.id,
        observacoes,
        reincidencia,
        meioSolicitacao,
        anexarDocumentos,
        envioCobranca1,
        envioCobranca2,
        envioParaResponsavel,
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

  const handleSelectSetor = (setores) => {
    setSetor(setores.setor);
  };

  const handleSelectSolicitante = (solicitante) => {
    setSolicitante(solicitante);
  };

  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
          <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">
              Demanda
            </h2>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Dados da Demanda</h3>
              <hr className="border-t border-black" />
            </div>
            <SetorDemandasBuscas
              key={`setor-${formKey}`}
              setorSel="Setor:"
              onSelectsetorFiltrados={handleSelectSetor}
              initialsetorFiltrados={setor}
            />
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Prioridade:
              </span>
              <select
                id="Prioridade"
                value={prioridade}
                onChange={(e) => setPrioridade(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                                      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                                      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="P0">P0</option>
                <option value="P1">P1</option>
                <option value="P2">P2</option>
                <option value="P3">P3</option>
              </select>
            </div>
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
                <option value="Pendente">Pendente</option>
                <option value="Aguardando Retorno">Aguardando Retorno</option>
                <option value="Cancelada">Cancelada</option>
                <option value="Concluída">Concluída</option>
              </select>
            </div>
            <CheckList
              descricao="*Data da solicitação:"
              types="date"
              value={dataSolicitacao}
              onChange={(e) => setDataSolicitacao(e.target.value)}
              messagemError=""
              inputComponent={
                <input
                  type="date"
                  value={dataSolicitacao}
                  onChange={(e) => setDataSolicitacao(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="*Data de Término:"
              types="date"
              value={dataTermino}
              onChange={(e) => setDataTermino(e.target.value)}
              messagemError=""
              inputComponent={
                <input
                  type="date"
                  value={dataTermino}
                  onChange={(e) => setDataTermino(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="*Dias em Aberto:"
              types="text"
              value={diasEmAberto.toString()}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  value={diasEmAberto}
                  disabled
                  className="px-3 py-2 border rounded-md bg-gray-100 text-gray-800"
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
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Dados do solicitante</h3>
              <hr className="border-t border-black" />
            </div>
            <div className="col-span-3 w-full">
              <SolicitanteSearch
                key={`solicitante-${formKey}`}
                titulo="Solicitante"
                onSelectSolicitante={handleSelectSolicitante}
                initialSolicitante={solicitante}
              />
            </div>
            <CheckList
              types="text"
              descricao="Solicitante:"
              value={solicitanteAtual}
              onChange={setSolicitanteAtual}
              menssagemError=""
              inputComponent={
                <input
                  type="text"
                  value={solicitanteAtual}
                  onChange={(e) => setSolicitanteAtual(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <div className="col-span-2 w-full">
              <CheckListNome
                descricao="*Nome completo:"
                types="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value.toUpperCase())}
                messagemError=""
                readOnly
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
                    readOnly
                  />
                }
              />
            </div>
            <CheckList
              types="text"
              descricao="CPF:"
              value={cpf}
              onChange={setCpf}
              menssagemError=""
              readOnly
            />
            <CheckList
              descricao="Titulo de Eleitor:"
              types="text"
              value={tituloEleitor}
              onChange={(e) => setTituloEleitor(e.target.value.toUpperCase())}
              messagemError=""
              readOnly
            />
            <CheckList
              types="tel"
              descricao="*Telefone:"
              value={telefoneContato}
              onChange={setTelefoneContato}
              menssagemError=""
              readOnly
            />
            <CheckList
              descricao="E-mail:"
              types="text"
              value={email}
              onChange={setEmail}
              placeholderInput="email@email.com"
              readOnly
              messagemError=""
            />
            <CheckList
              descricao="Zona Eleitoral:"
              types="text"
              value={zonaEleitoral}
              onChange={(e) => setZonaEleitoral(e.target.value.toUpperCase())}
              messagemError=""
              readOnly
            />
            <CheckList
              descricao="Seção Eleitoral:"
              types="text"
              value={secao}
              onChange={(e) => setSecao(e.target.value.toUpperCase())}
              messagemError=""
              readOnly
            />
            <div className="col-span-3 mt-2 mx-2">
              <h3 className=" text-lg font-semibold">Informações extras</h3>
              <hr className="border-t border-black" />
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Reincidência:
              </span>
              <select
                id="Reincidência"
                value={reincidencia}
                onChange={(e) => setReincidencia(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                                      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                                      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div>
              <span className="block text-sm font-medium text-slate-700">
                Meio de Solicitação:
              </span>
              <select
                id="Solicitacao"
                value={meioSolicitacao}
                onChange={(e) => setMeioSolicitacao(e.target.value)}
                className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                                      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                                      disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                required
              >
                <option value="WhatsApp">WhatsApp</option>
                <option value="Presencial">Presencial</option>
              </select>
            </div>
            <div className="flex gap-1">
              <CheckList
                types="text"
                descricao="Anexar Documentos:"
                value={anexarDocumentos}
                onChange={setAnexarDocumentos}
              />
            </div>
            <CheckList
              descricao="Envio Cobrança:"
              types="text"
              value={envioCobranca1}
              onChange={(e) => setEnvioCobranca1(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder=""
                  value={envioCobranca1}
                  onChange={(e) =>
                    setEnvioCobranca1(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Envio Cobrança:"
              types="text"
              value={envioCobranca2}
              onChange={(e) => setEnvioCobranca2(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder=""
                  value={envioCobranca2}
                  onChange={(e) =>
                    setEnvioCobranca2(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
            <CheckList
              descricao="Envio para o Responsavel:"
              types="text"
              value={envioParaResponsavel}
              onChange={(e) =>
                setEnvioParaResponsavel(e.target.value.toUpperCase())
              }
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder=""
                  value={envioParaResponsavel}
                  onChange={(e) =>
                    setEnvioParaResponsavel(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
          </div>
          <div>
            <label
              htmlFor="descricao"
              className="block text-gray-700 mx-2 mb-8 mt-2 font-medium h-40"
            >
              <span className="block text-sm font-medium text-slate-700">
                Observação:
              </span>
              <textarea
                id="descricao"
                name="descricao"
                value={observacoes}
                onChange={handleObsChange}
                className="w-full px-1 py-1 border rounded-md text-base h-full focus:outline-none focus:border-blue-500"
                placeholder="Digite aqui..."
                rows="4"
              ></textarea>
              <div className="text-sm text-black text-end mt-1">
                {observacoes.length}/{MAX_CHAR_COUNT} caracteres
              </div>
            </label>
          </div>
          <div className="flex flex-row mt-11 justify-end">
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
