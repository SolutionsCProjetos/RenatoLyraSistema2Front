import React, { useState, useEffect, useRef } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import { NumericFormat } from 'react-number-format';
import InputMask from "react-input-mask";
import { useParams, useNavigate } from "react-router-dom";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import BuscarCategoria from "../../Buscas/buscaCategoria";
import { BotaoAtualizar, BotaoVoltar } from "../../../components/Butons";

export default function ContasApagarPut() {
  const { id } = useParams();
  const [cnpj, setCnpj] = useState('');
  const [situacao, setSituacao] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [historico, setHistorico] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState("");
  const [novaCategoria, setNovaCategoria] = useState('');
  const [dataPagamento, setDataPagamento] = useState('');
  const [valorTotal, setValorTotal] = useState('');
  const [parcelas, setParcelas] = useState('');
  const [juros, setJuros] = useState('');
  const [desconto, setDesconto] = useState('');
  const [valorPago, setValorPago] = useState('');
  const [valorEmAberto, setValorEmAberto] = useState('');
  const [empresa, setEmpresa] = useState(null);
  const [obs, setObs] = useState('');
  const [recibo, setRecibo] = useState('');
  const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();
  const inputRef = useRef(null);
  const [formKey, setFormKey] = useState(Date.now());

  useEffect(() => {
    const fetchPagamento = async () => {
      try {
        const response = await instance1.get(`/pagar/${id}`);
        const data = response.data;

        setCnpj(data.cnpj);
        setSituacao(data.situacao);
        setVencimento(data.vencimento.split('T')[0]);
        setFornecedor(data.fornecedor);
        setHistorico(data.historico);
        setDataPagamento(data.dataPagamento ? data.dataPagamento.split('T')[0] : '');
        setValorTotal(data.valorTotal);
        setParcelas(data.parcelas);
        setJuros(data.juros);
        setDesconto(data.desconto);
        setValorPago(data.valorPago);
        setEmpresa(data.empresa);
        setRecibo(data.recibo);
        setSelectedCategoria(data.categoria);
        setObs(data.obs);

        // Calcula o valor em aberto na inicialização
        calcularValorEmAberto(data.valorTotal, data.juros, data.desconto, data.valorPago);
      } catch (error) {
        console.error("Erro ao buscar os dados do backend: ", error);
        showErrorMessage('Erro ao buscar os dados.');
      }
    };
    fetchPagamento();
  }, [id]);

  useEffect(() => {
    // Recalcula o valor em aberto sempre que os valores relacionados são alterados
    calcularValorEmAberto(valorTotal, juros, desconto, valorPago);
  }, [valorTotal, juros, desconto, valorPago]);

  const calcularValorEmAberto = (valorTotal, juros, desconto, valorPago) => {
    const total = parseFloat(valorTotal) || 0;
    const jurosValue = parseFloat(juros) || 0;
    const descontoValue = parseFloat(desconto) || 0;
    const valorPagoValue = parseFloat(valorPago) || 0;

    const valorComJuros = total + jurosValue;
    const valorFinal = valorComJuros - descontoValue;
    const valorEmAberto = valorFinal - valorPagoValue;

    setValorEmAberto(valorEmAberto.toFixed(2));
  };

  const handleSelectCategoria = (categoria) => {
    setNovaCategoria(categoria);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedDataPagamento = dataPagamento ? dataPagamento : null;
    const formattedParcelas = parcelas ? parcelas : null;
    const formattedJuros = juros ? parseFloat(juros) : 0.00;
    const formattedTotal = valorTotal ? parseFloat(valorTotal) : 0.00;
    const formattedDesconto = desconto ? parseFloat(desconto) : 0.00;
    const formattedValorPago = valorPago ? parseFloat(valorPago) : 0.00;
    const formattedValorEmAberto = valorEmAberto ? parseFloat(valorEmAberto) : 0.00;

    const categoriaAtualizada = novaCategoria.categoria ? novaCategoria.categoria : selectedCategoria;

    try {
      const response = await instance1.put(`/pagar/${id}`, {
        cnpj,
        vencimento,
        fornecedor,
        historico,
        dataPagamento: formattedDataPagamento,
        valorTotal: formattedTotal,
        parcelas: formattedParcelas,
        juros: formattedJuros,
        desconto: formattedDesconto,
        valorPago: formattedValorPago,
        categoria: categoriaAtualizada || null,
        valorEmAberto: formattedValorEmAberto,
        recibo,
        obs,
      });
      console.log(response.data);
      showSuccessMessage(response.data.message || "Contas a pagar atualizada com sucesso!");
    } catch (error) {
      if (error.response && error.response.data) {
        showErrorMessage(error.response.data.message || "Erro ao atualizada o contas a pagar.");
      } else {
        showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
      }
    }
  };

  function determineMask(value) {
    return tipoDocumento === 'CNPJ' ? "" : "999.999.999-99";
  }

  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
          <div className="grid grid-cols-1 gap-4 ml-2 mt-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">Contas a pagar</h2>
          </div>
          <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-1 mx-2 mt-4 ">
            <CheckList
              descricao="Empresa:"
              value={empresa}
              readOnly
              onChange={setEmpresa}
            />
            <div className="flex gap-1">
              <CheckList
                types="text"
                descricao="*CNPJ:"
                value={cnpj}
                onChange={setCnpj}
                menssagemError="O CNPJ da empresa não pode estar vazio!"
                inputComponent={
                  <InputMask
                    ref={inputRef}
                    mask="99.999.999/9999-99"
                    value={cnpj}
                    placeholder="12.312.332/0001-51"
                    onChange={(e) => setCnpj(e.target.value)}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                }
              />
            </div>
            <div className="flex gap-1">
              <CheckList
                types="text"
                descricao="*Situação:"
                value={situacao}
                readOnly
                required
              />
            </div>
            <CheckList
              descricao="Categoria:"
              value={`${selectedCategoria}`}
              onChange={setSelectedCategoria} // Mantém a funcionalidade de mudar o valor atual
            />
            <BuscarCategoria key={`categoria-${formKey}`} formaCat="Nova categoria:" onSelectCategoria={handleSelectCategoria} />
            <div className="flex gap-1">
              <CheckList
                types="text"
                descricao="*Fornecedor:"
                value={fornecedor}
                onChange={setFornecedor}
                menssagemError="O fornecedor é obrigatório!"
                required
              />
            </div>
            <div className="flex gap-1">
              <CheckList
                types="date"
                descricao="*Vencimento:"
                value={vencimento}
                onChange={setVencimento}
                menssagemError="A data do vencimento é obrigatória!"
                required
              />
            </div>
            <div className="flex gap-1">
              <CheckList
                types="text"
                descricao="Descrição:"
                value={historico}
                onChange={(e) => setHistorico(e.target.value.toUpperCase())}
                inputComponent={
                  <input
                    type="text"
                    value={historico}
                    onChange={(e) => setHistorico(e.target.value.toUpperCase())}
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  />
                }
              />
            </div>
            <div className="flex gap-1">
              <CheckList
                types="number"
                descricao="*Valor total a pagar:"
                value={valorTotal}
                onChange={setValorTotal}
                inputComponent={
                  <NumericFormat
                    value={valorTotal}
                    onValueChange={(values) => {
                      const { value } = values;
                      setValorTotal(value);
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
                menssagemError="O valor total é obrigatório!"
                required
              />

            </div>
            <div className="flex gap-1">
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
            </div>
            <div className="flex gap-1">
              <CheckList
                types="date"
                descricao="Data de Pagamento:"
                value={dataPagamento}
                onChange={setDataPagamento}
              />
            </div>

            <div className="flex gap-1">
              <CheckList
                types="number"
                descricao="Juros:"
                value={juros}
                onChange={setJuros}
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
                    prefix="R$ "
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                }
              />
            </div>
            <div className="flex gap-1">
              <CheckList
                types="number"
                descricao="Desconto:"
                value={desconto}
                onChange={setDesconto}
                inputComponent={
                  <NumericFormat
                    value={desconto}
                    onValueChange={(values) => {
                      const { value } = values;
                      setDesconto(value);
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
            </div>
            <div className="flex gap-1">
              <CheckList
                types="number"
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
                    required
                  />
                }
              />
            </div>
            <div className="flex gap-1">
              <CheckList
                types="number"
                descricao="Valor em Aberto:"
                value={valorEmAberto}
                inputComponent={
                  <NumericFormat
                    value={valorEmAberto}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="R$ "
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                    required
                  />
                }
                readOnly
              />
            </div>
          </div>
          <div className="flex ml-2 gap-1">
            <label className="block text-gray-700 font-medium ">
              <span className="block font-medium text-sm text-slate-700">Recibo:</span>
              <input
                type="text"
                value={recibo}
                onChange={(e) => setRecibo(e.target.value)}
                className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
              />
              {recibo && (
                <button
                  type="button"
                  onClick={() => window.open(recibo, '_blank')}
                  className="ml-2 p-1 py-1 absolute bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
                >
                  Abrir Recibo
                </button>
              )}
            </label>
          </div>
          <label htmlFor="descricao" className="block text-gray-700 font-medium mx-2">
            <span className="block font-medium text-sm text-slate-700">Observação:</span>
            <textarea
              id="descricao"
              name="descricao"
              value={obs}
              onChange={(event) => setObs(event.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:border-blue-500"
              placeholder="Digite aqui..."
              rows="4"
            ></textarea>
          </label>
          <div className="flex flex-row justify-end mt-2">
            <BotaoAtualizar onClick={handleSubmit} />
            <BotaoVoltar />
          </div>
        </div>
      </form>
      <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
    </>
  );
}
