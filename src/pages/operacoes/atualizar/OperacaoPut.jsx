import React, { useState, useEffect } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList";
import { useParams, useNavigate } from "react-router-dom";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
//import BuscarCliente from "../../Buscas/buscaCliente";
import OperadorSearch from "../../Buscas/buscaOperador";
import { NumericFormat } from 'react-number-format';
import { BotaoVoltar, BotaoAtualizar } from "../../../components/Butons";

export default function AtividadeputForm() {
  const { id } = useParams();
  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const [atividade, setAtividade] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState();
  const [status, setStatus] = useState("aberto");
  const [motivo, setMotivo] = useState(null);
  const [formKey, setFormKey] = useState(Date.now());
  const [valorOperacao, setValorOperacao] = useState(0);
  const [selectedOperador, setSelectedOperador] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState(null);
  const [closingDate, setClosingDate] = useState("");
  const [obs, setObs] = useState("");
  //const [SelectedCliente, setSelectedCliente] = useState(null);
  const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();
  const navigate = useNavigate();


  const formatDateToISO = (dateStr) => {
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };

  const fetchOperacao = async () => {
    try {
      const response = await instance1.get(`/operacao/${id}`);
      const data = response.data;

      setAtividade(data.atividade);
      setStartTime(data.startTime);
      setValorOperacao(data.valorOperacao);
      setEndTime(data.endTime);
      setStartDate(formatDateToISO(data.startDate));
      setEndDate(data.endDate ? formatDateToISO(data.endDate) : null);
      setClosingDate(data.closingDate ? formatDateToISO(data.closingDate) : null)
      setSelectedOperador(data.usuario ? { id: data.usuario.id, nome: data.usuario.nome } : null);
      setObs(data.obs);
      setStatus(data.status);
      setMotivo(data.motivo);
      //setSelectedCliente(data.cliente ? { id: data.cliente.id, razaoSocial: data.cliente.razaoSocial } : null);
      console.log(data);
    } catch (error) {
      console.error("Erro ao buscar os dados do backend: ", error);
    }
  };

  useEffect(() => {
    fetchOperacao();
  }, [id]);

  const handleSelectOperador = (operador) => {
    setSelectedOperador(operador);
  };

  /* const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
  }; */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedOperador) {
      showWarningMessage("Selecione um operador válido.");
      return;
    }
    if (status === "Finalizado" && (!closingDate || !endTime)) {
      showWarningMessage("Para finalizar, informe a data e o horário da finalização.");
      return;
    }
    if (!endDate) {
      showWarningMessage("Informe a data de finalização.");
      return;
    }

    const preparedData = {
      atividade,
      startTime,
      endTime,
      status,
      motivo,
      startDate,
      endDate,
      closingDate,
      valorOperacao,
      obs,
      userId: selectedOperador.id, // Aqui usamos o ID do operador selecionado
      //clienteId: SelectedCliente ? SelectedCliente.id : null, 
    };

    try {
      const response = await instance1.put(`/operacao/${id}`, preparedData);
      showSuccessMessage(response.data.message || "Operação atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar a operação: ", error);
      if (error.response && error.response.data) {
        showErrorMessage(error.response.data.message || "Erro ao atualizar operação.");
      } else {
        showWarningMessage("Erro ao enviar os dados. Por favor, tente novamente.");
      }
    }
  };

  return (
    <>
      <form key={formKey}>
        <div className="bg-powder-Blue bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
          <div className="grid grid-cols-1 gap-4 ml-2 ">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">Operação</h2>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4 mt-3 mx-2">
            <OperadorSearch
              key={`cliente-${formKey}`}
              titulo="Operador:"
              onSelectOperador={handleSelectOperador}
              initialOperador={selectedOperador} // Passa o operador associado como inicial
            />
            <CheckList
              types="text"
              descricao="Atividade:"
              placeholderInput="Informe a descrição da operação"
              value={atividade}
              onChange={(value) => setAtividade(value)}
              menssagemError="A atividade é obrigatória"
            />
            {/* <BuscarCliente
              key={`cliente-${formKey}`}
              titulo="Cliente:"
              onSelectCliente={handleSelectCliente}
              initialCliente={SelectedCliente}
            /> */}
            <CheckList
              descricao="Data Inicio:"
              value={startDate}
              onChange={setStartDate}
              inputComponent={
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              types="time"
              descricao="Início da atividade:"
              placeholderInput="13:50"
              value={startTime}
              onChange={(value) => setStartTime(value)}
              menssagemError=""
              inputComponent={
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              types="time"
              descricao="Fim da atividade:"
              placeholderInput="13:50"
              value={endTime}
              onChange={(value) => setEndTime(value)}
              menssagemError=""
              inputComponent={
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              types="number"
              descricao="Valor da operação:"
              placeholderInput="Digite o valor"
              value={valorOperacao}
              onChange={(value) => setValorOperacao(value)}
              inputComponent={
                <NumericFormat
                  value={valorOperacao}
                  onValueChange={(values) => {
                    const { value } = values;
                    setValorOperacao(value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  className="px-2 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                  readOnly
                />
              }
              menssagemError=""
            />
            <CheckList
              descricao="Data para finalizar OC:"
              value={endDate}
              onChange={endDate}
              inputComponent={
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              descricao="Data da finalização:"
              value={closingDate}
              onChange={closingDate}
              inputComponent={
                <input
                  type="date"
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
          </div>
          {/* Radio Buttons para o status */}
          <div className="mt-2 mx-2">
            <label className="block text-gray-700 font-medium">Status:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Aberto"
                  checked={status === "Aberto"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Aberto</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Andamento"
                  checked={status === "Andamento"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Em andamento</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="status"
                  value="Finalizado"
                  checked={status === "Finalizado"}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Finalizado</span>
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
            <label className="block text-gray-700 font-medium">Motivo:</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="motivo"
                  value="Sem exito"
                  checked={motivo === "Sem exito"}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Sem exito</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="motivo"
                  value="Sem Perfil"
                  checked={motivo === "Sem Perfil"}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Sem Perfil</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="motivo"
                  value="Pausado"
                  checked={motivo === "Pausado"}
                  onChange={(e) => setMotivo(e.target.value)}
                  className="form-radio text-blue-600"
                />
                <span className="ml-2">Pausado</span>
              </label>
            </div>
          </div>
          <label htmlFor="descricao" className="block text-gray-700 font-medium mt-2 mx-2">
            <span className="block text-sm font-medium text-slate-700">Observação:</span>
            <textarea
              id="descricao"
              name="descricao"
              value={obs}
              onChange={(event) => setObs(event.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none text-base focus:border-blue-500"
              placeholder="Digite aqui..."
              rows="4"
            ></textarea>
          </label>
          <div className="flex flex-row justify-end">
            <BotaoAtualizar onClick={handleSubmit} />
            <BotaoVoltar />
          </div>
        </div>
      </form>
      <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
    </>
  );
}

