import React, { useContext } from "react";
import Modal from "react-modal";
import HeaderVertical from "../layout/Header";
import HeaderHorizontal from "../layout/HeaderHorizontal";
import { AuthContext } from "../../components/AuthContext";

const Layout = ({ children }) => {
  Modal.setAppElement("#root");
   const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      <HeaderVertical />
      <div className="flex flex-col flex-grow">
        <HeaderHorizontal />
        <div className="relative flex items-center justify-center w-full h-full">
          {/* Conteúdo da rota */}
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
