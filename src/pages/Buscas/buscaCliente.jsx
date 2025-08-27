import React, { useState, useEffect, useCallback, useContext } from "react";
import { instance1 } from "../../api/axios";
import { debounce } from "lodash";
import { AuthContext } from "../../components/AuthContext";
import CheckList from "../checkList";

function ClientSearch({ onSelectCliente, initialCliente, titulo }) {
  const { user } = useContext(AuthContext); // Pega o contexto da autenticação
  const [clientes, setClientes] = useState([]);
  const [query, setQuery] = useState(initialCliente ? initialCliente.razaoSocial : "");
  const [loading, setLoading] = useState(false);
  const [clientSelecionado, setClientSelecionado] = useState(!!initialCliente);

  const fetchCliente = async (query) => {
    if (query.length >= 1) {
      setLoading(true);
      try {
        const response = await instance1.get(`/cliente`);
        const filteredCliente = response.data.filter((client) =>
          client.razaoSocial.toLowerCase().includes(query.toLowerCase())
        );
        setClientes(filteredCliente);
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
      setLoading(false);
    } else {
      setClientes([]);
    }
  };

  const debouncedFetchCliente = useCallback(
    debounce((query) => fetchCliente(query), 300),
    []
  );

  useEffect(() => {
    if (!clientSelecionado) {
      debouncedFetchCliente(query);
    }
  }, [query, debouncedFetchCliente, clientSelecionado]);

  useEffect(() => {
    if (initialCliente) {
      setQuery(initialCliente.razaoSocial);
    }
  }, [initialCliente]);
  
  const handleInputChange = (value) => {
    setQuery(value);
    setClientSelecionado(false);
  };

  const handleSelectClient = (client) => {
    setQuery(client.razaoSocial); // Mostra o nome no campo
    onSelectCliente(client); // Passa o cliente selecionado (ou apenas o ID se preferir)
    setClientes([]); // Limpa a lista
    setClientSelecionado(true); // Define que o cliente foi selecionado
  };

  return (
    <div className="relative">
      <CheckList
        type="text"
        descricao={titulo}
        placeholderInput="Digite o nome do cliente"
        value={query} // Sempre mostra o nome
        onChange={handleInputChange}
        mensagemError=""
      />
      {clientes.length > 0 && query.length >= 1 && !clientSelecionado && (
        <ul
          className="absolute z-10 border bg-gray-200 border-gray-300 mt-0 max-h-60 overflow-y-auto rounded-b-lg shadow-lg"
          role="listbox"
        >
          {clientes.map((client) => (
            <li
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className="cursor-pointer px-3 py-2 hover:bg-neutral-500 hover:text-white flex items-center"
              role="option"
              aria-label={client.razaoSocial}
            >
              <div>
                <span>{client.razaoSocial}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      {!loading && clientes.length === 0 && query.length >= 1 && !clientSelecionado}
    </div>
  );
}

export default ClientSearch;
