import React, { useState, useEffect } from "react";
import { instance1 } from "../../api/axios";
import { Link } from "react-router-dom";
import fundoImage from "../../assets/HomeRena.png";
import { BotaoEditar } from "../../components/Butons";

export default function PushOperacao() {
  const [operacoesPorUsuario, setOperacoesPorUsuario] = useState({});
  const [filtrosStatus, setFiltrosStatus] = useState({});

  useEffect(() => {
    const fetchOperacoes = async () => {
      try {
        const response = await instance1.get(`/userOpe`);
        if (response.status !== 200) {
          throw new Error("Erro ao buscar as operações");
        }

        const operacoesAgrupadas = response.data.reduce((acc, operacao) => {
          const { usuario } = operacao;
          if (!acc[usuario.nome]) {
            acc[usuario.nome] = [];
          }
          acc[usuario.nome].push(operacao);
          return acc;
        }, {});

        setOperacoesPorUsuario(operacoesAgrupadas);
      } catch (error) {
        console.error("Erro ao buscar as operações:", error);
      }
    };

    fetchOperacoes();
  }, []);

  const handleFiltroStatusChange = (usuarioNome, status) => {
    setFiltrosStatus((prevState) => ({
      ...prevState,
      [usuarioNome]: status,
    }));
  };

  const filtrarOperacoes = (operacoes, filtroStatus) => {
    if (filtroStatus === "Todos" || !filtroStatus) {
      return operacoes.filter(
        (operacao) =>
          operacao.status === "Aberto" ||
          operacao.status === "Andamento" ||
          operacao.status === "Atrasado"
      );
    }
    return operacoes.filter((operacao) => operacao.status === filtroStatus);
  };

  if (Object.keys(operacoesPorUsuario).length === 0) {
    return (
      <div className="flex h-screen -mt-20 items-center justify-center">
        <img src={fundoImage} alt="Loading..." />
      </div>
    );
  }

  return (
    <div className="p-2 flex justify-center">
      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 w-[90%] mx-auto">
        {Object.entries(operacoesPorUsuario).map(([usuarioNome, operacoes]) => (
          <div
            key={usuarioNome}
            className="bg-esmerald-cust rounded shadow-xl w-full"
          >
            <div className="flex justify-between items-center p-2 bg-esmerald-cust rounded-t">
              <span className="text-lg font-normal ml-2">{usuarioNome}</span>
              <select
                className="bg-white text-black p-1 rounded"
                value={filtrosStatus[usuarioNome] || "Todos"}
                onChange={(e) =>
                  handleFiltroStatusChange(usuarioNome, e.target.value)
                }
              >
                <option value="Todos">Todos</option>
                <option value="Aberto">Aberto</option>
                <option value="Andamento">Em andamento</option>
              </select>
            </div>
            <div
              className="text-black rounded-b h-72 overflow-y-auto"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <table className="min-w-full table-fixed w-full">
                <thead className="bg-hearder-blue text-white">
                  <tr>
                    <th className="w-[22%] px-2 py-2 text-left sticky top-0 bg-hearder-blue z-10">
                      <div className="flex justify-center items-center">
                        Data início
                      </div>
                    </th>
                    <th className="w-[24%] px-2 py-2 text-left sticky top-0 bg-hearder-blue z-10">
                      <div className="flex justify-center items-center">
                        Data finalização
                      </div>
                    </th>
                    <th className="w-[39%] px-2 py-2 text-left sticky top-0 bg-hearder-blue z-10">
                      <div className="flex justify-center items-center">
                        Atividade
                      </div>
                    </th>
                    <th className="w-[15%] px-2 py-2 text-center sticky top-0 bg-hearder-blue z-10">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtrarOperacoes(operacoes, filtrosStatus[usuarioNome]).map(
                    (operacao) => (
                      <tr key={operacao.id} className={"border-b"}>
                        <td className="w-[15%] px-2 py-2">
                          <div className="flex justify-center items-center">
                            {new Date(operacao.startDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td
                          className={`w-[15%] px-2 py-2 ${
                            operacao.status === "Atrasado" ? "text-red-600" : ""
                          }`}
                        >
                          <div className="flex justify-center items-center">
                            {new Date(operacao.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="w-[55%] px-2 py-2">
                          <div className="flex justify-center items-center">
                            {operacao.atividade.length > 60
                              ? `${operacao.atividade.slice(0, 60)}...`
                              : operacao.atividade}
                          </div>
                        </td>
                        <td className="w-[15%] px-2 py-2">
                          <div className="flex justify-center items-center">
                            <Link to={`/irl/putOperacao/${operacao.id}`}>
                              <BotaoEditar />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
