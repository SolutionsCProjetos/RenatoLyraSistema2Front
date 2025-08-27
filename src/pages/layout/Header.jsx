import Nav from "./Nav";
import Logo from "./Logo";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthContext"; // Importe o contexto

const Header = () => {
  const { isHeaderVisible } = useContext(AuthContext); // Acessa a visibilidade do header

  if (!isHeaderVisible) return null; // Se não estiver visível, retorna null

  return (
    <div className="backdrop-filter backdrop-blur-md bg-hearder-blue sticky z-50  w-40 flex flex-col items-center border-gray-500">
      <Logo className="" />
      <Nav />
    </div>
  );
};

export default Header;
