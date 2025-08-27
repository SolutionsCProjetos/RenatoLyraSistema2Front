// Navcliente.js
import { useState } from "react";
import Receber from "../Receber/BuscarReceber";
import Contas from "../ContasApagar/buscarContas";

const NavFinanceiro = () => {
    const [view, setView] = useState("receber"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full h-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-28 border-gray-200 mb-4">
                <div className="flex space-x-4">
                    <button className={getTabClass("receber")} onClick={() => setView("receber")}>
                        Contas a receber
                    </button>
                    <button className={getTabClass("contas")} onClick={() => setView("contas")}>
                        Contas a pagar
                    </button>
                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "receber" && <Receber />}
                {view === "contas" && <Contas />}
            </div>
        </div>
    );
};

export default NavFinanceiro;
