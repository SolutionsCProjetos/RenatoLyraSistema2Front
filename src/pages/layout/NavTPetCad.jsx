// Navcliente.js
import { useContext, useState } from "react";
import ListaCardio from "../anamnese/cardio/buscarCardio";
import ListaExame from "../anamnese/exameFisica/buscarExame";
import ListaGastro from "../anamnese/Gastro/buscarGastro";
import ListaLocoMotor from "../anamnese/locomotor/buscarLocoMotor";
import ListaManejo from "../anamnese/manejo/buscarManejo";
import ListaNeurologico from "../anamnese/neurologico/buscarNeurologico";
import ListaTegumenta from "../anamnese/tegumenta/buscarTegumenta";
import ListaUrinario from "../anamnese/urinario/buscarUrinario";
import { AuthContext } from "../../components/AuthContext";

const NavPetAnamnese = () => {
    const { user } = useContext(AuthContext);
    const [view, setView] = useState("exame"); // Define "cliente" como a visualização inicial

    // Função para definir a aba ativa
    const getTabClass = (tab) =>
        `px-4 py-2 text-lg font-semibold ${view === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-600"
        } cursor-pointer hover:text-blue-500`;

    return (
        <div className="relative w-full h-full shadow-lg">
            {/* Navegação em abas */}
            <nav className="flex border-b mx-40 border-gray-200">
                <div className="flex space-x-4">
                    <button className={getTabClass("exame")} onClick={() => setView("exame")}>
                        Exame físico
                    </button>
                    <button className={getTabClass("cardio")} onClick={() => setView("cardio")}>
                        Sistema cardio
                    </button>
                    <button className={getTabClass("gastro")} onClick={() => setView("gastro")}>
                        Sistema gastro
                    </button>
                    <button className={getTabClass("locomotor")} onClick={() => setView("locomotor")}>
                        Sistema locomotor
                    </button>
                    <button className={getTabClass("manejo")} onClick={() => setView("manejo")}>
                        Sistema manejo
                    </button>
                    <button className={getTabClass("neuro")} onClick={() => setView("neuro")}>
                        Sistema neurologico
                    </button>
                    <button className={getTabClass("tegumenta")} onClick={() => setView("tegumenta")}>
                        Sistema Tegumenta
                    </button>
                    <button className={getTabClass("urina")} onClick={() => setView("urina")}>
                        Sistema Urinario
                    </button>

                </div>
            </nav>

            {/* Conteúdo da aba */}
            <div className="content">
                {view === "exame" && <ListaExame />}
                {view === "cardio" && <ListaCardio />}
                {view === "gastro" && <ListaGastro />}
                {view === "locomotor" && <ListaLocoMotor />}
                {view === "manejo" && <ListaManejo />}
                {view === "neuro" && <ListaNeurologico />}
                {view === "tegumenta" && <ListaTegumenta />}
                {view === "urina" && <ListaUrinario />}
                {/* Substitua por <Pet /> caso tenha o componente */}
            </div>
        </div>
    );
};

export default NavPetAnamnese;
