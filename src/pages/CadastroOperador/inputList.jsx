import React, { useState } from "react";
import { instance1 } from "../../api/axios";
import CheckList from "../checkList/index";
import useMensagem from "../layout/hooks/useMensagem";
import Mensagem from "../layout/hooks/Mensagem";
import Buscar from "../Buscas/buscarSetores";
import { BotaoGravar, BotaoVoltar } from "../../components/Butons";

export default function InputList() {
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState(null);
  const [rule, setRule] = useState('0');
  const [setorId, setSetorId] = useState(''); // Altere para armazenar o setorId
  const [formKey, setFormKey] = useState(Date.now());
  const { successMessage, errorMessage, showSuccessMessage, showErrorMessage } = useMensagem();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Verificação de campos obrigatórios
    if (!nome.trim()) {
      showWarningMessage("O nome é obrigatório.");
      return;
    }
    if (!senha.trim()) {
      showWarningMessage("A senha é obrigatória.");
      return;
    }
    if (!email.trim()) {
      showWarningMessage("Informe um e-mail.");
      return;
    }
    /* if (!empresa.trim()) {
      showWarningMessage("Informe a empresa.");
      return;
    } */
    if (!setorId) { // Verifique o setorId em vez do setor
      showWarningMessage("Informe o setor.");
      return;
    }

    try {
      const response = await instance1.post('/usuario', {
        nome,
        senha,
        email,
        empresa,
        rule,
        setorId // Enviar o setorId ao backend
      });
      showSuccessMessage(response.data.message || 'Operador criado com sucesso!');
      clearForm();
    } catch (error) {
      console.error('Erro ao enviar os dados: ', error);
      if (error.response && error.response.data) {
        return showErrorMessage(error.response.data.error || 'Erro desconhecido');
      }
        showErrorMessage('Erro ao enviar os dados. Por favor, tente novamente.');
    }
  };

  const clearForm = () => {
    setNome('');
    setSenha('');
    setEmail('');
    setRule('0');
    setEmpresa(null);
    setSetorId(''); // Resetar setorId
    setFormKey(Date.now());
  };

  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl w-max h-full">
          <div className="grid grid-cols-1 gap-4 my-2 mx-auto">
            <h2 className="text-2xl text-black underline col-start-1 row-start-1 ml-2">Cadastro de usuário</h2> 
          </div>
          <div className="grid md:grid-cols-2 sm:grid-cols-1 mx-2 grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipo de Usuário:</label>
              <select
                className="bg-white text-black p-1 mt-2 rounded"
                value={rule}
                onChange={(e) => setRule(e.target.value)}
              >
                <option value="0">Padrão</option>
                <option value="1">Administrador</option>
                <option value="2">Recrutador</option>
                <option value="3">Demanda</option>
              </select>
            </div>
            <Buscar setorSel="Setor:" onSelectSetor={(setorId) => setSetorId(setorId)} /> {/* Modificado */}
            <CheckList
              types="text"
              descricao="Nome:"
              placeholderInput="João Ferreira"
              value={nome}
              onChange={setNome}
              menssagemError="O nome do cliente não pode estar vazio"
            />
            <CheckList
              types="password"
              descricao="Senha:"
              placeholderInput="*******"
              value={senha}
              onChange={setSenha}
              menssagemError="A senha não pode estar vazia"
            />
            <CheckList
              types="email"
              descricao="E-mail:"
              placeholderInput="email@gmail.com"
              value={email}
              onChange={setEmail}
              menssagemError="O e-mail não pode estar vazio"
            />
          {/*   <CheckList
              types="text"
              descricao="Empresa:"
              placeholderInput="Empresa"
              value={empresa}
              onChange={setEmpresa}
              menssagemError="A empresa deve ser informada!"
            /> */}
          </div> 
          <div className="flex flex-row justify-end">
            <BotaoGravar onClick={handleSubmit}/>
            <BotaoVoltar/>
          </div>
        </div>
      </form>
      <Mensagem successMessage={successMessage} errorMessage={errorMessage} />
    </>
  );
}
