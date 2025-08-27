import React from "react";
import { useNavigate } from "react-router-dom";

// Componente BotaoVoltar
export const BotaoVoltar = () => {
  const navigate = useNavigate();
  return (
    <button
      className="bg-indigo-800 py-1 my-2 px-16 mx-1.5 rounded hover:bg-indigo-900 transition duration-300"
      type="button"
      onClick={() => navigate(-1)}
    >
      <p className="block text-sm font-medium text-slate-100">Voltar</p>
    </button>
  );
};

export const BotaoGravar = ({onClick}) => {
    return(
        <button
            className="bg-sky-900 py-1 my-2 px-16 mx-1.5 rounded hover:bg-sky-950 transition duration-300"
            onClick={onClick}
            type="button"
        >
            <p className="block text-sm font-medium text-slate-100">Gravar</p>
        </button>
    )
}

export const BotaoAnamnese = ({onClick}) => {
    return(
        <button
            className="bg-sky-900 py-1 my-2 px-16 mx-1.5 rounded hover:bg-sky-950 transition duration-300"
            onClick={onClick}
            type="button"
        >
            <p className="block text-sm font-medium text-slate-100">Anamnese</p>
        </button>
    )
}

export const BotaoEditarT = () => {
    return(
        <button
            className="text-blue-900 hover:text-blue-950"
        >
            Editar
        </button>
    )
}

export const BotaoDeletar = ({onClick}) => {
    return(
        <button
            className="text-red-600 hover:text-red-950 mx-1.5"
            onClick={onClick}
        >
            Deletar
        </button>
    )
}


// Componente BotaoEditar
export const BotaoEditar = ({ onClick }) => {
  return (
    <button
      className="bg-sky-900 py-1 px-6 rounded hover:bg-sky-950 duration-300"
      type="button"
      onClick={onClick}
    >
      <p className="block text-sm font-medium text-slate-100">Editar</p>
    </button>
  );
};

export const BotaoAtualizar = ({ onClick }) => {
    return (
        <button 
            className="bg-blue-900 py-1 px-16 my-2 mx-1.5 rounded hover:bg-blue-950 transition duration-300"
            type="button"
            onClick={onClick}
        >
            <p className="block text-sm font-medium text-slate-100">Atualizar</p>
        </button>
    )
}



export const BotaoNovo = ({onClick}) => {
    return(
        <button
            className="bg-sky-900 py-1 px-16 mt-1 rounded hover:bg-sky-950 transition duration-300 p-2"
            onClick={onClick}
            type="button"
        >
            <p className="block text-sm font-medium text-slate-100">Novo</p>
        </button>
    )
}

export const BotaoRecuperar = ({onClick}) => {
    return(
        <button
            className="bg-cyan-800 py-1 my-2 px-16 mx-1.5 rounded hover:bg-cyan-950 duration-300"
            onClick={onClick}
            type="button"
        >
            <p className="block text-sm font-medium text-slate-100">Recuperar senha</p>
        </button>
    )
}

export const BotaoFiltrar = ({onClick}) => {
    return(
        <button
            className="bg-teal-900 text-white p-2 my-2 w-full sm:w-auto ml-2"
            onClick={onClick}
            type="button"
        >
            <p className="">Filtrar</p>
        </button>
    )
}

export const BotaoLimpar = ({onClick}) => {
    return(
        <button
            className="bg-buttonLimpar-700 text-white p-2 w-full sm:w-auto ml-2"
            onClick={onClick}
            type="button"
        >
            <p className="">Limpar</p>
        </button>
    )
}

// Se necessario continue criando mais botões da mesma forma...
