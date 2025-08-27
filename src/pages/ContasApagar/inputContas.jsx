import React, { useState, useRef, useEffect } from "react";
import { instance1 } from "../../api/axios";
import CheckList from "../checkList";
import InputMask from "react-input-mask";
import { NumericFormat } from 'react-number-format';
import useMensagem from "../layout/hooks/useMensagem";
import Mensagem from "../layout/hooks/Mensagem";
import BuscarCategoria from "../Buscas/buscaCategoria";
import { BotaoGravar, BotaoVoltar } from "../../components/Butons";

export default function ContasApagar() {
    const [formKey, setFormKey] = useState(Date.now());
    const [cnpj, setCnpj] = useState('');
    const [situacao, setSituacao] = useState('');
    const [vencimento, setVencimento] = useState('');
    const [fornecedor, setFornecedor] = useState('');
    const [historico, setHistorico] = useState('');
    const [dataPagamento, setDataPagamento] = useState('');
    const [valorTotal, setValorTotal] = useState(0);
    const [parcelas, setParcelas] = useState(1);
    const [selectedCategoria, setSelectedCategoria] = useState("");
    const [juros, setJuros] = useState(0);
    const [desconto, setDesconto] = useState(0);
    const [valorPago, setValorPago] = useState(0);
    const [valorEmAberto, setValorEmAberto] = useState('');
    const [recibo, setRecibo] = useState('');
    const [empresa, setEmpresa] = useState("");
    const [obs, setObs] = useState('');
    const [tipoDocumento, setTipoDocumento] = useState('CNPJ');
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();
    const inputRef = useRef(null);

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!fornecedor.trim()) {
            showWarningMessage('O fornecedor é obrigatório!');
            return;
        } else if (!vencimento.trim()) {
            showWarningMessage('A data do vencimento é obrigatória!');
            return;
        } else if (!valorTotal) {
            showWarningMessage("O campo do valor total da conta é obrigatório.");
            return;
        }

        const formattedDataPagamento = dataPagamento ? dataPagamento : null;
        const formattedJuros = juros ? parseFloat(juros) : 0.00;
        const formattedDesconto = desconto ? parseFloat(desconto) : 0.00;
        const formattedValorPago = valorPago ? parseFloat(valorPago) : 0.00;
        const formattedValorEmAberto = valorEmAberto ? parseFloat(valorEmAberto) : 0.00;

        // Calcula a situação com base nos valores
        let situacao;
        if (formattedValorEmAberto <= 0) {
            situacao = "Paga";
        } else if (formattedValorPago > 0 && formattedValorPago < (parseFloat(valorTotal) + formattedJuros - formattedDesconto)) {
            situacao = "Pago parcial";
        } else {
            situacao = "Em aberto";
        }

        try {
            const response = await instance1.post('/pagar', {
                cnpj,
                situacao,
                vencimento,
                fornecedor,
                historico,
                dataPagamento: formattedDataPagamento,
                valorTotal: parseFloat(valorTotal),
                parcelas,
                juros: formattedJuros,
                desconto: formattedDesconto,
                valorPago: formattedValorPago,
                valorEmAberto: formattedValorEmAberto,
                categoria: selectedCategoria.categoria,
                empresa,
                recibo,
                obs,
            });

            console.log("dados enviados:", response.data);
            clearForm();
            showSuccessMessage(response.data.message || "Contas a pagar cadastrada com sucesso!");
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.message || "Erro ao cadastrar o contas a pagar.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    };

    const handleSelectCategoria = (categoria) => {
        setSelectedCategoria(categoria);
    };

    const clearForm = () => {
        setCnpj('');
        setSituacao('');
        setVencimento('');
        setFornecedor('');
        setHistorico('');
        setDataPagamento('');
        setValorTotal(0);
        setParcelas(1);
        setJuros(0);
        setDesconto(0);
        setValorPago(0);
        setValorEmAberto(0);
        setEmpresa("");
        setSelectedCategoria('');
        setRecibo('');
        setObs('');
        setFormKey(Date.now());
    }

    return (
        <>
            <form key={formKey}>
                <div className=" bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
                    <div className="grid grid-cols-1 gap-4 ml-2">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Contas a Pagar</h2>
                    </div>
                    <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-1 mx-2 mt-4">
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
                                descricao="*Empresa:"
                                types="text"
                                value={empresa}
                                onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
                                messagemError=""
                                inputComponent={
                                    <input
                                        type="text"
                                        value={empresa}
                                        placeholder="Institudo RL"
                                        onChange={(e) => setEmpresa(e.target.value.toUpperCase())}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas

                                    />
                                }
                            />
                        </div>
                        <div className="flex gap-1 mt-5">
                            <BuscarCategoria key={`categoria-${formKey}`} formaCat="*Categoria:" onSelectCategoria={handleSelectCategoria} />
                        </div>
                        <div className="flex gap-1">
                            <CheckList
                                types="text"
                                descricao="*Fornecedor:"
                                value={fornecedor}
                                onChange={(e) => setFornecedor(e.target.value.toUpperCase())}
                                menssagemError=""
                                inputComponent={
                                    <input
                                        type="text"
                                        value={fornecedor}
                                        placeholder="PetsLife"
                                        onChange={(e) => setFornecedor(e.target.value.toUpperCase())}
                                        className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                                        required
                                    />
                                }
                            />
                        </div>
                        <div className="flex gap-1">
                            <CheckList
                                types="date"
                                descricao="*Vencimento:"
                                value={vencimento}
                                onChange={setVencimento}
                                menssagemError=""
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
                                menssagemError=""
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
                                required
                            />
                        </div>
                        <div className="flex gap-1">
                            <CheckList
                                descricao="*Parcelas:"
                                value={parcelas}
                                onChange={setParcelas}
                                messagemError=""
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
                        <div className="flex gap-1">
                            <CheckList
                                types="text"
                                descricao="Comprovante:"
                                value={recibo}
                                onChange={setRecibo}
                            />
                        </div>
                    </div>
                    <label htmlFor="descricao" className="block text-gray-700 font-medium mx-2 mt-2">
                        <span className="block font-medium text-sm text-slate-700">Observação:</span>
                        <textarea
                            id="descricao"
                            name="descricao"
                            value={obs}
                            onChange={(event) => setObs(event.target.value.toLocaleUpperCase())}
                            className="w-full px-3 py-2 border rounded-md text-base focus:outline-none focus:border-blue-500"
                            placeholder="Digite aqui..."
                            rows="4"
                        ></textarea>
                    </label>
                    <div className="flex flex-row justify-end mt-2">
                        <BotaoGravar onClick={handleSubmit} />
                        <BotaoVoltar />
                    </div>
                </div>
            </form>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </>
    );
}
