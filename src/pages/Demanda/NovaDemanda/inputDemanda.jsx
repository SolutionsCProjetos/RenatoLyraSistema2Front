import React, { useState, useRef } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import useMensagem from "../../layout/hooks/useMensagem";
import SetorDemandasBuscas from "../../Buscas/buscarSetorDemanda";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoGravar } from "../../../components/Butons";
import SolicitanteSearch from "../../Buscas/buscarSolicitante";

export default function DemandaInput() {
  const inputRef = useRef(null);
  const [status, setStatus] = useState("Pendente");
  const [prioridade, setPrioridade] = useState("P0");
  const [setor, setSetor] = useState("saude");
  const [dataSolicitacao, setDataSolicitacao] = useState("");
  const [solicitanteAtual, setSolicitanteAtual] = useState("");
  const [dataTermino, setDataTermino] = useState("");
  const [reincidencia, setReincidencia] = useState("Não");
  const [meioSolicitacao, setMeioSolicitacao] = useState("WhatsApp");
  const [observacoes, setObservacoes] = useState("");
  const [envioCobranca1, setEnvioCobranca1] = useState("");
  const [envioCobranca2, setEnvioCobranca2] = useState("");
  const [envioParaResponsavel, setEnvioParaResponsavel] = useState("");
  const [solicitante, setSolicitante] = useState(0);
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

  const MAX_CHAR_COUNT = 300;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!dataSolicitacao.trim()) {
      showWarningMessage("A data da solicitacao da demanda é obrigatória!");
      return;
    }

    //const formattedCpf = cpf.replace(/[^\d]+/g, '');  // Remove tudo que não for número

    try {
      const payload = {
        setor,
        prioridade,
        status,
        dataSolicitacao,
        dataTermino,
        solicitant: solicitanteAtual,
        solicitanteId: solicitante.id,
        observacoes,
        reincidencia,
        meioSolicitacao,
        anexarDocumentos,
        envioCobranca1,
        envioCobranca2,
        envioParaResponsavel,
      };

      console.log("Enviando para o backend:", payload);

      const response = await instance1.post("/demanda", payload);
      clearForm();
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
      setObservacoes(value);
    }
  };

  const handleSelectSolicitante = (solicitante) => {
    console.log("solicitante: ", solicitante);
    setSolicitante(solicitante);
  };

  const clearForm = () => {
    setStatus("Ativo");
    setPrioridade("Privado");
    setSolicitante("");
    setDataSolicitacao("");
    setSolicitanteAtual("");
    setDataTermino("");
    setObservacoes("");
    setAnexarDocumentos("");
    setEnvioCobranca1("");
    setEnvioCobranca2("");
    setEnvioParaResponsavel("");
  };

  const handleSelectSetor = (setores) => {
    setSetor(setores.setor);
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
              onSelectSetor={handleSelectSetor}
              initialSetor={setor}
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
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Seleção do solicitante</h3>
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
            <div className="col-span-3 mt-2">
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
