import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import { instance1 } from "../../../../api/axios";
import "../../../../style.css";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../../../../components/AuthContext";
import ConfirmationModal from "../../../layout/modal/Delete";
import useMensagem from "../../../layout/hooks/useMensagem";
import Mensagem from "../../../layout/hooks/Mensagem";
//import PdfRelatorioCliente from "../../PDF/PDFRelatoriogeral/relatorioClientes";
import { BotaoNovo, BotaoFiltrar, BotaoLimpar } from "../../../../components/Butons";

function CustomInput({ onClick }) {
    return (
        <button className="example-custom-input" onClick={onClick}>
            <FaCalendarAlt size={26} />
        </button>
    );
}

export default function ListaUrinario() {
    const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
    const {petId} = useParams();
    const [cadastros, setCadastros] = useState([]);
    const [dadosOriginais, setDadosOriginais] = useState([]);
    const [tempSearchTerm, setTempSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedDates, setSelectedDates] = useState([null, null]); // Intervalo de datas
    const [filterType, setFilterType] = useState('dia');
    const [showModal, setShowModal] = useState(false);
    const [cadastroIdToDelete, setCadastroIdToDelete] = useState(null);
    const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();
    const itemsPerPage = 10;

    const inputRef = useRef(null);

    useEffect(() => {
        fetchCadastros();
    }, []);

    const fetchCadastros = async () => {
        try {
            const response = await instance1.get(`/urinarioP/${petId}`);
            const cadastrosComData = response.data.map(cadastro => {
                const certData = cadastro.createdAt
                    ? cadastro.createdAt.split('/')
                    : null;
                const dataFormatada = certData
                    ? `${certData[0]}/${certData[1]}/${certData[2]}`
                    : "";

                const contraData = cadastro.updatedAt
                    ? cadastro.updatedAt.split('/')
                    : null;
                const contraFormatada = contraData
                    ? `${contraData[0]}/${contraData[1]}/${contraData[2]}`
                    : "";

                return {
                    ...cadastro,
                    createdAt: dataFormatada,
                    updatedAt: contraFormatada,
                };
            });
            setDadosOriginais(cadastrosComData); // Salva os dados originais
            setCadastros(cadastrosComData);
        } catch (error) {
            console.error("Erro ao buscar os dados do back: ", error);
        }
    };

    const formatDateToISO = (dateString) => {
        if (!dateString) return null;
        const [day, month, year] = dateString.split('/');
        return new Date(`${year}-${month}-${day}`).toISOString().split('T')[0];
    };

    const searchFilters = () => {
        let filteredData = dadosOriginais;

        // Filtro de texto (busca por termo)
        if (tempSearchTerm.trim() !== '') {
            filteredData = filteredData.filter(item => {
                const itemData = `${item.pet.nomePet} ${item.pet.numeroChip}  ${item.parceiro.razaoSocial} ${item.parceiro.fantasia} ${item.parceiro.cpf} ${item.parceiro.cnpj}`.toUpperCase();
                const textData = tempSearchTerm.toUpperCase();
                return itemData.includes(textData);
            });
        }

        // Filtro por intervalo de datas (dia, semana ou mês)
        if (filterType === 'dia' && selectedDates[0]) {
            const selectedDate = selectedDates[0].toISOString().split('T')[0];
            filteredData = filteredData.filter(item => {
                const certDateISO = formatDateToISO(item.createdAt);
                const contractDateISO = formatDateToISO(item.updatedAt);

                return certDateISO === selectedDate || contractDateISO === selectedDate;
            });
        } else if (selectedDates[0] && selectedDates[1]) {
            const [startDate, endDate] = selectedDates.map(date => date.toISOString().split('T')[0]);
            filteredData = filteredData.filter(item => {
                const certDateISO = formatDateToISO(item.createdAt);
                const contractDateISO = formatDateToISO(item.updatedAt);

                return (certDateISO >= startDate && certDateISO <= endDate) ||
                    (contractDateISO >= startDate && contractDateISO <= endDate);
            });
        }

        setCadastros(filteredData);
        setCurrentPage(1);
    };

    const limparFiltro = () => {
        setTempSearchTerm('');
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
                const response = await instance1.delete(`/urinario/${cadastroIdToDelete}`);
                if (response.status === 200) {
                    setCadastros(prevCadastros => prevCadastros.filter(cadastro => cadastro.id !== cadastroIdToDelete));
                    setDadosOriginais(prevCadastros => prevCadastros.filter(cadastro => cadastro.id !== cadastroIdToDelete));
                    showSuccessMessage(response.data.message || "sucesso ao deletar.");
                }
            } catch (error) {
                if (error.response) {
                    showWarningMessage(error.response.data.message);
                } else {
                    showErrorMessage(response.data.message || "Erro ao tentar a conexão com o banco!");
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

    const formatarCPF = (cpf) => {
        if (!cpf) return '';
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
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
        <div className="flex">
            <div className="flex flex-col mt-1 items-center w-full">
                <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
                    <div className="grid grid-cols-1 gap-4 mx-4">
                        <div className="relative flex flex-col sm:flex-row justify-end items-center mb-4">
                            <div className="relative w-full sm:w-4/5 mr-2">
                                <input
                                    ref={inputRef}
                                    className="mr-2 px-1 py-1 bg-slate-300 w-full"
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
                                className="mr-2 px-1 py-1 bg-slate-300 w-32 my-2 sm:w-32"
                            >
                                <option value="dia">Dia</option>
                                <option value="mes">Mês/semana</option>
                            </select>
                            <DatePicker
                                selected={selectedDates[0]}
                                onChange={(dates) => setSelectedDates(dates)}
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

                        <table className="min-w-full border">
                            <thead className="bg-hearder-blue text-white">
                                <tr>
                                    <th className="px-4 py-2 border border-black hidden sm:table-cell"><Link>Pet</Link></th>
                                    <th className="px-4 py-2 border border-black hidden sm:table-cell"><Link>N° chip</Link></th>
                                    <th className="px-4 py-2 border border-black"><Link>Parceiro</Link></th>
                                    <th className="px-4 py-2 border border-black hidden sm:table-cell"><Link>Fantasia</Link></th>
                                    <th className="px-4 py-2 border border-black"><Link>CNPJ</Link></th>
                                    <th className="px-4 py-2 border border-black"><Link>Data</Link></th>
                                    <th className="py-2 px-4 border border-black">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCadastros.map((cadastro) => (
                                    <tr key={cadastro.id}>
                                        <td className="px-4 py-2 border border-black hidden sm:table-cell">{cadastro.pet.nomePet}</td>
                                        <td className="px-4 py-2 border border-black hidden sm:table-cell">{cadastro.pet.numeroChip}</td>
                                        <td className="px-4 py-2 border border-black">{cadastro.parceiro.razaoSocial}</td>
                                        <td className="px-4 py-2 border border-black hidden sm:table-cell">{cadastro.parceiro.fantasia}</td>
                                        <td className="px-4 py-2 border border-black">{formatarCPF(cadastro.parceiro.cnpj)}</td>
                                        <td className="px-4 py-2 border border-black">{formatarCPF(cadastro.createdAt)}</td>
                                        <td className="py-2 px-4 border border-black">
                                            <Link to={`/irl/urinario/${cadastro.id}`} className="text-blue-500 hover:text-blue-700">
                                                Exibir
                                            </Link>
                                            <button onClick={() => openModal(cadastro.id)} className="text-red-600 hover:text-red-950 mx-1.5">Deletar</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="flex justify-end">
                            <Link to={`/irl/urinario`} className="block text-sm font-semibold">
                                <BotaoNovo onClick={limparFiltro} />
                            </Link>
                            {/* <PdfRelatorioCliente /> */}
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
                descricao={`Exame fisico`}
            />
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
        </div>
    );
}
