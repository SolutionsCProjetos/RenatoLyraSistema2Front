// Navcliente.js
import { useContext, useState } from "react";
import ClientePut from "../client/atualizarCliente";
import { AuthContext } from "../../components/AuthContext";
import Financeiro from "../Receber/financeiroCliente";
import Pet from "../pet/petCliente";

const Navcliente = () => {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState("cliente"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full h-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-72 border-gray-200 mb-4">
                <div className="flex space-x-4">
                    <button className={getTabClass("cliente")} onClick={() => setView("cliente")}>
                        Cliente
                    </button>
                    {user && (user.rule === 1 || user.setor === 1 || user.setor === 4) && (
                        <button className={getTabClass("financeiro")} onClick={() => setView("financeiro")}>
                            Financeiro
                        </button>
                    )}
                    <button className={getTabClass("pet")} onClick={() => setView("pet")}>
                        Pet
                    </button>
                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "cliente" && <ClientePut />}
                {view === "financeiro" && <Financeiro />}
                {view === "pet" && <Pet />}
                {/* Substitua por <Pet /> caso tenha o componente */}
            </div>
        </div>
    );
};

export default Navcliente;
