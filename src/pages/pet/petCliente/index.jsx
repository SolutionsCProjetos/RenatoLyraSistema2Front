import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { instance1 } from "../../../api/axios";
import "../../../style.css";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";
import ConfirmationModal from "../../layout/modal/Delete";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoFiltrar, BotaoLimpar, BotaoNovo } from "../../../components/Butons";

function CustomInput({ onClick }) {
    return (
        <button className="example-custom-input" onClick={onClick}>
            <FaCalendarAlt size={26} />
        </button>
    )
}

export default function ListaPet() {
    const { id } = useParams();
    const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
    const [cadastros, setCadastros] = useState([]);
    const [dadosOriginais, setDadosOriginais] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDates, setSelectedDates] = useState([null, null]); // Intervalo de datas
    const [filterType, setFilterType] = useState('dia');
    const [showModal, setShowModal] = useState(false);
    const [cadastroIdToDelete, setCadastroIdToDelete] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();
    const itemsPerPage = 30;

    const inputRef = useRef(null)

    useEffect(() => {
        fetchCadastros();
    }, []);


    const fetchCadastros = async () => {
        try {
            const response = await instance1.get(`/petcliente/${id}`);
    
            const cadastrosComData = response.data.map(cadastro => {
                if (cadastro.createdAt) {
                    const partesData = cadastro.createdAt.split('/');
                    const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
                    return { ...cadastro, createdAt: dataFormatada };
                }
                return cadastro;
            });
    
            if (cadastrosComData.length === 0) {
                showWarningMessage("Este cliente não possui nenhum pet associado.");
            }
    
            setDadosOriginais(cadastrosComData);
            setCadastros(cadastrosComData);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                // Tratamento para status 404
                showWarningMessage("Nenhum pet encontrado para este cliente.");
                setDadosOriginais([]);
                setCadastros([]);
            } else {
                console.error("Erro ao buscar os dados do backend: ", error);
                showErrorMessage("Erro ao buscar os dados do backend. Fale com o suporte!");
            }
        }
    };
    
    

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };


    const searchFilters = () => {
        let filteredData = dadosOriginais;

        if (tempSearchTerm.trim() !== '') {
            filteredData = filteredData.filter(item => {
                const itemData = `${item.cliente} ${item.nomePet} ${item.raca} ${item.dataNascimento}`.toUpperCase();
                const textData = tempSearchTerm.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
        }

        // Ajuste do filtro de data
        if (filterType === 'dia' && selectedDates[0]) {
            const selectedDate = selectedDates[0].toISOString().split('T')[0];

            // Filtrar por uma data exata (dataNascimento)
            filteredData = filteredData.filter(item => {
                const [day, month, year] = item.dataNascimento.split('/');
                const itemDate = new Date(`${year}-${month}-${day}`);
                const startDateObj = new Date(startDate);
                const endDateObj = new Date(endDate);

                return itemDate >= startDateObj && itemDate <= endDateObj;
            });
        } else if (selectedDates[0] && selectedDates[1]) {
            const [startDate, endDate] = selectedDates.map(date => date.toISOString().split('T')[0]);

            // Filtrar por intervalo de datas
            filteredData = filteredData.filter(item => {
                const [day, month, year] = item.dataNascimento.split('/');
                const itemDate = new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];

                return itemDate >= startDate && itemDate <= endDate;
            });
        }

        setCadastros(filteredData);
        setCurrentPage(1);
    };

    const limparFiltro = () => {
        setTempSearchTerm('');
        setSelectedDates([null, null]);
        setCadastros(dadosOriginais);
        setCurrentPage(1);
    };

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
                const response = await instance1.delete(`/pet/${cadastroIdToDelete}`);
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

    const handleFilterTypeChange = (event) => {
        setFilterType(event.target.value);
    };

    return (
        <div className="flex ">
                <div className="flex flex-col mt-5 items-center w-full">
                    <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
                        <div className="grid grid-cols-1 gap-3 mx-4">
                            <div className="relative flex flex-col sm:flex-row justify-end items-center">
                                <div className="relative w-full sm:w-4/5 mr-2">
                                    <input
                                        ref={inputRef}
                                        className="mr-2 px-1 py-1 bg-slate-300 w-full"
                                        value={tempSearchTerm}
                                        onChange={(e) => setTempSearchTerm(e.target.value)}
                                        onKeyDown={handleKeyPress}
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
                                    className="mr-2 px-1 py-1 bg-slate-300 w-32 my-2 sm:w-32"
                                >
                                    <option value="dia">Dia</option>
                                    <option value="mes">Mês/semana</option>
                                </select>
                                <DatePicker
                                    selected={selectedDates[0]}
                                    onChange={(dates) => setSelectedDates(dates || [null, null])}
                                    startDate={selectedDates[0]}
                                    endDate={selectedDates[1]}
                                    selectsRange
                                    dateFormat="dd/MM/yyyy"
                                    customInput={<CustomInput />}
                                    className="mr-2"
                                />
                                <BotaoFiltrar onClick={searchFilters} />
                                <BotaoLimpar onClick={limparFiltro} />
                            </div>

                            <div className="w-full">
                                <div className="overflow-y-auto max-h-[32.6rem]" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                                    <table className="min-w-full border table-fixed">
                                        <thead className="sticky -top-1 bg-hearder-blue text-white">
                                            <tr>
                                                <th className="px-2 py-2 border border-black hidden sm:table-cell"><Link>Id</Link></th>
                                                <th className="px-2 py-2 border border-black"><Link>Dono</Link></th>
                                                <th className="px-2 py-2 border border-black hidden md:table-cell"><Link>Nome Pet</Link></th>
                                                <th className="px-2 py-2 border border-black"><Link>dataNascimento</Link></th>
                                                <th className="px-2 py-2 border border-black hidden md:table-cell"><Link>Sexo</Link></th>
                                                <th className="px-2 py-2 border border-black">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentCadastros.map((cadastro) => (
                                                <tr key={cadastro.id} className={`border-b ${cadastro.status === "Atrasado" ? "bg-red-400" : ""}`}>
                                                    <td className="px-2 py-1.5 border border-black hidden sm:table-cell">{cadastro.id}</td>
                                                    <td className="px-2 py-1.5 border border-black whitespace-nowrap overflow-hidden text-ellipsis max-w-20 sm:max-w-32">{cadastro.dono}</td>
                                                    <td className="px-2 py-1.5 border border-black hidden  whitespace-nowrap overflow-hidden text-ellipsis max-w-20 md:table-cell sm:max-w-32">{cadastro.nomePet}</td>
                                                    <td className="px-2 py-1.5 border border-black">{cadastro.dataNascimento}</td>
                                                    <td className="px-2 py-1.5 border border-black hidden md:table-cell">{cadastro.sexo}</td>
                                                    <td className="px-2 py-1.5 border border-black ">
                                                        <Link to={`/irl/pet/${cadastro.id}`} className="text-blue-500 hover:text-blue-700">
                                                            Editar
                                                        </Link>
                                                        <button onClick={() => openModal(cadastro.id)} className="text-red-600 hover:text-red-950 mx-1.5">Deletar</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Link to={`/irl/pet`} className="block text-sm font-semibold">
                                    <BotaoNovo onClick={limparFiltro} />
                                </Link>
                                {/* <PdfRelatorioFull /> */}
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
            </div>
            <ConfirmationModal
                show={showModal}
                onClose={closeModal}
                onConfirm={handleConfirmDelete}
                descricao={`pet`}
            />
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </div>
    );
}