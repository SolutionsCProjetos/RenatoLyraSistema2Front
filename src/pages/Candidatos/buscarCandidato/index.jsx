import React, { useEffect, useState, useRef, useContext } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaCalendarAlt } from "react-icons/fa";
import { instance1 } from "../../../api/axios";
import "../../../style.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";
import ConfirmationModal from "../../layout/modal/Delete";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import {
  BotaoNovo,
  BotaoFiltrar,
  BotaoLimpar,
} from "../../../components/Butons";
import Empregabilidade from "../../PDF/PdfRelatorioEmpregabilidade/relatorioEmpregabilidade";

export default function ListaCandidato() {
  const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
  const [cadastros, setCadastros] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDates, setSelectedDates] = useState([null, null]); // Intervalo de datas
  const [filterType, setFilterType] = useState("dia");
  const [showModal, setShowModal] = useState(false);
  const [cadastroIdToDelete, setCadastroIdToDelete] = useState(null);
  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();
  const itemsPerPage = 10;

  const inputRef = useRef(null);

  useEffect(() => {
    fetchCadastros();
  }, []);

  const fetchCadastros = async () => {
    try {
      const response = await instance1.get(`/empregos`);
      console.log(response);
      const cadastrosComData = response.data.map((cadastro) => {
        return {
          ...cadastro,
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
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`).toISOString().split("T")[0];
  };

  const searchFilters = () => {
    let filteredData = dadosOriginais;

    // Filtro de texto (busca por termo)
    if (tempSearchTerm.trim() !== "") {
      filteredData = filteredData.filter((item) => {
        const itemData =
          `${item.nome} ${item.cpf} ${item.categoria} ${item.status} ${item.cep} ${item.cidade} ${item.areaAtuacao} ${item.areaAtuacao2} ${item.areaAtuacao3} ${item.areaAtuacao4} ${item.areaAtuacao5}`.toUpperCase();
        const textData = tempSearchTerm.toUpperCase();
        return itemData.includes(textData);
      });
    }

    setCadastros(filteredData);
    setCurrentPage(1);
  };

  const limparFiltro = () => {
    setTempSearchTerm("");
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
        const response = await instance1.delete(
          `/emprego/${cadastroIdToDelete}`
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
        if (error) {
          showWarningMessage(
            error.response.data?.message || "Erro desconhecido no servidor."
          );
        } else {
          showErrorMessage("Erro ao tentar a conexão com o banco!");
        }
      } finally {
        closeModal();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      searchFilters();
    }
  };

  const formatarCPF = (cpf) => {
    if (!cpf) return "";
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
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
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-10 items-center w-full">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
            <div className="grid grid-cols-1 gap-4 mx-4">
              <h2 className="text-2xl text-black underline col-start-1 mt-2 row-start-1">
                Lista Candidatos
              </h2>
              <div className="relative flex flex-col sm:flex-row justify-end items-center mb-4">
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
                <BotaoFiltrar onClick={searchFilters} />
                <BotaoLimpar onClick={limparFiltro} />
              </div>

              <table className="min-w-full border">
                <thead className="bg-hearder-blue text-white">
                  <tr>
                    <th className="px-4 py-2 border border-black hidden sm:table-cell">
                      <Link>Status</Link>
                    </th>
                    <th className="px-4 py-2 border border-black">
                      <Link>Candidato</Link>
                    </th>
                    <th className="px-4 py-2 border border-black hidden sm:table-cell">
                      <Link>CPF</Link>
                    </th>
                    <th className="px-4 py-2 border border-black">
                      <Link>Cidade</Link>
                    </th>
                    <th className="px-4 py-2 border border-black hidden sm:table-cell">
                      <Link>Telefone</Link>
                    </th>
                    <th className="py-2 px-4 border border-black">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCadastros.map((cadastro) => (
                    <tr key={cadastro.id}>
                      <td className="px-4 py-2 border border-black hidden sm:table-cell">
                        {cadastro.status}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {cadastro.nome}
                      </td>
                      <td className="px-4 py-2 border border-black hidden sm:table-cell">
                        {cadastro.cpf}
                      </td>
                      <td className="px-4 py-2 border border-black">
                        {formatarCPF(cadastro.cidade)}
                      </td>
                      <td className="px-4 py-2 border border-black hidden sm:table-cell">
                        {cadastro.contato}
                      </td>
                      <td className="py-2 px-4 border border-black">
                        <Link
                          to={`/irl/candidato/${cadastro.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Exibir
                        </Link>
                        <button
                          onClick={() => openModal(cadastro.id)}
                          className="text-red-600 hover:text-red-950 mx-1.5"
                        >
                          Deletar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex justify-end">
                <Link
                  to={`/irl/candidato`}
                  className="block text-sm font-semibold"
                >
                  <BotaoNovo onClick={limparFiltro} />
                </Link>
                <Empregabilidade />
                {/* <PdfRelatorioCliente /> */}
              </div>
              <div className="flex justify-center my-2">
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
                  className={`mx-1  px-3 py-1 border rounded ${
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
        descricao={`Candidato(a)`}
      />
      <Mensagem
        successMessage={successMessage}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </div>
  );
}
