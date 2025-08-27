import React, { useEffect, useState, useCallback } from "react";
import { instance1 } from "../../api/axios";

export default function SearchTipo({ onSelectTipo, initialTipo, tipoSel }) {
    const [comercio, setTipo] = useState([]);
    const [query, setQuery] = useState(initialTipo ? initialTipo.tipo : "");
    const [tipoSelecionado, settipoSelecionado] = useState(!!initialTipo);
  
    // Função para buscar comercio no backend
    const fetchTipo = async () => {
      try {
        const response = await instance1.get(`/tipo`);
        setTipo(response.data);
      } catch (err) {
        console.error("Erro ao buscar os comercio: ", err);
      }
    };
  
    // Efeito para carregar comercio ao montar o componente
    useEffect(() => {
      fetchTipo();
    }, []);
  
    // Efeito para setar o tipo inicial, se existir
    useEffect(() => {
      if (initialTipo) {
        setQuery(initialTipo.tipo);
        settipoSelecionado(true);
      }
    }, [initialTipo]);
  
    // Função para lidar com a seleção do tipo
    const handleSelectChange = (event) => {
      const comercioId = parseInt(event.target.value);
      const tipoSelecionado = comercio.find((comercio) => comercio.id === comercioId);
      if (tipoSelecionado) {
        setQuery(tipoSelecionado.comercio);
        onSelectTipo(tipoSelecionado.id); // Passa o ID do tipo
        settipoSelecionado(true);
      }
    };
  
    return (
      <div className="flex items-center">
        <div className="flex items-center mt-5 relative">
          <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{tipoSel}</span>
          <select
            value={tipoSelecionado ? comercio.find((comercio) => comercio.comercio === query)?.id : ""}
            onChange={handleSelectChange}
            className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                       disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                       invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
          >
            <option value="">Selecione um comercio</option>
            {comercio.map((comercio) => (
              <option key={comercio.id} value={comercio.id}>
                {comercio.comercio}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
}
  