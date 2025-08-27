import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { instance1 } from "../../../../api/axios";
import ConfirmationModal from "../../../layout/modal/Delete";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { Link } from "react-router-dom";
import { BotaoFiltrar, BotaoLimpar, BotaoNovo } from "../../../../components/Butons";

function CustomInput({ onClick }) {
    return (
        <button className="example-custom-input" onClick={onClick}>
            <FaCalendarAlt size={26} />
        </button>
    );
}

export default function SearchRaca() {
    const [dadosOriginais, setDadosOriginais] = useState([]);
    const [cadastros, setCadastros] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [cadastroIdToDelete, setCadastroIdToDelete] = useState(null);
    const itemsPerPage = 5;
    const inputRef = useRef(null);
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

    useEffect(() => {
        fetchCadastros();
        inputRef.current.focus();
    }, []);

    const openModal = (id) => {
        setCadastroIdToDelete(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCadastroIdToDelete(null);
    };

    const handleConfirmDelete = async () => {
        if (cadastroIdToDelete !== null) {
            try {
                const response = await instance1.delete(`/raca/${cadastroIdToDelete}`);
                if (response.status === 200) {
                    setCadastros(prevCadastros => prevCadastros.filter(cadastro => cadastro.id !== cadastroIdToDelete));
                    setDadosOriginais(prevCadastros => prevCadastros.filter(cadastro => cadastro.id !== cadastroIdToDelete));
                    showSuccessMessage(response.data.message || "Sucesso ao deletar.");
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    showWarningMessage(error.response.data.message);
                } else {
                    showErrorMessage("Erro ao tentar a conexão com o banco!");
                }
            } finally {
                closeModal();
            }
        }
    };

    const fetchCadastros = async () => {
        try {
            const response = await instance1.get("/raca");
            const cadastrosComData = response.data.map(cadastro => {
                // Verifique o formato da data recebido e ajuste a formatação conforme necessário
                return {
                    ...cadastro,
                    createdAt: cadastro.createdAt // Supondo que o formato já esteja correto
                };
            });
            setDadosOriginais(cadastrosComData);
            setCadastros(cadastrosComData);
        } catch (error) {
            console.error("Erro ao buscar os dados do backend: ", error);
            showErrorMessage("Erro ao carregar as raças.");
        }
    };

    const searchFilters = () => {
        let filteredData = dadosOriginais;

        if (tempSearchTerm.trim() !== '') {
            filteredData = filteredData.filter(item => {
                const itemData = `${item.raca}`.toUpperCase();
                const textData = tempSearchTerm.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
        }

        let formattedDate = null;
        if (selectedDate) {
            formattedDate = selectedDate.toISOString().split('T')[0];
            filteredData = filteredData.filter(item => item.createdAt === formattedDate);
        }

        setCadastros(filteredData);
        setCurrentPage(1);

        // Buscar dados do relatório
        const nome = tempSearchTerm;
        const createdAt = selectedDate ? formattedDate : null;
        const dataFinal = selectedDate ? formattedDate : null;
        fetchRelatorio(nome, createdAt, dataFinal);
    };

    const limparFiltro = () => {
        setSearchTerm('');
        setTempSearchTerm('');
        setSelectedDate(null);
        setCadastros(dadosOriginais);
        setCurrentPage(1);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            searchFilters();
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCadastros = cadastros.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(cadastros.length / itemsPerPage);

    const handleClickPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getPageNumbers = () => {
        const maxPageButtons = 15;
        const startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
        const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };
    return (
        <div className="flex justify-center items-center ">
            <div className="flex flex-col mx-4 items-center w-auto">
                <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl sm:mb-0">
                    <div className="grid grid-cols-1 gap-4 max-w-full mx-3">
                        <h2 className="text-2xl text-black underline col-start-1 row-start-1">Lista das raças</h2>
                        <div className="relative flex justify-end items-center mb-4">
                            <div className="relative w-4/5 mr-2">
                                <input
                                    ref={inputRef}
                                    className="mr-2 px-1 py-1 bg-white w-full"
                                    value={tempSearchTerm}
                                    onChange={(e) => setTempSearchTerm(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    type="button"
                                    className="absolute right-0 -top-1 mt-3 mr-3 flex items-center"
                                    onClick={searchFilters}
                                >
                                    <FaSearch size={17} />
                                </button>
                            </div>
                            <DatePicker
                                selected={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                customInput={<CustomInput />}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Selecione uma data"
                                className="mr-2"
                            />
                            <BotaoFiltrar onClick={searchFilters} />
                            <BotaoLimpar onClick={limparFiltro} />
                        </div>
                        <table className="min-w-full">
                            <thead className="bg-hearder-blue text-white">
                                <tr>
                                    <th className="px-4 py-2  border border-black">Raça</th>
                                    <th className="py-2 px-4  border border-black">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCadastros.map(cadastro => (
                                    <tr key={cadastro.id}>
                                        <td className="border px-4 py-2 border-black">{cadastro.raca}</td>
                                        <td className="border px-4 py-2 border-black">
                                            <Link to={`/irl/raca/${cadastro.id}`} className="text-blue-900 hover:text-blue-950 mx-1.5">
                                                Editar
                                            </Link>
                                            <button onClick={() => openModal(cadastro.id)} className="text-red-600 hover:text-red-950">Deletar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end">
                            <Link to={`/irl/raca`} className="block text-sm font-semibold">
                                <BotaoNovo onClick={limparFiltro} />
                            </Link>
                        </div>
                        <div className="flex justify-center mt-4 mb-4">
                            <button
                                onClick={() => handleClickPage(1)}
                                className={`mx-1 px-3 py-1 border rounded ${currentPage === 1 ? 'bg-teal-900 text-white' : 'bg-white text-emerald-800'}`}
                            >
                                Primeiro
                            </button>
                            {getPageNumbers().map(pageNumber => (
                                <button
                                    key={pageNumber}
                                    onClick={() => handleClickPage(pageNumber)}
                                    className={`mx-1 px-3 py-1 border rounded ${currentPage === pageNumber ? 'bg-teal-900 text-white' : 'bg-white text-emerald-800'}`}
                                >
                                    {pageNumber}
                                </button>
                            ))}
                            <button
                                onClick={() => handleClickPage(totalPages)}
                                className={`mx-1  px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-teal-900 text-white' : 'bg-white text-emerald-800'}`}
                            >
                                Último
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                show={showModal}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                descricao={`raça`}
            />
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </div>
    );
}
