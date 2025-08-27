import React, { useState, useEffect } from "react";
import { instance1 } from "../../api/axios";

export default function ModalVacinas({ vacinas: propsVacinas, vacinasAplicadas, onSelectVacinas }) {
    const [vacinasLocal, setVacinasLocal] = useState([]); // Evitar conflito com props
    const [selecionadas, setSelecionadas] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Atualiza o estado inicial com as vacinas aplicadas
    useEffect(() => {
        const vacinasInicializadas = propsVacinas.map((vacina) => ({
            ...vacina,
            selecionada: vacinasAplicadas.includes(vacina.nomeVacina),
        }));
        setVacinasLocal(vacinasInicializadas);
        setSelecionadas(vacinasInicializadas.filter((vacina) => vacina.selecionada));
    }, [propsVacinas, vacinasAplicadas]);

    const handleVacinaChange = (id) => {
        setVacinasLocal((prevVacinas) =>
            prevVacinas.map((vacina) =>
                vacina.id === id ? { ...vacina, selecionada: !vacina.selecionada } : vacina
            )
        );
    };

    const toggleModal = () => setModalOpen((prevState) => !prevState);

    const handleConfirm = () => {
        const vacinasSelecionadas = vacinasLocal.filter((vacina) => vacina.selecionada);
        if (onSelectVacinas) {
            onSelectVacinas(
                vacinasSelecionadas.map((vacina) => ({
                    id: vacina.id,
                    nomeVacina: vacina.nomeVacina,
                }))
            );
        }
        setModalOpen(false);
    };

    const handleCancel = () => {
        setModalOpen(false);
    };

    // Busca vacinas apenas quando o modal é aberto
    useEffect(() => {
        const fetchVacinas = async () => {
            try {
                setLoading(true);
                const response = await instance1.get(`/vacina`);
                const vacinas = response.data;

                const vacinasSincronizadas = vacinas.map((vacina) => ({
                    ...vacina,
                    selecionada: vacinasAplicadas.includes(vacina.nomeVacina),
                }));
                setVacinasLocal(vacinasSincronizadas);
            } catch (error) {
                console.error("Erro ao buscar vacinas:", error);
            } finally {
                setLoading(false);
            }
        };

        if (modalOpen) {
            fetchVacinas();
        }
    }, [modalOpen, vacinasAplicadas]);
    ;

    return (
        <div>
            <button
                type="button"
                onClick={toggleModal}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                aria-label="Abrir seleção de vacinas"
            >
                Selecionar Vacinas
            </button>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[90%] max-w-2xl shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Selecione as Vacinas</h3>
                        {loading ? (
                            <p className="text-center text-gray-500">Carregando vacinas...</p>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto">
                                {vacinasLocal.length > 0 ? (
                                    vacinasLocal.map((vacina) => (
                                        <div key={vacina.id} className="flex items-center justify-between mb-2">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={vacina.selecionada}
                                                    onChange={() => handleVacinaChange(vacina.id)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                    aria-label={`Selecionar ${vacina.nomeVacina}`}
                                                />
                                                <span>{vacina.nomeVacina}</span>
                                            </label>
                                            <span className={vacina.selecionada ? "text-green-500" : "text-gray-500"}>
                                                {vacina.selecionada ? "Selecionada" : "Não Selecionada"}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">Nenhuma vacina encontrada.</p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end mt-4 gap-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                aria-label="Cancelar seleção"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                aria-label="Confirmar seleção"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
