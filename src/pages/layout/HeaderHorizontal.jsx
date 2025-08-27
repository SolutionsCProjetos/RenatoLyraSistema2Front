import React, { useContext, useState, useEffect, useRef } from "react";
import ConfirmLogoutModal from "./hooks/ConfirmLogout";
import { Menu } from "lucide-react";
import { createPortal } from "react-dom";
import { RiLogoutCircleLine } from "react-icons/ri";
import { AuthContext } from "../../components/AuthContext";

const HeaderHorizontal = () => {
  const {
    toggleHeaderVisibility,
    isModalOpen,
    handleCloseModal,
    handleConfirmLogout,
    handleLogout,
  } = useContext(AuthContext);
  const [isNotificationsDropdownOpen, setIsNotificationsDropdownOpen] = useState(false);
  const notificationDropdownRef = useRef(null);

  // Função para fechar o dropdown ao clicar fora
  const handleClickOutside = (event) => {
    if (notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target)) {
      setIsNotificationsDropdownOpen(false);
    }
  };

  // Adicionar/remover listener de clique fora do dropdown
  useEffect(() => {
    if (isNotificationsDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationsDropdownOpen]);

  return (
    <header className="w-full bg-hearder-blue p-1 flex justify-between items-center top-0">
      {createPortal(
        <ConfirmLogoutModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmLogout}
        />,
        document.body
      )}

      {/* Menu (lado esquerdo) */}
      <button onClick={toggleHeaderVisibility} className="text-white ml-2">
        <Menu />
      </button>

      <div className="relative flex flex-row items-center">
        {/* Botão de logout (lado direito) */}
        <button
          className="text-lg text-white flex flex-row items-center gap-2 rounded w-auto py-1 px-2 bg-red-800 hover:bg-buttonLimpar-600 transition-colors duration-200"
          onClick={handleLogout}
        >
          <RiLogoutCircleLine size={20} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default HeaderHorizontal;
