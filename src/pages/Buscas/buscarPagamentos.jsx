import React, { useEffect, useState } from "react";
import { instance1 } from "../../api/axios";

function SearchPagamento({ onSelectPagamento, initialPagamento, formaPag }) {
  const [pagamentos, setPagamentos] = useState([]);
  const [query, setQuery] = useState(initialPagamento ? initialPagamento.formasPagamento : "");
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(!!initialPagamento);

  // Função para buscar todas as formas de pagamento
  const fetchPagamentos = async () => {
    try {
      const response = await instance1.get(`/pagamento`);
      setPagamentos(response.data);
    } catch (err) {
      console.error("Erro ao buscar formas de pagamento: ", err);
    }
  };

  // Carregar formas de pagamento ao montar o componente
  useEffect(() => {
    fetchPagamentos();
  }, []);

  // Efeito para setar o pagamento inicial, se existir
  useEffect(() => {
    if (initialPagamento) {
      setQuery(initialPagamento.formasPagamento);
      setPagamentoSelecionado(true);
    }
  }, [initialPagamento]);

  useEffect(() => {
    if (!initialPagamento) {
      setQuery(""); // Reseta o campo quando o formulário é reiniciado
      setPagamentoSelecionado(false);
    }
  }, [initialPagamento, pagamentos]); // Também adicionar `pagamentos` aqui para garantir que eles já foram carregados
  

  // Função para lidar com a seleção do pagamento
  const handleSelectChange = (event) => {
    const pagamentoId = parseInt(event.target.value);
    const pagamentoSelecionado = pagamentos.find((pagamento) => pagamento.id === pagamentoId);
    if (pagamentoSelecionado) {
      setQuery(pagamentoSelecionado.formasPagamento);
      onSelectPagamento(pagamentoSelecionado);
      setPagamentoSelecionado(true);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center mt-5 relative">
        <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{formaPag}</span>
        <select
          value={pagamentoSelecionado ? pagamentos.find((pagamento) => pagamento.formasPagamento === query)?.id : ""}
          onChange={handleSelectChange}
          className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                     focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                     disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                     invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
        >
          <option value="">Selecione um pagamento</option>
          {pagamentos.map((pagamento) => (
            <option key={pagamento.id} value={pagamento.id}>
              {pagamento.formasPagamento}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SearchPagamento;
