import React, { useEffect, useState, useCallback } from "react";
import { instance1 } from "../../api/axios";

export default function SearchPet({ onSelectPet, initiaPet, petSel }) {
    const [pet, setPet] = useState([]);
    const [query, setQuery] = useState(initiaPet ? initiaPet.pet : "");
    const [petSelecionado, setpetSelecionado] = useState(!!initiaPet);
  
    // Função para buscar pet no backend
    const fetchPet = async () => {
      try {
        const response = await instance1.get(`/pet`);
        setPet(response.data);
      } catch (err) {
        console.error("Erro ao buscar os pets: ", err);
      }
    };
  
    // Efeito para carregar pet ao montar o componente
    useEffect(() => {
      fetchPet();
    }, []);
  
    // Efeito para setar o tipo inicial, se existir
    useEffect(() => {
      if (initiaPet) {
        setQuery(initiaPet.tipo);
        setpetSelecionado(true);
      }
    }, [initiaPet]);
  
    // Função para lidar com a seleção do tipo
    const handleSelectChange = (event) => {
      const petId = parseInt(event.target.value);
      const petSelecionado = pet.find((pet) => pet.id === petId);
      if (petSelecionado) {
        setQuery(petSelecionado.nomePet);
        onSelectPet(petSelecionado.id); // Passa o ID do tipo
        setpetSelecionado(true);
      }
    };
  
    return (
      <div className="flex items-center">
        <div className="flex items-center mt-5 relative">
          <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{petSel}</span>
          <select
            value={petSelecionado ? pet.find((pet) => pet.nomePet === query)?.id : ""}
            onChange={handleSelectChange}
            className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                       focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                       disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                       invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
          >
            <option value="">Selecione um pet</option>
            {pet.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.nomePet}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
}
  