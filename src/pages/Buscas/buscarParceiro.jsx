import React, { useEffect, useState, useContext } from "react";
import { instance1 } from "../../api/axios";
import { AuthContext } from "../../components/AuthContext";

export default function SearchParceiro({ onSelectParceiro, initiaParceiro, parceiroSel }) {
  const { user } = useContext(AuthContext);
  const [parceiro, setParceiro] = useState([]);
  const [query, setQuery] = useState(initiaParceiro ? initiaParceiro.parceiro : "");
  const [parceiroSelecionado, setParceiroSelecionado] = useState(null);

  // Buscar parceiros do backend
  const fetchParceiro = async () => {
    try {
      const response = await instance1.get(`/parceiro`);
      setParceiro(response.data);
    } catch (err) {
      console.error("Erro ao buscar os parceiros: ", err);
    }
  };

  useEffect(() => {
    fetchParceiro();
  }, []);

  useEffect(() => {
    if (user?.rule === 2 && user?.id) {
      // Seleciona automaticamente parceiro para rule === 2
      setQuery(user.nome);
      setParceiroSelecionado(user.id);
      onSelectParceiro(user.id);
    } else if (initiaParceiro) {
      setQuery(initiaParceiro.parceiro);
      setParceiroSelecionado(initiaParceiro.id);
    }
  }, [user, initiaParceiro, onSelectParceiro]);

  const handleSelectChange = (event) => {
    const parceiroId = parseInt(event.target.value, 10);
    const parceiroSelecionado = parceiro.find((parceiro) => parceiro.id === parceiroId);
    if (parceiroSelecionado) {
      setQuery(parceiroSelecionado.razaoSocial);
      setParceiroSelecionado(parceiroId);
      onSelectParceiro(parceiroId);
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center mt-5 relative">
        <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{parceiroSel}</span>
        <select
          value={parceiroSelecionado || ""}
          onChange={user?.rule !== 2 ? handleSelectChange : undefined}
          className={`mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
                     focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
                     disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
                     invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none
                     ${user?.rule === 2 ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
          disabled={user?.rule === 2}
        >
          <option value="">Selecione um parceiro</option>
          {parceiro.map((parceiro) => (
            <option key={parceiro.id} value={parceiro.id}>
              {parceiro.razaoSocial}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
