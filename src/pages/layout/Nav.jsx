import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { AuthContext } from "../../components/AuthContext";

const NavLinks = ({ user }) => {
  return (
    <>
      {user && (
        <>
          {user.rule === 1 && (
            <>
              <NavLink className="text-white text-lg" to="/irl/operadores">
                Usuários
              </NavLink>
              <NavLink className="text-white text-lg" to="/irl/parceiros">
                Parceiros
              </NavLink>
            </>
          )}

          <NavLink className="text-white text-lg" to="/irl/operacoes">
            Agenda
          </NavLink>
        </>
      )}
    </>
  );
};

const ListaCliente = ({ onLinkClick }) => {
  return (
    <>
      <NavLink className="text-white text-lg" to="/irl/clientes">
        Clientes
      </NavLink>
      <NavLink className="text-white text-lg" to="/irl/pets">
        Pet
      </NavLink>
    </>
  );
};

const ListaRecrutamento = ({ onLinkClick, user }) => {
  return (
    <>
      {user?.rule === 2 && (
        <NavLink className="text-white text-lg" to="/irl/candidato">
          Novo Candidato
        </NavLink>
      )}
      <NavLink className="text-white text-lg" to="/irl/candidatos">
        Lista Candidatos
      </NavLink>
    </>
  );
};

const ListaDemanda = ({ onLinkClick, user }) => {
  return (
    <>
      {user?.rule === 3 && (
        <NavLink className="text-white text-lg" to="/irl/demanda">
          Nova Demanda
        </NavLink>
      )}
      <NavLink className="text-white text-lg" to="/irl/demandas">
        Lista Demandas
      </NavLink>
      <NavLink className="text-white text-lg" to="/irl/solicitantes">
        Lista Solicitantes
      </NavLink>
    </>
  );
};

const ListaFinanceiro = ({ onLinkClick, user }) => {
  if (!user || user.rule === 1 || user.setor === 1) {
    return (
      <>
        <NavLink className="text-white text-lg" to="/irl/config">
          Configuração
        </NavLink>
        <NavLink
          className="text-white text-lg"
          to="/irl/financeiro"
          onClick={onLinkClick}
        >
          Financeiro
        </NavLink>
      </>
    );
  }
  return null;
};

const DropdownMenu = ({ isOpen, children }) => {
  return (
    <div
      className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      } bg-hearder-blue shadow-lg w-full`}
    >
      <div className="py-1 flex flex-col items-center w-full">{children}</div>
    </div>
  );
};

const Nav = () => {
  const { user } = useContext(AuthContext);
  const [isFinanceiroDropdownOpen, setIsFinanceiroDropdownOpen] =
    useState(false);
  const [isClienteDropdownOpen, setIsClienteDropdownOpen] = useState(false);

  const toggleFinanceiroDropdown = () =>
    setIsFinanceiroDropdownOpen((prev) => !prev);
  const toggleClienteDropdown = () => setIsClienteDropdownOpen((prev) => !prev);

  return (
    <nav className="relative w-full h-full shadow-lg flex flex-col justify-between">
      {/* Menu Principal */}
      <div className="flex flex-col items-start px-1 py-2 flex-grow">
        {/* Seção para Recrutamento (rule 2) */}
        {user?.rule === 2 && (
          <ListaRecrutamento onLinkClick={() => {}} user={user} />
        )}

        {/* Seção para Demandas (rule 3) */}
        {user?.rule === 3 && (
          <ListaDemanda onLinkClick={() => {}} user={user} />
        )}

        {/* Menu Completo para Admin (rule 1) ou outros com acesso */}
        {user && user.rule !== 2 && user.rule !== 3 && (
          <>
            {/* Cliente Dropdown */}
            <button
              className="text-white text-lg flex items-center justify-between w-full hover:text-gray-300 mt-2"
              onClick={toggleClienteDropdown}
            >
              <span className="ml-1">Cliente</span>
              <ChevronDown className="w-5 h-5" />
            </button>
            <DropdownMenu isOpen={isClienteDropdownOpen}>
              <ListaCliente onLinkClick={() => {}} />
            </DropdownMenu>

            {/* Links padrão (como Agenda, Usuários, Parceiros) */}
            <NavLinks user={user} />

            {/* Administrativo para Admin */}
            {user.rule === 1 && (
              <>
                {/* Recrutamento também visível para Admin */}
                <ListaRecrutamento onLinkClick={() => {}} user={user} />

                <ListaDemanda onLinkClick={() => {}} user={user} />
                <button
                  className="text-white text-lg flex items-center justify-between w-full hover:text-gray-300 mt-2"
                  onClick={toggleFinanceiroDropdown}
                >
                  <span>Administrativo</span>
                  <ChevronDown className="w-5 h-5" />
                </button>

                <DropdownMenu isOpen={isFinanceiroDropdownOpen}>
                  <ListaFinanceiro onLinkClick={() => {}} user={user} />
                </DropdownMenu>
              </>
            )}
          </>
        )}
      </div>

      {/* Nome do Usuário */}
      {user && (
        <div className="w-full justify-start text-white text-lg p-3">
          <NavLink
            to={`/irl/operador/${user.id}`}
            className="hover:text-gray-300"
          >
            {user.nome}
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Nav;
