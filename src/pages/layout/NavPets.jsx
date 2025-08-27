// Navcliente.js
import { useState } from "react";
import Raca from "../pet/racas/buscar";
import Pet from "../pet/buscar/pets";
import Vacina from "../pet/vacinas/buscar"

const NavPets = () => {
    const [view, setView] = useState("pet"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${
            view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full h-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-28 border-gray-200 mb-4">
                <div className="flex space-x-4">
                    <button className={getTabClass("pet")} onClick={() => setView("pet")}>
                        Pet
                    </button>
                    <button className={getTabClass("raca")} onClick={() => setView("raca")}>
                        Raças
                    </button>
                    <button className={getTabClass("vacina")} onClick={() => setView("vacina")}>
                        Vacinas
                    </button>
                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "pet" && <Pet />}
                {view === "raca" && <Raca />}
                {view === "vacina" && <Vacina />}
            </div>
        </div>
    );
};

export default NavPets;
