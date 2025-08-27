import React, { useContext, useState } from "react";
import CheckList from "../checkList/index";
import { AuthContext } from "../../components/AuthContext";

export default function LoginForm() {
    const { handleLogin } = useContext(AuthContext); // Mensagens agora vêm do AuthContext
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        handleLogin(email, senha);
    };

    return (
        <>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-md p-8 rounded-lg shadow-lg w-full max-w-md">
                <form onSubmit={onSubmit}>
                    <div className="mb-4">
                        <CheckList
                            types="text"
                            descricao="Login"
                            placeholderInput="Informe o login"
                            menssagemError="O login ou a senha está incorreto"
                            value={email}
                            onChange={(value) => setEmail(value)}
                        />
                    </div>
                    <div className="mb-6">
                        <CheckList
                            types="password"
                            descricao="Senha"
                            placeholderInput="Informe a senha"
                            menssagemError="O login ou a senha está incorreto"
                            value={senha}
                            onChange={(value) => setSenha(value)}
                        />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-indigo-500 py-1 px-10 mt-4 rounded hover:bg-indigo-800 duration-300">
                            <p className="block text-sm font-medium text-slate-100">
                                Login
                            </p>
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}




    /* const handleLogin = async (event) => {
        event.preventDefault();
        try {
            navigate('/irl/home');
        } catch (error) {
            if (error.response && error.response.data) {
                showErrorMessage(error.response.data.err || "Erro ao realizar login.");
            } else {
                showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
            }
        }
    }; */