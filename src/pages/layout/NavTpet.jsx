// Navcliente.js
import { useContext, useState } from "react";
import PetPut from "../pet/atualizar/putPet";
import PetGeral from "../pet/geral";
import { AuthContext } from "../../components/AuthContext";

const NavPetGeral = () => {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState("exame"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full h-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-9 border-gray-200">
                <div className="flex space-x-4">
                    <button className={getTabClass("pet")} onClick={() => setView("pet")}>
                        Cadastro
                    </button>
                    <button className={getTabClass("geral")} onClick={() => setView("geral")}>
                        Informações Gerais
                    </button>

                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "pet" && <PetPut />}
                {view === "geral" && <PetGeral />}
                {/* Substitua por <Pet /> caso tenha o componente */}
            </div>
        </div>
    );
};

export default NavPetGeral;
