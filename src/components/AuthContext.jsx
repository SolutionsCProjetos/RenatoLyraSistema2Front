import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { instance1 } from '../api/axios';
import { jwtDecode } from "jwt-decode";
import useMensagem from "../pages/layout/hooks/useMensagem";
import Mensagem from "../pages/layout/hooks/Mensagem";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('token'));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Estado para controlar a visibilidade do HeaderVertical
    const navigate = useNavigate();
    const { successMessage, errorMessage, showSuccessMessage, showErrorMessage } = useMensagem();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = jwtDecode(token);
                const isExpired = payload.exp * 1000 < Date.now();
                if (!isExpired) {
                    instance1.defaults.headers.Authorization = `Bearer ${token}`;
                    setUser({
                        id: payload.id,
                        nome: payload.nome,
                        empresa: payload.empresa,
                        rule: payload.rule,
                        setor: payload.setorId,
                    });
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                }
            } catch (error) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const handleLogin = async (email, senha) => {
        try {
            const response = await instance1.post('/login', { email, senha });
            const token = response.data.token;
    
            if (token) {
                localStorage.setItem('token', token);
                instance1.defaults.headers.Authorization = `Bearer ${token}`;
                const payload = jwtDecode(token);
    
                // Verifique a existência da propriedade 'rule'
                if (payload.rule !== undefined && payload.rule !== null) {
                    setUser({
                        id: payload.id,
                        nome: payload.nome,
                        empresa: payload.empresa,
                        rule: payload.rule,
                        setor: payload.setorId,
                    });
                    setIsAuthenticated(true);
                    navigate('/irl/home'); // Redirecionar após definir estado
                } else {
                    throw new Error("Token não contém a propriedade 'rule'");
                }                
            } else {
                throw new Error('Token não recebido');
            }
        } catch (error) {
            console.log("puxando o catch", error);
            if (error.response && error.response.data && error.response.data.message) {
                showErrorMessage(error.response.data.message);
            } else {
                showErrorMessage('Erro ao realizar login. Verifique seus dados.');
            }
        }
    };      

    useEffect(() => {
        const syncLogout = (event) => {
            if (event.key === 'logout') {
                setIsAuthenticated(false);
                instance1.defaults.headers.Authorization = undefined;
                navigate('/irl/');
            }
        };

        window.addEventListener('storage', syncLogout);

        return () => {
            window.removeEventListener('storage', syncLogout);
        };
    }, [navigate]);

    const handleLogout = () => {
        setIsModalOpen(true);
    };

    const handleConfirmLogout = () => {
        setIsAuthenticated(false);
        instance1.defaults.headers.Authorization = undefined;
        localStorage.removeItem('token');
        setIsModalOpen(false);
        navigate('/irl/');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const toggleHeaderVisibility = () => {
        setIsHeaderVisible((prev) => !prev);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            user, 
            handleLogin, 
            successMessage, // Passando as mensagens aqui
            errorMessage, 
            handleLogout, 
            handleConfirmLogout, 
            handleCloseModal, 
            isModalOpen,
            isHeaderVisible, 
            toggleHeaderVisibility,
        }}>
            <Mensagem successMessage={successMessage} errorMessage={errorMessage} />
            {children}
        </AuthContext.Provider>
    );
};
