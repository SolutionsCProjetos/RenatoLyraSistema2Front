// Navcliente.js
import { useState } from "react";
import Sectores from "../config/sectors/buscar";
import Payment from "../config/payment/buscar";
import Category from "../config/category/buscar";
import Comercio from "../config/negocio/buscar";

const NavConfig = () => {
    const [view, setView] = useState("sectores"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-black"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-72 border-gray-200 mb-4">
                <div className="flex space-x-4">
                    <button className={getTabClass("sectores")} onClick={() => setView("sectores")}>
                        Setor
                    </button>
                    <button className={getTabClass("payment")} onClick={() => setView("payment")}>
                        Pagamentos
                    </button>
                    <button className={getTabClass("category")} onClick={() => setView("category")}>
                        Categorias
                    </button>
                    <button className={getTabClass("comercio")} onClick={() => setView("comercio")}>
                        Ramo comerciais
                    </button>
                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "sectores" && <Sectores />}
                {view === "payment" && <Payment />}
                {view === "category" && <Category />}
                {view === "comercio" && <Comercio />}
            </div>
        </div>
    );
};

export default NavConfig;