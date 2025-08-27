import React, { useEffect, useState } from "react";
import { instance1 } from "../../api/axios";

export default function SearchRaca({ onSelectRaca, initialRaca, racaSel }) {
  const [racas, setRacas] = useState([]);
  const [query, setQuery] = useState(initialRaca ? initialRaca.raca : "");
  const [racaSelecionado, setRacaSelecionado] = useState(!!initialRaca);

  // Função para buscar raças no backend
  const fetchRacas = async () => {
    try {
      const response = await instance1.get(`/raca`);
      setRacas(response.data);
    } catch (err) {
      console.error("Erro ao buscar as raças: ", err);
    }
  };

  // Efeito para carregar raças ao montar o componente
  useEffect(() => {
    fetchRacas();
  }, []);

  // Efeito para setar a raça inicial, se existir
  useEffect(() => {
    if (initialRaca) {
      setQuery(initialRaca.raca); // Define a raça inicial no dropdown
      setRacaSelecionado(true);
    }
  }, [initialRaca]);

  // Função para lidar com a seleção da raça
  const handleSelectChange = (event) => {
    const racaSelecionada = event.target.value;
    setQuery(racaSelecionada);
    onSelectRaca(racaSelecionada); // Passa o nome da raça selecionada
    setRacaSelecionado(true);
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center mt-5 relative">
        <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{racaSel}</span>
        <select
          value={racaSelecionado ? query : ""}
          onChange={handleSelectChange}
          className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                     focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                     disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                     invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
        >
          <option value="">Selecione uma raça</option>
          {racas.map((raca) => (
            <option key={raca.raca} value={raca.raca}>
              {raca.raca}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
