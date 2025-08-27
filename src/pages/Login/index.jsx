import React, {useContext} from "react";
import LoginForm from "./login";
import fundoImage from "../../assets/BackRena.png"
import Mensagem from "../layout/hooks/Mensagem";
import { AuthContext } from "../../components/AuthContext";

export default function Login() {
    const { successMessage, errorMessage} = useContext(AuthContext); 
    return(
    <div className="flex items-center justify-center  min-h-screen bg-gray-200 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${fundoImage})` }}>
        {/* Imagem de fundo ou outros elementos */}
      </div>
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
            <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
            <LoginForm/>
        </div>
        <Mensagem successMessage={successMessage} errorMessage={errorMessage} />
    </div>)
}