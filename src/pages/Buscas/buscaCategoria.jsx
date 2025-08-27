import React, { useEffect, useState } from "react";
import { instance1 } from "../../api/axios";

export default function SearchCategoria({ onSelectCategoria, initialCategoria, formaCat }) {
  const [categorias, setCategorias] = useState([]);
  const [query, setQuery] = useState(initialCategoria ? initialCategoria.categoria : "");
  const [categoriaSelecionado, setCategoriaSelecionado] = useState(!!initialCategoria);

  // Função para buscar todas as categorias
  const fetchCategorias = async () => {
    try {
      const response = await instance1.get(`/categoria`);
      setCategorias(response.data);
    } catch (err) {
      console.error("Erro ao buscar categorias: ", err);
    }
  };

  // Carregar categorias ao montar o componente
  useEffect(() => {
    fetchCategorias();
  }, []);

  // Efeito para setar a categoria inicial, se existir
  useEffect(() => {
    if (initialCategoria) {
      setQuery(initialCategoria.categoria);
      setCategoriaSelecionado(true);
    }
  }, [initialCategoria]);

  useEffect(() => {
    if (!initialCategoria) {
      setQuery(""); // Reseta o campo quando o formulário é reiniciado
      setCategoriaSelecionado(false);
    }
  }, [initialCategoria, categorias]); // Também adicionar `categorias` aqui para garantir que elas já foram carregadas
  

  // Função para lidar com a seleção da categoria
  const handleSelectChange = (event) => {
    const categoriaId = parseInt(event.target.value);
    const categoriaSelecionada = categorias.find((categoria) => categoria.id === categoriaId);
    if (categoriaSelecionada) {
      setQuery(categoriaSelecionada.categoria); // Presumindo que `nome` seja o campo correto
      onSelectCategoria(categoriaSelecionada);
      setCategoriaSelecionado(true);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center relative">
        <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{formaCat}</span>
        <select
          value={categoriaSelecionado ? categorias.find((categoria) => categoria.nome === query)?.id : ""}
          onChange={handleSelectChange}
          className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                     focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                     disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                     invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
        >
          <option value="">Selecione uma Categoria</option>
          {categorias.map((categoria) => (
            <option key={categoria.id} value={categoria.id}>
              {categoria.categoria} {/* Presumindo que `nome` seja o campo correto */}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
