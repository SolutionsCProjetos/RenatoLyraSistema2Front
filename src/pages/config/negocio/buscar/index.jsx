import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { instance1 } from "../../../../api/axios";
import ConfirmationModal from "../../../layout/modal/Delete";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../components/AuthContext";
import { BotaoNovo, BotaoLimpar, BotaoFiltrar, BotaoEditarT, BotaoDeletar } from "../../../../components/Butons";

function CustomInput({ onClick }) {
    return (
        <button className="example-custom-input" onClick={onClick}>
            <FaCalendarAlt size={26} />
        </button>
    );
}

export default function SearchRamo() {
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
                const response = await instance1.delete(`/tipo/${cadastroIdToDelete}`);
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
            const response = await instance1.get("/tipo");
            const cadastrosComData = response.data.map(cadastro => {
                // Verifique o formato da data recebido e ajuste a formatação conforme necessário
                return {
                    ...cadastro,
                };
            });
            setDadosOriginais(cadastrosComData);
            setCadastros(cadastrosComData);
        } catch (error) {
            console.error("Erro ao buscar os dados do backend: ", error);
            showErrorMessage("Erro ao carregar os ramos comerciais.");
        }
    };


    const searchFilters = () => {
        let filteredData = dadosOriginais;

        if (tempSearchTerm.trim() !== '') {
            filteredData = filteredData.filter(item => {
                const itemData = `${item.comercio}`.toUpperCase();
                const textData = tempSearchTerm.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
        }

        let formattedDate = null;

        setCadastros(filteredData);
        setCurrentPage(1);

        // Buscar dados do relatório
        const comercios = tempSearchTerm;
        fetchRelatorio(comercios);
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
        const maxPageButtons = 5;
        const startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
        const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);
        const pageNumbers = [];

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
    };
    return (
        <div className="bg-powder-Blue bg-opacity-20 backdrop-filter backdrop-blur-md rounded-lg shadow-xl mb-16 sm:mb-0">
            <div className="grid grid-cols-1 gap-4 max-w-full mx-3">
                <div className="relative flex justify-end items-center mb-4">
                    <div className="relative w-full mr-2">
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
                    <BotaoFiltrar onClick={searchFilters} />
                    <BotaoLimpar onClick={limparFiltro} />
                </div>
                <table className="min-w-full">
                    <thead className="bg-hearder-blue text-white">
                        <tr>
                            <th className="px-4 py-2  border border-black">Comércio</th>
                            <th className="py-2 px-4  border border-black">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCadastros.map(cadastro => (
                            <tr key={cadastro.id}>
                                <td className="border px-4 py-2 border-black">{cadastro.comercio}</td>
                                <td className="border px-4 py-2 border-black">
                                    <Link to={`/irl/comercio/${cadastro.id}`}>
                                        <BotaoEditarT/>
                                    </Link>
                                    <BotaoDeletar onClick={() => openModal(cadastro.id)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-end">
                    <Link to={`/irl/comercio`} className="block text-sm font-semibold">
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
                        className={`mx-1 px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-teal-900 text-white' : 'bg-white text-emerald-800'}`}
                    >
                        Último
                    </button>
                </div>
            </div>
            <ConfirmationModal
                show={showModal}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                descricao={`comércio`}
            />
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </div>
    );
}
