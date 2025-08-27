import React, { useState, useEffect, useContext } from "react";
import { instance1 } from "../../api/axios";
import { AuthContext } from "../../components/AuthContext";

function OperadorSearch({ onSelectOperador, initialOperador, titulo }) {
  const { user } = useContext(AuthContext); // Recupera o usuário logado
  const [operadores, setOperadores] = useState([]);
  const [query, setQuery] = useState(initialOperador ? initialOperador.nome : "");
  const [operadorSelecionado, setOperadorSelecionado] = useState(!!initialOperador);
  const [isFocused, setIsFocused] = useState(false);

  const fetchOperadores = async () => {
    try {
      const response = await instance1.get(`/usuario`);
      setOperadores(response.data);
    } catch (error) {
      console.error("Erro ao buscar operadores:", error);
    }
  };

  useEffect(() => {
    fetchOperadores();
  }, []);

  useEffect(() => {
    if (initialOperador) {
      setQuery(initialOperador.nome);
      setOperadorSelecionado(true);
    } else if (user && operadores.length > 0) {
      const operadorLogado = operadores.find(op => op.nome === user.nome);
      if (operadorLogado) {
        setQuery(operadorLogado.nome);
        onSelectOperador(operadorLogado);
        setOperadorSelecionado(true);
      }
    }
  }, [initialOperador, user, operadores]);

  const handleSelectChange = (event) => {
    const selectedValue = event.target.value;

    if (selectedValue === "todos") {
      // Se "Todos" for selecionado, envia todos os IDs
      const todosOperadoresIds = operadores.map(op => op.id);
      onSelectOperador({ id: "todos", nome: "Todos", ids: todosOperadoresIds });
    } else {
      const operadorSelecionado = operadores.find(op => op.id === parseInt(selectedValue));
      if (operadorSelecionado) {
        onSelectOperador(operadorSelecionado);
      }
    }
  };

  return (
    <div className="flex items-center">
      <div className="flex items-center mt-5 relative">
        <span className="mr-2 absolute -mt-16 text-sm font-medium text-slate-700">{titulo}</span>
        <select
          value={operadorSelecionado ? operadores.find(op => op.nome === query)?.id : ""}
          onChange={handleSelectChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="mt-1 block w-52 px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
              focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50
              disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none invalid:border-red-500
              invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 appearance-none"
        >
          <option value="">Selecione um operador</option>
          
          {/* Se o rule do usuário for >= 1, mostra a opção "Todos" */}
          {user && user.rule >= 1 && (
            <option value="todos">Todos</option>
          )}

          {operadores.map((operador) => (
            <option key={operador.id} value={operador.id}>
              {operador.nome}
            </option>
          ))}
        </select>
        <div
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-transform duration-300 pointer-events-none mr-2 ${
            isFocused ? "rotate-180" : "rotate-0"
          }`}
        >
          ▼
        </div>
      </div>
    </div>
  );
}

export default OperadorSearch;
