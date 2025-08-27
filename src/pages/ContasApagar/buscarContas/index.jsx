import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaSearch } from 'react-icons/fa';
import { instance1 } from "../../../api/axios";
import "../../../style.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";
import ConfirmationModal from "../../layout/modal/Delete";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoFiltrar, BotaoLimpar, BotaoNovo } from "../../../components/Butons";
import { NumericFormat } from 'react-number-format';
//import PdfRelatorioPagamentos from "../../PDF/PdfRelatorioPagar/relatorioPagar";

function CustomInput({ onClick }) {
    return (
        <button className="example-custom-input" onClick={onClick}>
            <FaCalendarAlt size={26} />
        </button>
    );
}

function SearchContas() {
    const { user } = useContext(AuthContext);
    const [cadastros, setCadastros] = useState([]);
    const [dadosOriginais, setDadosOriginais] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('dia'); // Dia ou semana/mês
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [cadastroIdToDelete, setCadastroIdToDelete] = useState(null);
    const [statusFilter, setStatusFilter] = useState([]); // Novo estado para o filtro de status
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { successMessage, errorMessage, showSuccessMessage, showErrorMessage } = useMensagem();
    const itemsPerPage = 10;

    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        fetchCadastros();
    }, []);

    useEffect(() => {
        searchFilters();
    }, [statusFilter]); // Disparar o filtro automaticamente quando o status mudar

    const fetchCadastros = async () => {
        try {
            let url = `/pagar`;
            if (startDate && endDate) {
                url += `?startDate=${startDate.toISOString().split('T')[0]}&endDate=${endDate.toISOString().split('T')[0]}`;

            }
            const response = await instance1.get(url);

            const contasComDataFormatada = response.data.map(contas => {
                const partesDataVencimento = contas.vencimento.split('/');
                const vencimentoFormatado = `${partesDataVencimento[0].padStart(2, '0')}/${partesDataVencimento[1].padStart(2, '0')}/${partesDataVencimento[2]}`;

                let dataPagamentoFormatada = null;
                if (contas.dataPagamento) {
                    const partesDataPagamento = contas.dataPagamento.split('/');
                    dataPagamentoFormatada = `${partesDataPagamento[0].padStart(2, '0')}/${partesDataPagamento[1].padStart(2, '0')}/${partesDataPagamento[2]}`;
                }

                return {
                    ...contas,
                    vencimento: vencimentoFormatado,
                    dataPagamento: dataPagamentoFormatada,
                };
            });

            setDadosOriginais(contasComDataFormatada);
            setCadastros(contasComDataFormatada);
        } catch (error) {
            console.error("Erro ao buscar os dados do back: ", error);
        }
    };


    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
    };

    const searchFilters = () => {
        let filteredData = [...dadosOriginais];

        if (startDate && endDate) {
            const startDateFormatted = startDate.toISOString().split('T')[0];
            const endDateFormatted = endDate.toISOString().split('T')[0];

            filteredData = filteredData.filter(item => {
                const [day, month, year] = item.vencimento.split('/');
                const itemDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

                return itemDate >= startDateFormatted && itemDate <= endDateFormatted;
            });
        }

        if (tempSearchTerm.trim() !== '') {
            filteredData = filteredData.filter(item => {
                const itemData = `${item.cnpj} ${item.situacao} ${item.fornecedor} ${item.historico}`.toUpperCase();
                const textData = tempSearchTerm.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
        }

        // Filtro de status
        if (statusFilter.length > 0) {
            filteredData = filteredData.filter(item => statusFilter.includes(item.situacao));
        }

        setCadastros(filteredData);
        setCurrentPage(1);
    };

    const limparFiltro = () => {
        setStartDate(null);
        setEndDate(null);
        setTempSearchTerm('');
        setStatusFilter([]);
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
    const currentClientes = cadastros.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(cadastros.length / itemsPerPage);

    const handleClickPage = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const openModal = (id) => {
        setCadastroIdToDelete(id);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setCadastroIdToDelete(null);
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const handleStatusChange = (status) => {
        setStatusFilter(prevFilter =>
            prevFilter.includes(status)
                ? prevFilter.filter(item => item !== status)
                : [...prevFilter, status]
        );
    };

    const handleConfirmDelete = async () => {
        if (cadastroIdToDelete !== null) {
            try {
                const response = await instance1.delete(`/pagar/${cadastroIdToDelete}`);
                if (response.status === 200) {
                    setCadastros(prevCadastros => prevCadastros.filter(cadastro => cadastro.id !== cadastroIdToDelete));
                    setDadosOriginais(prevCadastros => prevCadastros.filter(cadastro => cadastro.id !== cadastroIdToDelete));
                    showSuccessMessage(response.data);
                }
            } catch (error) {
                if (error.response) {
                    showErrorMessage(error.response.data);
                } else {
                    showErrorMessage("Erro ao tentar a conexão com o banco!");
                }
            } finally {
                closeModal();
            }
        }
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

    // Evento para fechar o dropdown ao clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const statusColors = {
        "Aberta": "bg-green-500",
        "Parcial": "bg-yellow-500",
        "Atrasado": "bg-red-500",
        "Paga": "bg-blue-500"
    };

    return (
        <div className="flex flex-col mt-5 items-center w-full">
            <div className="bg-white bg-opacity-10 backdrop-filter w-full backdrop-blur-md rounded-lg shadow-xl">
                <div className="grid grid-cols-1 gap-4 px-2">
                    <div className="relative flex flex-col sm:flex-row justify-end items-center mb-4">
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleDropdown}
                                className="mr-2 px-1 py-1 bg-white w-32 my-1 sm:w-32 text-left"
                            >

                                {statusFilter.length > 0 ? <p className="ml-2">Selecionados</p> : <p className="ml-3">Todos</p>}
                            </button>
                            {dropdownOpen && (
                                <div className="absolute bg-white shadow-lg w-32 z-10">
                                    {Object.keys(statusColors).map(status => (
                                        <div
                                            key={status}
                                            className={`flex items-center  justify-between ${statusColors[status]} p-1 w-full  text-white`}
                                        >
                                            <label htmlFor={status} className="ml-2">{status}</label>
                                            <input
                                                type="checkbox"
                                                id={status}
                                                checked={statusFilter.includes(status)}
                                                onChange={() => handleStatusChange(status)}
                                                className="ml-2"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="relative w-full sm:w-4/5 mr-2">
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
                        <select
                            value={filterType}
                            onChange={handleFilterTypeChange}
                            className="mr-2 px-1 py-1 bg-white w-32 my-2 sm:w-32"
                        >
                            <option value="dia">Dia</option>
                            <option value="mes">Mês/semana</option>
                        </select>
                        <DatePicker
                            selectsRange={filterType !== 'dia'}
                            selected={startDate}
                            startDate={startDate}
                            endDate={endDate}
                            onChange={(update) => {
                                if (filterType === 'dia') {
                                    setStartDate(update);
                                    setEndDate(update);
                                } else {
                                    const [start, end] = update;
                                    setStartDate(start);
                                    setEndDate(end);
                                }
                            }}
                            customInput={<CustomInput />}
                        />
                        <BotaoFiltrar onClick={searchFilters} />
                        <BotaoLimpar onClick={limparFiltro} />
                    </div>
                    <table className="min-w-full">
                        <thead className="bg-hearder-blue text-white">
                            <tr>
                                <th className="py-2 px-4 border border-black hidden sm:table-cell">Status</th>
                                <th className="py-2 px-4 border border-black">Fornecedor</th>
                                <th className="py-2 px-4 border border-black hidden sm:table-cell">Valor</th>
                                <th className="py-2 px-4 border border-black">Vencimento</th>
                                <th className="py-2  border border-black">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentClientes.map((contasA) => (
                                <tr key={contasA.id} className={`border-b ${contasA.situacao === "Atrasado" ? "bg-red-400" : ""}`}>
                                    <td className="py-2 px-4 border border-black hidden sm:table-cell">{contasA.situacao}</td>
                                    <td className="py-2 px-4 border border-black whitespace-nowrap overflow-hidden text-ellipsis max-w-40">{contasA.fornecedor}</td>
                                    <td className="py-2 px-4 border border-black hidden sm:table-cell">
                                        <NumericFormat
                                            value={contasA.valorTotal}
                                            displayType={'text'}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            decimalScale={2}
                                            fixedDecimalScale
                                            prefix="R$ "
                                        />
                                    </td>
                                    <td className="py-2 px-4 border border-black">{contasA.vencimento}</td>
                                    <td className="px-2 py-1.5 border border-black ">
                                        <Link to={`/irl/putcontas/${contasA.id}`} className="text-blue-500 hover:text-blue-700">
                                            Editar
                                        </Link>
                                        <button onClick={() => openModal(contasA.id)} className="text-red-600 hover:text-red-950 mx-1.5">Deletar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-end">
                        <Link to={`/irl/conta`} className="block text-sm font-semibold" onClick={limparFiltro}>
                            <BotaoNovo />
                        </Link>
                        {/* <PdfRelatorioPagamentos /> */}
                    </div>
                    <div className="flex justify-center my-2">
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
            </div>
            <ConfirmationModal
                show={showModal}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                descricao={`contas a pagar`}
            />
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} />
        </div>
    );
}

export default SearchContas;