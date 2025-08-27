import React, { useState, useEffect, useRef } from "react";
import { instance1 } from "../../api/axios";
import CheckList from "../checkList/index";
import InputMask from "react-input-mask";
import useMensagem from "../layout/hooks/useMensagem";
import BuscarPagamento from "../Buscas/buscarPagamentos"
import BuscarCategoria from "../Buscas/buscaCategoria";
import BuscarCliente from "../Buscas/buscaCliente";
import Mensagem from "../layout/hooks/Mensagem";
import { NumericFormat } from 'react-number-format';
import { BotaoGravar, BotaoVoltar } from "../../components/Butons";

export default function ContasReceber() {
  const [formKey, setFormKey] = useState(Date.now());
  const [vencimento, setVencimento] = useState('');
  const [cliente, setClienteId] = useState('');
  const [valorReceber, setValorReceber] = useState(0);
  const [valorEmAberto, setValorEmAberto] = useState(0);
  const [parcelas, setParcelas] = useState(1);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [selectedPagamento, setSelectedPagamento] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [selectedCliente, setSelectedCliente] = useState("");
  const [dataReceber, setDataReceber] = useState('');
  const [valorPago, setValorPago] = useState(0);
  const [obs, setObs] = useState('');
  /* const [juros, setJuros] = useState(0);
  const [multa, setMulta] = useState(0); */
  const [custos, setCustos] = useState(0);
  const [descontos, setDescontos] = useState(0);
  const [recibo, setRecibo] = useState('');
  const [empresa, setEmpresa] = useState("IRL");
  const inputRef = useRef(null);
  const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

  useEffect(() => {
    // Recalcula o valor em aberto sempre que os valores relacionados são alterados
    calcularValorEmAberto(valorReceber, /* juros, */ descontos, valorPago);
  }, [valorReceber, /* juros, */ descontos, valorPago]);

  const calcularValorEmAberto = (valorReceber, juros, descontos, valorPago) => {
    const total = parseFloat(valorReceber) || 0;
    /* const jurosValue = parseFloat(juros) || 0;
    const multaValue = parseFloat(multa) || 0; */
    const descontosValue = parseFloat(descontos) || 0;
    const valorPagoValue = parseFloat(valorPago) || 0;

    /*  const valorComJuros = total + jurosValue; */
    const valorFinal = total - descontosValue;
    const valorEmAberto = valorFinal - valorPagoValue;

    setValorEmAberto(valorEmAberto);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    // Validações de formulário
    if (!vencimento.trim()) {
      showWarningMessage('O Vencimento é obrigatório!');
      return;
    }
    if (Number.isNaN(parseFloat(valorReceber)) || parseFloat(valorReceber) <= 0) {
      showWarningMessage('O Valor a Receber é obrigatório!');
      return;
    }
    if (!selectedCliente || !selectedCliente.id) {
      showWarningMessage('Selecione um cliente.');
      return;
    }
  
    // Determina o status
    let status = 'Aberto';
    if (valorEmAberto <= 0) {
      status = 'Fechado';
    } else if (valorPago > 0 && valorPago < parseFloat(valorReceber) - descontos) {
      status = 'Parcial';
    }
  
    // Prepara os dados para envio
    const payload = {
      status,
      clienteId: selectedCliente.id,
      vencimento,
      valorReceber,
      parcelas,
      formaPagamento: selectedPagamento.formasPagamento || null,
      obs,
      cpfCnpj: selectedCliente.cnpj || null,
      dataReceber: dataReceber || null,
      valorPago: valorPago || null,
      custos: custos || null,
      valorEmAberto,
      descontos: descontos || null,
      categoria: selectedCategoria.categoria || '',
      recibo,
      empresa,
    };
  
    try {
      const response = await instance1.post('/receber', payload);
      console.log(response.data);
      clearForm();
      showSuccessMessage(response.data.message || 'Contas a receber cadastrada com sucesso!');
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Erro ao cadastrar o contas a receber.';
      showErrorMessage(errorMsg);
    }
  };
  
  const clearForm = () => {
    setVencimento('');
    setSelectedCliente('');
    setValorReceber('');
    setParcelas(1);
    setSelectedPagamento('');
    setDataReceber('');
    setValorPago('');
    setDescontos('');
    setCustos('');
    setObs('');
    setRecibo('');
    setSelectedCategoria('');
    setEmpresa('IRL');
    setFormKey(Date.now()); // Reset do formulário
  };
  
  const handleSelectPagamento = (pagamento) => {
    setSelectedPagamento(pagamento);
  };

  const handleSelectCategoria = (categoria) => {
    setSelectedCategoria(categoria);
  };

  const handleSelectCliente = (cliente) => {
    if (typeof cliente === 'string') {
      setSelectedCliente({ razaoSocial: cliente });
    } else {
      setSelectedCliente(cliente);
    }
  };
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleDataReceberChange = (event) => {
    const value = event.target.value;
    const today = new Date().toISOString().split('T')[0]; // Data atual no formato 'YYYY-MM-DD'
  
    if (value > today) {
      showWarningMessage("A data recebida não pode ser posterior à data atual.");
      return; // Não atualiza o estado se a data for inválida
    }
    
    setDataReceber(value);
  }; 

  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-max h-full">
          <div className="grid grid-cols-1 gap-4 my-2 max-w-full mx-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">Contas a Receber</h2>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <CheckList
              descricao="*Vencimento:"
              value={vencimento}
              onChange={setVencimento}
              messagemError="O campo Vencimento não pode estar vazio"
              inputComponent={
                <input
                  type="date"
                  value={vencimento}
                  onChange={(e) => setVencimento(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="*Empresa:"
              types="text"
              value={empresa}
              onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas

                />
              }
            />
            <BuscarPagamento key={`pagamento-${formKey}`} formaPag="forma de Pagamento:" onSelectPagamento={handleSelectPagamento} />
            <div className="mt-5">
              <BuscarCategoria key={`categoria-${formKey}`} formaCat="Categoria:" onSelectCategoria={handleSelectCategoria} />
            </div>
            <BuscarCliente key={`cliente-${formKey}`} titulo="clientes" onSelectCliente={handleSelectCliente} />
            <CheckList
              descricao="*Valor total a Receber:"
              value={valorReceber}
              onChange={setValorReceber}
              messagemError="O campo Valor a Receber não pode estar vazio"
              inputComponent={
                <NumericFormat
                  value={valorReceber}
                  onValueChange={(values) => {
                    const { value } = values;
                    setValorReceber(value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="*Parcelas:"
              value={parcelas}
              onChange={setParcelas}
              messagemError="O campo Parcelas não pode estar vazio"
              inputComponent={
                <input
                  type="number"
                  value={parcelas}
                  onChange={(e) => setParcelas(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="Data Recebido:"
              value={dataReceber}
              onChange={setDataReceber}
              inputComponent={
                <input
                  type="date"
                  value={dataReceber}
                  onChange={handleDataReceberChange}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              descricao="Valor Pago:"
              value={valorPago}
              onChange={setValorPago}
              inputComponent={
                <NumericFormat
                  value={valorPago}
                  onValueChange={(values) => {
                    const { value } = values;
                    setValorPago(value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              descricao="Desconto:"
              value={descontos}
              onChange={setDescontos}
              inputComponent={
                <NumericFormat
                  value={descontos}
                  onValueChange={(values) => {
                    const { value } = values;
                    setDescontos(value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              descricao="Valor em aberto:"
              inputComponent={
                <div className="mt-1 block w-52 px-3 py-2 border bg-white rounded-md focus:outline-none focus:border-blue-500">
                  {formatCurrency(Math.max(valorEmAberto, 0))}
                </div>
              }
              readOnly
            />
            {valorEmAberto < 0 && (
              <CheckList
                descricao="Troco:"
                inputComponent={
                  <div className="mt-1 block w-52 px-3 py-2 border bg-white rounded-md focus:outline-none focus:border-blue-500">
                    {formatCurrency(-valorEmAberto)}
                  </div>
                }
                readOnly
              />
            )}
            <CheckList
              types="text"
              descricao="Comprovante:"
              value={recibo}
              onChange={setRecibo}
            />
          </div>
          <label htmlFor="descricao" className="block text-gray-700 font-medium mt-2 mx-2">
            <span className="block font-medium text-sm text-slate-700">Observação:</span>
            <textarea
              id="descricao"
              name="descricao"
              value={obs}
              onChange={(event) => setObs(event.target.value.toUpperCase())}
              className="w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:border-blue-500"
              placeholder="Digite aqui..."
              rows="4"
            ></textarea>
          </label>
          <div className="flex flex-row justify-end mt-2">
            <BotaoGravar onClick={handleSubmit}
            />
            < BotaoVoltar />
          </div>
        </div>
      </form>

      <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
    </>
  );
}