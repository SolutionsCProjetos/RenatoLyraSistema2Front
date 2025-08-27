import React, { useState, useEffect, useContext } from "react";
import { instance1 } from "../../api/axios";
import { AuthContext } from "../../components/AuthContext";

export default function SolicitanteSearch({ onSelectSolicitante, initialSolicitante, titulo }) {
  const { user } = useContext(AuthContext);
  const [solicitantes, setSolicitantes] = useState([]);
  const [query, setQuery] = useState("");
  const [solicitanteSelecionado, setSolicitanteSelecionado] = useState(initialSolicitante || null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSolicitantes = async () => {
      try {
        const response = await instance1.get(`/solicitante`);
        setSolicitantes(response.data);
      } catch (error) {
        console.error("Erro ao buscar os solicitantes:", error);
      }
    };
    fetchSolicitantes();
  }, []);

  useEffect(() => {
    if (initialSolicitante) {
      setQuery(initialSolicitante.nomeCompleto || "");
      setSolicitanteSelecionado(initialSolicitante);
    }
  }, [initialSolicitante]);

  const handleSelect = (solicitante) => {
    setSolicitanteSelecionado(solicitante);
    setQuery(solicitante.nomeCompleto);
    setShowDropdown(false);
    onSelectSolicitante(solicitante);
  };

  const solicitanteFiltrados = solicitantes.filter((m) =>
    (m.nomeCompleto?.toLowerCase() || "").includes(query.toLowerCase()) ||
    (m.cpf?.toLowerCase() || "").includes(query.toLowerCase())
  );

  return (
    <div className="w-full relative">
      <label className="text-sm font-medium text-slate-700">{titulo}</label>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowDropdown(true);
        }}
        onFocus={() => setShowDropdown(true)}
        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay para permitir clique
        placeholder="Digite o nome ou CPF"
        className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-sky-500"
      />

      {showDropdown && solicitanteFiltrados.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-auto mt-1 shadow-lg">
          {solicitanteFiltrados.map((solicitante) => (
            <li
              key={solicitante.id}
              onClick={() => handleSelect(solicitante)}
              className="px-3 py-2 hover:bg-sky-100 cursor-pointer text-sm"
            >
              {solicitante.nomeCompleto} - {solicitante.cpf}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
