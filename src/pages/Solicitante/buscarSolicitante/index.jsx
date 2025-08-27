import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { instance1 } from "../../../api/axios";
import "../../../style.css";
import ConfirmationModal from "../../layout/modal/Delete";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";
//mport PdfRelatorio from "../../PDF/Relatoriogeral/relatorio";
import {
  BotaoNovo,
  BotaoFiltrar,
  BotaoLimpar,
  BotaoEditarT,
  BotaoDeletar,
} from "../../../components/Butons";

function CustomInput({ onClick }) {
  return (
    <button className="example-custom-input" onClick={onClick}>
      <FaCalendarAlt size={26} />
    </button>
  );
}

export default function SearchOperacao() {
  const { user } = useContext(AuthContext);
  const [cadastros, setCadastros] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [relatorioDados, setRelatorioDados] = useState([]); // Novo estado para os dados do relatório
  const [searchTerm, setSearchTerm] = useState("");
  const [filtrosStatus, setFiltrosStatus] = useState({});
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedDates, setSelectedDates] = useState([null, null]);
  const [filterType, setFilterType] = useState("dia");
  const [cadastroIdToDelete, setCadastroIdToDelete] = useState(null);
  const itemsPerPage = 30;
  const inputRef = useRef(null);
  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();

  useEffect(() => {
    fetchCadastros();
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    searchFilters();
  }, [filtrosStatus]);

  /* const fetchRelatorio = async (nome, createdAt, dataFinal) => {
    try {
      const response = await instance1.get(`/demanda`, {
        params: { nome, startDate: createdAt, endDate: dataFinal },
      });
      setRelatorioDados(response.data);
    } catch (error) {
      console.error("Erro ao buscar os dados do relatório: ", error);
    }
  };
 */
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
        const response = await instance1.delete(
          `/solicitante/${cadastroIdToDelete}`
        );
        if (response.status === 200) {
          setCadastros((prevCadastros) =>
            prevCadastros.filter(
              (cadastro) => cadastro.id !== cadastroIdToDelete
            )
          );
          setDadosOriginais((prevCadastros) =>
            prevCadastros.filter(
              (cadastro) => cadastro.id !== cadastroIdToDelete
            )
          );
          showSuccessMessage(response.data.message || "sucesso ao deletar.");
        }
      } catch (error) {
        if (error.response) {
          showWarningMessage(error.response.data.message);
        } else {
          showErrorMessage(
            response.data.message || "Erro ao tentar a conexão com o banco!"
          );
        }
      } finally {
        closeModal();
      }
    }
  };

  const fetchCadastros = async () => {
    try {
      const response = await instance1.get(`/solicitante`);
      const cadastrosComData = response.data.map((cadastro) => {
        const partesData = cadastro.createdAt.split("/");
        const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;
        return {
          ...cadastro,
          createdAt: dataFormatada,
        };
      });
      setDadosOriginais(cadastrosComData);
      setCadastros(cadastrosComData);
    } catch (error) {
      console.error("Erro ao buscar os dados do back: ", error);
    }
  };

  const searchFilters = () => {
    let filteredData = dadosOriginais;

    // Filtrar por termo de busca
    if (tempSearchTerm.trim() !== "") {
      filteredData = filteredData.filter((item) => {
        const itemData =
          `${item.solicitante} ${item.nomeCompleto} ${item.telefoneContato} ${item.cpf} ${item.titulo}`.toUpperCase();
        const textData = tempSearchTerm.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
    }

    // Filtrar por intervalo de datas
    if (filterType === "dia" && selectedDates[0]) {
      const selectedDate = selectedDates[0].toISOString().split("T")[0];
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.startDate.split("/");
        const itemDate = new Date(`${year}-${month}-${day}`)
          .toISOString()
          .split("T")[0];
        return itemDate === selectedDate;
      });
    } else if (selectedDates[0] && selectedDates[1]) {
      const [startDate, endDate] = selectedDates.map(
        (date) => date.toISOString().split("T")[0]
      );
      filteredData = filteredData.filter((item) => {
        const [day, month, year] = item.startDate.split("/");
        const itemDate = new Date(`${year}-${month}-${day}`)
          .toISOString()
          .split("T")[0];
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    // Filtrar por status
    if (
      filtrosStatus &&
      filtrosStatus.status &&
      filtrosStatus.status !== "Todos"
    ) {
      filteredData = filtrarOperacoes(filteredData, filtrosStatus.status);
    }

    setCadastros(filteredData);
    setCurrentPage(1);

    // Atualizar relatório
    const nome = tempSearchTerm;
    const createdAt = selectedDates[0]
      ? selectedDates[0].toISOString().split("T")[0]
      : null;
    const dataFinal = selectedDates[1]
      ? selectedDates[1].toISOString().split("T")[0]
      : null;
    //fetchRelatorio(nome, createdAt, dataFinal);
  };


  const formatTelefone = (telefone) => {
  if (!telefone) return "";
  const tel = telefone.replace(/\D/g, ""); // Remove tudo que não for número

  if (tel.length === 11) {
    return `(${tel.slice(0, 2)}) ${tel[2]} ${tel.slice(3, 7)}-${tel.slice(7)}`;
  } else if (tel.length === 10) {
    return `(${tel.slice(0, 2)}) ${tel.slice(2, 6)}-${tel.slice(6)}`;
  }

  return telefone; // Retorna como está se não bater com padrões esperados
};

  const limparFiltro = () => {
    setSearchTerm("");
    setTempSearchTerm("");
    setSelectedDate(null);
    setSelectedDates([null, null]);
    setCadastros(dadosOriginais);
    setRelatorioDados([]); // Limpar dados do relatório ao limpar filtros
    setCurrentPage(1); // Resetar para a primeira página
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
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

  const handleFiltroStatusChange = (status) => {
    setFiltrosStatus({ status }); // Atualizar diretamente o estado com o novo status
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
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col items-center w-full">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
            <div className="grid grid-cols-1 gap-4 mx-4">
              <h2 className="text-2xl text-black underline col-start-1 row-start-1">
                Lista Solicitante
              </h2>
              <div className="relative flex flex-col sm:flex-row justify-end items-center mb-4">
                <div className="relative w-full sm:w-4/5 mx-2">
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
                  selected={selectedDates[0]}
                  onChange={(dates) => setSelectedDates(dates)}
                  startDate={selectedDates[0]}
                  endDate={selectedDates[1]}
                  selectsRange={true} // Permitir seleção de intervalo
                  customInput={<CustomInput />}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Selecione o intervalo"
                />
                <BotaoFiltrar onClick={searchFilters} />
                <BotaoLimpar onClick={limparFiltro} />
              </div>
              <table className="min-w-full">
                <thead className="bg-hearder-blue text-white">
                  <tr>
                    <th className="px-4 py-2  border border-black hidden sm:table-cell">
                      id
                    </th>
                    <th className="px-4 py-2  border border-black hidden sm:table-cell">
                      Solicitante
                    </th>
                    <th className="px-4 py-2  border border-black hidden sm:table-cell">
                      Nome Completo
                    </th>
                    <th className="px-4 py-2  border border-black hidden sm:table-cell">
                      Contato
                    </th>
                    <th className="px-4 py-2  border border-black hidden sm:table-cell">
                      Título Eleitoral
                    </th>
                    <th className="py-2 px-4  border border-black">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCadastros.map((cadastro) => (
                    <tr key={cadastro.id} className={`border-b `}>
                      <td className="border px-4 py-2 border-black">
                        {cadastro.id}
                      </td>
                      <td className="border px-4 py-2 border-black">
                        {cadastro.solicitante}
                      </td>
                      <td className="border px-4 py-2 border-black">
                        {cadastro.nomeCompleto}
                      </td>
                      <td className="border px-4 py-2 border-black hidden sm:table-cell">
                        {formatTelefone(cadastro.telefoneContato)}
                      </td>
                      <td className="border px-4 py-2 border-black hidden sm:table-cell">
                        {cadastro.titulo}
                      </td>
                      <td className="border px-4 py-2 border-black ">
                        <Link to={`/irl/solicitante/${cadastro.id}`}>
                          <BotaoEditarT />
                        </Link>
                        <BotaoDeletar onClick={() => openModal(cadastro.id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <Link
                  to={`/irl/solicitante`}
                  className="block text-sm font-semibold"
                >
                  <BotaoNovo onClick={limparFiltro} />
                </Link>
                {/* <PdfRelatorio dados={relatorioDados} /> */}
              </div>
              <div className="flex justify-center mt-4 mb-4">
                <button
                  onClick={() => handleClickPage(1)}
                  className={`mx-1 px-3 py-1 border rounded ${
                    currentPage === 1
                      ? "bg-teal-900 text-white"
                      : "bg-white text-emerald-800"
                  }`}
                >
                  Primeiro
                </button>
                {getPageNumbers().map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => handleClickPage(pageNumber)}
                    className={`mx-1 px-3 py-1 border rounded ${
                      currentPage === pageNumber
                        ? "bg-teal-900 text-white"
                        : "bg-white text-emerald-800"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}
                <button
                  onClick={() => handleClickPage(totalPages)}
                  className={`mx-1 px-3 py-1 border rounded ${
                    currentPage === totalPages
                      ? "bg-teal-900 text-white"
                      : "bg-white text-emerald-800"
                  }`}
                >
                  Último
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ConfirmationModal
        show={showModal}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
      />
      <Mensagem
        successMessage={successMessage}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </div>
  );
}
