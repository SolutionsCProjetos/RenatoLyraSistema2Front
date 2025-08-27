// NavParceiro.js
import { useContext, useState } from "react";
import Parceiroput from "../parceiros/atualizarParceiros";
import { AuthContext } from "../../components/AuthContext";
import Pet from "../pet/petParceiro";

const NavParceiro = () => {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState("parceiro"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full h-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-72 border-gray-200 mb-4">
                <div className="flex space-x-4">
                    <button className={getTabClass("parceiro")} onClick={() => setView("cliente")}>
                        Parceiro
                    </button>
                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "parceiro" && <Parceiroput />}
                {/* Substitua por <Pet /> caso tenha o componente */}
            </div>
        </div>
    );
};

export default NavParceiro;
