import React, { useEffect, useState, useCallback } from "react";
import { instance1 } from "../../api/axios";

export default function SearchSetor({ onSelectSetor, initialSetor, setorSel }) {
  const [setores, setSetores] = useState([]);
  const [query, setQuery] = useState(initialSetor ? initialSetor.setor : "");
  const [setorSelecionado, setSetorSelecionado] = useState(
    initialSetor?.id || ""
  );

  // Função para buscar setores no backend
  const fetchSetores = async () => {
    try {
      const response = await instance1.get(`/setor`);
      setSetores(response.data);
    } catch (err) {
      console.error("Erro ao buscar os setores: ", err);
    }
  };

  // Efeito para carregar setores ao montar o componente
  useEffect(() => {
    fetchSetores();
  }, []);

  // Efeito para setar o setor inicial, se existir
  useEffect(() => {
    if (initialSetor) {
      setSetorSelecionado(initialSetor.id);
      setQuery(initialSetor.setor);
    }
  }, [initialSetor]);

  // Função para lidar com a seleção do setor
  const handleSelectChange = (event) => {
  const setorId = parseInt(event.target.value);
  const setorEscolhido = setores.find((setor) => setor.id === setorId);
  if (setorEscolhido) {
    setSetorSelecionado(setorId);
    setQuery(setorEscolhido.setor);
    onSelectSetor(setorEscolhido); // envie o objeto todo se quiser
  } else {
    setSetorSelecionado("");
    setQuery("");
    onSelectSetor(null);
  }
};

  return (
    <div className="flex items-center">
      <div className="flex items-center mt-5 relative">
        <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">
          {setorSel}
        </span>
        <select
          value={setorSelecionado}
          onChange={handleSelectChange}
          className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                       disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                       invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
        >
          <option value="">Selecione um setor</option>
          {setores.map((setor) => (
            <option key={setor.id} value={setor.id}>
              {setor.setor}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
