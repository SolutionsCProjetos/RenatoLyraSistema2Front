import React, { useState, useEffect, useContext } from "react";
import { instance1 } from "../../../api/axios";
import OperadorSearch from "../../Buscas/buscaOperador";
import CheckList from "../../checkList";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
//import BuscarCliente from "../../Buscas/buscaCliente";
import { NumericFormat } from 'react-number-format';
import { AuthContext } from "../../../components/AuthContext";
import { BotaoGravar, BotaoVoltar } from "../../../components/Butons";

export default function AtividadeForm() {
    const { user } = useContext(AuthContext);
  
    const getCurrentTime = () => {
      const now = new Date();
      return now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };
  
    const [selectedOperador, setSelectedOperador] = useState(user ? user.id : null);
    const [startTime, setStartTime] = useState(getCurrentTime());
    const [endTime, setEndTime] = useState("");
    const [valorOperacao, setValorOperacao] = useState(0);
    const [atividade, setAtividade] = useState("");
    const [obs, setObs] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [closingDate, setClosingDate] = useState("");
    const [status, setStatus] = useState("Aberto");
    const [motivo, setMotivo] = useState(null);
    //const [SelectedCliente, setSelectedCliente] = useState(null);
    const [formKey, setFormKey] = useState(Date.now());
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage  } = useMensagem();
  
    useEffect(() => {
      if (user) {
        setSelectedOperador(user.id);
      }
    }, [user]);
  
    const handleSelectOperador = (operador) => {
      setSelectedOperador(operador.id);
    };
  
    const clearForm = () => {
      setAtividade("");
      setEndTime("");
      setStartTime(getCurrentTime());
      setObs("");
      setStartDate("");
      setMotivo("");
      setEndDate("");
      setClosingDate("");
      setStatus("Aberto");
      setValorOperacao(0);
      //setSelectedCliente(null);
      setFormKey(Date.now());
    };

    /* const handleSelectCliente = (cliente) => {
      setSelectedCliente( cliente.id );
    }; */
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      if (!selectedOperador) {
        showWarningMessage("Selecione um operador.");
        return;
      }
      if (!atividade.trim()) {
        showWarningMessage("A atividade é obrigatória.");
        return;
      }
      if (!startTime.trim()) {
        showWarningMessage("O tempo inicial é obrigatório.");
        return;
      }
      if (!startDate.trim()) {
        showWarningMessage("A data inicial é obrigatório.");
        return;
      }
      if (!startDate.trim()) {
        showWarningMessage("A data para encerramento é obrigatório.");
        return;
      }
      if (!endDate.trim()) {
        showWarningMessage("Informe a data de finalização.");
        return;
      }
  
      try {
        const operacaoData = {
          atividade,
          startTime,
          endTime,
          valorOperacao,
          status,
          startDate,
          endDate,
          closingDate,
          obs,
          motivo,
          //clienteId: SelectedCliente,
          userId: selectedOperador,
        };
        console.log("data: ", operacaoData);
        const response = await instance1.post("/operacao", operacaoData);
  
        showSuccessMessage(response.data.message || "Atividade cadastrada com sucesso!");
        clearForm();
  
      } catch (error) {
        if (error.response && error.response.data) {
          showErrorMessage(error.response.data.message || "Erro ao cadastrar atividade.");
        } else {
          showErrorMessage("Erro ao enviar os dados. Por favor, tente novamente.");
        }
      }
    };
  
    return (
      <>
        <form key={formKey}>
          <div className="bg-powder-Blue bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
            <div className="grid grid-cols-1 gap-4 ml-2">
              <h2 className="text-2xl text-black underline col-start-1 row-start-1">Operações</h2>
            </div>
            <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 ml-2">
              <OperadorSearch key={`cliente-${formKey}`} titulo="Operador:" onSelectOperador={handleSelectOperador}
               initialOperador={selectedOperador} />
              <CheckList
                types="text"
                descricao="Atividade:"
                placeholderInput="Informe a descrição da operação"
                value={atividade}
                onChange={(value) => setAtividade(value)}
                menssagemError=""
              />
              {/* <BuscarCliente key={`cliente-${formKey}`} titulo="clientes" onSelectCliente={handleSelectCliente} /> */}
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
              <BotaoGravar onClick={handleSubmit}/>
              <BotaoVoltar />
            </div>
          </div>  
        </form>
        <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
      </>
    );
}
  