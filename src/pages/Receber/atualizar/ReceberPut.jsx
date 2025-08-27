import React, { useState, useEffect, useRef } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import { useParams, useNavigate } from "react-router-dom";
import useMensagem from "../../layout/hooks/useMensagem";
import InputMask from "react-input-mask";
import BuscarPagamento from "../../Buscas/buscarPagamentos"
import BuscarCategoria from "../../Buscas/buscaCategoria";
import Mensagem from "../../layout/hooks/Mensagem";
import { NumericFormat } from 'react-number-format';
import { BotaoAtualizar, BotaoVoltar } from "../../../components/Butons";

export default function CadastroPut() {
  const { id } = useParams();
  const [status, setStatus] = useState('Aberto');
  const [vencimento, setVencimento] = useState('');
  const [valorReceber, setValorReceber] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [novaCategoria, setNovaCategoria] = useState('');
  const [vendaId, setVendaId] = useState(null);
  const [dataReceber, setDataReceber] = useState('');
  const [valorPago, setValorPago] = useState(0);
  const [juros, setJuros] = useState(0);
  const [multa, setMulta] = useState(0);
  const [custos, setCustos] = useState(0);
  const [descontos, setDescontos] = useState(0);
  const [valorEmAberto, setValorEmAberto] = useState(0);
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [obs, setObs] = useState('');
  const [cliente, setCliente] = useState(null);
  const [empresa, setEmpresa] = useState(null);
  const [tipoDocumento, setTipoDocumento] = useState('CNPJ');
  const [loading, setLoading] = useState(false);
  const [novaFormaPagamento, setNovaFormaPagamento] = useState('');
  const navigate = useNavigate();
  const [recibo, setRecibo] = useState('');
  const inputRef = useRef(null);
  const { successMessage, errorMessage, showSuccessMessage, showErrorMessage } = useMensagem();
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    const fetchReceber = async () => {
      try {
        const response = await instance1.get(`/receber/${id}`);
        const data = response.data;

        setStatus(data.status);
        setVencimento(data.vencimento.split('T')[0]);
        setValorReceber(data.valorReceber);
        setParcelas(data.parcelas);
        setFormaPagamento(data.formaPagamento ?? 'Selecione um pagamento');
        setVendaId(data.vendaId);
        setDataReceber(data.dataReceber ? data.dataReceber.split('T')[0] : '');
        setValorPago(data.valorPago);
        setJuros(data.juros);
        setMulta(data.multa);
        setCustos(data.custos)
        setDescontos(data.descontos);
        setObs(data.obs);
        setRecibo(data.recibo);
        setSelectedCategoria(data.categoria);
        setCpfCnpj(data.cpfCnpj);
        setCliente(data.cliente ? data.cliente.razaoSocial : "");
        setEmpresa(data.empresa ? data.empresa : null);

        // Calcula o valor em aberto na inicialização
        calcularValorEmAberto(data.valorReceber, data.juros, data.descontos, data.valorPago);
      } catch (error) {
        console.error("Erro ao buscar os dados do backend: ", error);
        showErrorMessage('Erro ao buscar os dados.');
      }
    };
    fetchReceber();
  }, [id]);

  useEffect(() => {
    // Recalcula o valor em aberto sempre que os valores relacionados são alterados
    calcularValorEmAberto(valorReceber, juros, descontos, valorPago);
  }, [valorReceber, juros, descontos, valorPago]);

  const calcularValorEmAberto = (valorReceber, juros, descontos, valorPago) => {
    const total = parseFloat(valorReceber) || 0;
    const jurosValue = parseFloat(juros) || 0;
    const multaValue = parseFloat(multa) || 0;
    const descontosValue = parseFloat(descontos) || 0;
    const valorPagoValue = parseFloat(valorPago) || 0;

    const valorComJuros = total + jurosValue + multaValue;
    const valorFinal = valorComJuros - descontosValue;
    const valorEmAberto = valorFinal - valorPagoValue;

    setValorEmAberto(valorEmAberto);
  };

  const handleSelectPagamento = (pagamento) => {
    setNovaFormaPagamento(pagamento);
  };

  const handleSelectCategoria = (categoria) => {
    setNovaCategoria(categoria);
  };

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);

      // Verifica se a forma de pagamento foi informada
      const formaPagamentoAtualizada = novaFormaPagamento.formasPagamento || formaPagamento;
      if (!formaPagamentoAtualizada || formaPagamentoAtualizada.trim() === '') {
        showErrorMessage("A forma de pagamento é obrigatória.");
        return;
      }

      // Verifica se há uma categoria selecionada
      const categoriaAtualizada = novaCategoria.categoria || selectedCategoria;
      if (!categoriaAtualizada || categoriaAtualizada.trim() === '') {
        showErrorMessage("A categoria é obrigatória.");
        return;
      }

      // Converte campos vazios para null
      const preparedData = {
        status,
        vencimento: vencimento || null,
        valorReceber: parseFloat(valorReceber) || null,
        parcelas: parcelas || null,
        formaPagamento: formaPagamentoAtualizada || null, // Usa a forma de pagamento atualizada
        categoria: categoriaAtualizada || null,
        vendaId: vendaId || null,
        dataReceber: dataReceber || null,
        valorPago: parseFloat(valorPago) || null,
        juros: parseFloat(juros) || null,
        custos: parseFloat(custos) || null,
        descontos: parseFloat(descontos) || null,
        valorEmAberto: parseFloat(valorEmAberto) || null,
        obs: obs || null,
        recibo: recibo || null,
        cliente: cliente,
        empresa: empresa,
        cpfCnpj,
      };
      const response = await instance1.put(`/receber/${id}`, preparedData);
      navigate(0);
      showSuccessMessage(response.data.messagem || "Contas a receber atualizada com sucesso!");
    } catch (error) {
      if (error.response && error.response.data) {
        showErrorMessage(error.response.data);
      } else {
        showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  function determineMask(value) {
    return tipoDocumento === 'CNPJ' ? "99.999.999/9999-99" : "999.999.999-99";
  }

  const handleDataReceberChange = (event) => {
    const value = event.target.value;
    const today = new Date().toISOString().split('T')[0]; // Data atual no formato 'YYYY-MM-DD'

    if (value > today) {
      showErrorMessage("A data recebida não pode ser posterior à data atual.");
      return; // Não atualiza o estado se a data for inválida
    }

    setDataReceber(value);
  };


  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-max h-full">
          <div className="grid grid-cols-1 gap-4 max-w-full mt-2 mx-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">Contas a receber</h2>
          </div>
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <CheckList
              descricao="Status:"
              value={status}
              onChange={setStatus}
              inputComponent={
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                  disabled // Adiciona esta propriedade para desativar o campo
                >
                  <option value="Aberto">Aberta</option>
                  <option value="Fechado">Fechado</option>
                  <option value="Parcial">Pago Parcial</option>
                  <option value="Atrasado">Atrasada</option>
                </select>
              }
            />
            <CheckList
              descricao="*Vencimento:"
              value={vencimento}
              onChange={setVencimento}
              mensagemError="O campo Vencimento não pode estar vazio"
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
              descricao="*Valor a Receber:"
              value={valorReceber}
              onChange={handleInputChange(setValorReceber)}
              mensagemError="O campo Valor a Receber não pode estar vazio"
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
              mensagemError="O campo Parcelas não pode estar vazio"
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
              descricao="Forma de Pagamento:"
              value={`${formaPagamento}`}
              readOnly
              onChange={setFormaPagamento} // Mantém a funcionalidade de mudar o valor atual
            />
            <BuscarPagamento key={`pagamento-${formKey}`} formaPag="Nova forma de Pagamento:" onSelectPagamento={handleSelectPagamento} />
            <CheckList
              descricao="Categoria:"
              value={`${selectedCategoria}`}
              onChange={setSelectedCategoria} // Mantém a funcionalidade de mudar o valor atual
            />
            <div className="mt-5">
              <BuscarCategoria key={`categoria-${formKey}`} formaCat="Nova categoria:" onSelectCategoria={handleSelectCategoria} />
            </div>
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
              descricao="Juros Diario:"
              value={juros}
              onChange={handleInputChange(setJuros)}
              readOnly
              inputComponent={
                <NumericFormat
                  value={juros}
                  onValueChange={(values) => {
                    const { value } = values;
                    setJuros(value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  readOnly
                  prefix="R$ "
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              descricao="Multa Mensal:"
              value={multa}
              onChange={handleInputChange(setMulta)}
              readOnly
              inputComponent={
                <NumericFormat
                  value={multa}
                  onValueChange={(values) => {
                    const { value } = values;
                    setMulta(value);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  readOnly
                  prefix="R$ "
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              }
            />
            <CheckList
              descricao="Desconto:"
              value={descontos}
              onChange={handleInputChange(setDescontos)}
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
              descricao="Valor Pago:"
              value={valorPago}
              onChange={handleInputChange(setValorPago)}
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
              descricao="valor em aberto:"
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
            <div className="flex gap-1">
              <div>
                <select
                  id="tipoDocumento"
                  value={tipoDocumento}
                  onChange={(e) => setTipoDocumento(e.target.value)}
                  className="ml-36 -mt-1.5 border rounded-md focus:outline-none focus:border-blue-500 absolute"
                >
                  <option value="CPF">CPF</option>
                  <option value="CNPJ">CNPJ</option>
                </select>
              </div>
              <CheckList
                types="text"
                descricao="*CPF/CNPJ:"
                value={cpfCnpj}
                onChange={setCpfCnpj}
                menssagemError=""
                inputComponent={
                  <InputMask
                    ref={inputRef}
                    mask={determineMask()}
                    value={cpfCnpj}
                    placeholder={tipoDocumento === "CNPJ" ? "12.312.332/0001-51" : "135.477.445-02"}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                }
              />
            </div>
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
            <CheckList
              descricao="*Cliente:"
              types="text"
              value={cliente}
              onChange={(e) => setCliente(e.target.value.toUpperCase())}
              placeholderInput="Digite o nome do cliente"
              menssagemError=""
              inputComponent={
                <input
                  type="text"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase"
                  required
                  readOnly
                />
              }
            />
            <div className="flex flex-col  gap-1">
              <label className="block text-gray-700 font-medium ">
                <span className="block font-medium text-sm text-slate-700">Recibo:</span>
                <input
                  type="text"
                  value={recibo}
                  onChange={(e) => setRecibo(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:border-blue-500"
                />
              </label>
            </div>
          </div>
          {recibo && (
            <button
              type="button"
              onClick={() => window.open(recibo, '_blank')}
              className="ml-2 p-1 py-1 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Abrir Recibo
            </button>
          )}
          <label htmlFor="descricao" className="block text-gray-700 font-medium mt-2 mx-2">
            <span className="block text-sm font-medium text-slate-700">Observação:</span>
            <textarea
              id="descricao"
              name="descricao"
              value={obs}
              onChange={(event) => setObs(event.target.value.toUpperCase())}
              className="w-full px-3 py-2 border rounded-md focus:outline-none text-base focus:border-blue-500"
              placeholder="Digite aqui..."
              rows="4"
            ></textarea>
          </label>
          <div className="flex flex-row justify-end">
            <BotaoAtualizar onClick={handleSubmit} />
            <BotaoVoltar />
            {/* <PdfRelatorioFull id={id} /> */}
          </div>
        </div>
      </form>
      <Mensagem successMessage={successMessage} errorMessage={errorMessage} />
    </>
  );
}
