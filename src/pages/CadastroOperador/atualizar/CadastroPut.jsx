import React, { useState, useEffect, useContext } from "react";
import { instance1 } from "../../../api/axios";
import CheckList from "../../checkList/index";
import { useParams, useNavigate } from "react-router-dom";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import RecuperarModal from "../../layout/hooks/RecuperarModal";
import Buscar from "../../Buscas/buscarSetores";
import { BotaoAtualizar, BotaoRecuperar, BotaoVoltar } from "../../../components/Butons";
import { AuthContext } from "../../../components/AuthContext";

export default function CadastroPut() {
  const { user } = useContext(AuthContext);
  const { id } = useParams();
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [setorNome, setSetorNome] = useState(''); // Armazenar o nome do setor
  const [setorId, setSetorId] = useState(''); // Armazenar o setorId
  const [token, setToken] = useState('');
  const [rule, setRule] = useState('');
  const { successMessage, errorMessage, warningMessage, showSuccessMessage, showErrorMessage, showWarningMessage } = useMensagem();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCadastro = async () => {
      try {
        const response = await instance1.get(`/usuario/${id}`);
        const data = response.data;

        // Certifique-se de que as chaves são corretas e existem no backend
        setSenha(data.senha || '');
        setNome(data.nome || '');
        setEmail(data.email || '');
        setEmpresa(data.empresa || '');
        setRule(data.rule || '');

        // Puxar o nome do setor, caso exista
        setSetorNome(data.setor?.setor || '');
        setSetorId(data.setor?.id || ''); // Caso precise do ID do setor
      } catch (error) {
        console.error("Erro ao buscar os dados do backend: ", error);
        showErrorMessage(error.response?.data?.message || 'Erro ao carregar dados do usuário.');
      }
    };
    fetchCadastro();
  }, [id]);

  const handleSenha = async (event) => {
    event.preventDefault();
    try {
      const response = await instance1.post('/token', { email });
      setToken(response.data.token); // Ajuste conforme a resposta real do backend
      setIsModalOpen(true);
      showSuccessMessage('Token de recuperação enviado com sucesso!');
    } catch (err) {
      showErrorMessage(err.response?.data?.message || 'Erro ao tentar a conexão com o banco!');
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(token)
        .then(() => {
          setIsModalOpen(false);
          navigate('/irl/recuperacao'); // Ajuste o caminho conforme necessário
        })
        .catch(err => {
          console.error('Erro ao copiar o texto: ', err);
        });
    } else {
      console.error('Clipboard API não está disponível no navegador.');
      showErrorMessage('A função de copiar não está disponível no seu navegador.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await instance1.put(`/usuario/${id}`, {
        nome,
        senha,
        email,
        empresa,
        rule,
        setorId // Enviar o setorId corretamente
      });
      showSuccessMessage(response.data.message || 'Operador atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar os dados: ', error);
      if (error.response && error.response.data) {
        showWarningMessage(error.response.data.message || 'Erro ao atualizar operador.');
      } else {
        showErrorMessage('Erro ao tentar a conexão com o banco!');
      }
    }
  };

  return (
    <>
      <form>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-full h-full">
          <div className="grid grid-cols-1 gap-4 ml-2 mt-2">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1">
              {user?.nome || "Carregando..."}
            </h2>
          </div>
          <div className="grid mt-4 sm:grid-cols-2 grid-cols-1 gap-4 mx-2">
            {/* Select para escolher o rule */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Usuário:</label>
              <select
                className="bg-white text-black p-1 rounded"
                value={rule}
                onChange={(e) => setRule(e.target.value)}
              >
                <option value="0">Padrão</option>
                <option value="1">Administrador</option>
                <option value="2">Recrutador</option>
                <option value="3">Demanda</option>
              </select>
            </div>
            <CheckList
              types="text"
              descricao="Nome:"
              placeholderInput="João Ferreira"
              value={nome}
              onChange={setNome}
              menssagemError=""
            />
            <Buscar setorSel="Novo setor:" onSelectSetor={(setorId) => setSetorId(setorId)} /> {/* Buscar Setor */}
            <CheckList
              types="text"
              descricao="Setor Atual:"
              value={setorNome} // Mostrar o nome do setor atual
              readOnly={true} // Tornar o campo apenas leitura
            />
            <CheckList
              types="email" // Usando o tipo email para validação básica de e-mail
              descricao="E-mail:"
              placeholderInput="email@gmail.com"
              value={email}
              onChange={setEmail}
              menssagemError=""
            />
            {/*  <CheckList
              types="text"
              descricao="Empresa:"
              placeholderInput="Empresa"
              value={empresa}
              onChange={setEmpresa}
              menssagemError="A empresa deve ser informada!"
            /> */}
          </div>
          <div className="flex flex-row justify-end">
            <BotaoAtualizar onClick={handleSubmit} />
            <BotaoRecuperar onClick={handleSenha} />
            <BotaoVoltar />
          </div>
        </div>
      </form>

      <RecuperarModal
        isOpen={isModalOpen}
        token={token}
        onCopy={handleCopy}
        onClose={() => setIsModalOpen(false)}
      />
      <Mensagem successMessage={successMessage} errorMessage={errorMessage} warningMessage={warningMessage} />
    </>
  );
}
