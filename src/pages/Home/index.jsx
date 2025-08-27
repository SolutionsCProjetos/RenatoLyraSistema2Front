import React, { useContext } from "react";
import ImageHome from "../../assets/HomeRena.png";
import { AuthContext } from "../../components/AuthContext";
import PushOperacao from "./pushOperacoes";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex">
      <div className="flex flex-col flex-grow ">
        <div className="flex flex-col items-center">
          <div className="flex justify-center items-center w-full">
            <PushOperacao />
          </div>
        </div>
      </div>
    </div>
  );
}
