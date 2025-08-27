import React, { useEffect, useState, useRef, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt, FaSearch } from "react-icons/fa";
import { instance1 } from "../../../api/axios";
import "../../../style.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";
import ConfirmationModal from "../../layout/modal/Delete";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import {
  BotaoFiltrar,
  BotaoLimpar,
  BotaoNovo,
} from "../../../components/Butons";

function SearchCliente() {
  const { isAuthenticated } = useContext(AuthContext);
  const [cadastros, setCadastros] = useState([]);
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
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

  // Removi o useEffect que dependia de selectedEmpresa
  useEffect(() => {
    fetchCadastros(); // Não passamos mais selectedEmpresa como parâmetro
  }, []);

  const fetchCadastros = async () => {
    try {
      let url = `/usuario`;
      const response = await instance1.get(url);
      const cadastrosComData = response.data.map((cadastro) => {
        return {
          ...cadastro,
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

    if (tempSearchTerm.trim() !== "") {
      filteredData = filteredData.filter((item) => {
        const itemData = `${item.nome} ${item.email}`.toUpperCase();
        const textData = tempSearchTerm.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
    }

    setCadastros(filteredData);
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
          `/usuario/${cadastroIdToDelete}`
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
          showSuccessMessage(
            response.data.message || "Operador deletado com sucesso."
          );
        }
      } catch (error) {
        if (error.response && error.response.data) {
          showWarningMessage(
            error.response.data.message || "Erro desconhecido"
          );
        } else {
          showErrorMessage("Erro ao tentar a conexão com o banco!");
        }
      } finally {
        closeModal();
      }
    }
  };

  const limparFiltro = () => {
    setSelectedDate(null);
    setTempSearchTerm("");
    setCadastros(dadosOriginais);
    setCurrentPage(1);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
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

  const getPageNumbers = () => {
    const maxPageButtons = 10; // Melhorar a UX, não mostrar muitas páginas de uma vez
    const pageNumbers = [];

    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="flex">
      <div className="flex flex-col flex-grow">
        <div className="flex flex-col mt-12 items-center w-full ">
          <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl sm:w-full">
            <div className="grid grid-cols-1 gap-4 mx-8">
              <h2 className="text-2xl text-black underline col-start-1 row-start-1">
                Lista de usuários
              </h2>
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
                <BotaoFiltrar onClick={searchFilters} />
                <BotaoLimpar onClick={limparFiltro} />
              </div>
              <table className="min-w-full table-fixed">
                <thead className="bg-hearder-blue text-white">
                  <tr>
                    <th className="py-2 border border-black px-4 w-1/3 text-left">
                      Nome
                    </th>
                    <th className="py-2 border border-black px-4 w-1/3 text-left ">
                      E-mail
                    </th>
                    <th className="py-2 border border-black px-4 w-1/3 text-left">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentClientes.map((cadastro) => (
                    <tr key={cadastro.id}>
                      <td className="py-2 px-4 border border-black w-1/3 text-left">
                        {cadastro.nome}
                      </td>
                      <td className="py-2 px-4 border border-black w-1/3 text-left whitespace-nowrap overflow-hidden text-ellipsis max-w-24 sm:max-w-40">
                        {cadastro.email}
                      </td>
                      <td className="py-2 px-4 border border-black w-1/3 text-left">
                        <Link
                          to={`/irl/operador/${cadastro.id}`}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Editar
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
                  to={`/irl/cadastro`}
                  className="block text-sm font-semibold"
                >
                  <BotaoNovo onClick={limparFiltro} />
                </Link>
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
        descricao={`usuário`}
      />
      <Mensagem
        successMessage={successMessage}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </div>
  );
}

export default SearchCliente;
