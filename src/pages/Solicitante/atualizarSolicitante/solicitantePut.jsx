import { useState, useEffect, useRef, useContext } from "react";
import { instance1, instance2 } from "../../../api/axios";
import CheckList from "../../checkList";
import CheckListNome from "../../checkList/nome/checkListNome";
import InputMask from "react-input-mask";
import { FaSearchLocation } from "react-icons/fa";
import useMensagem from "../../layout/hooks/useMensagem";
import Mensagem from "../../layout/hooks/Mensagem";
import { BotaoVoltar, BotaoAtualizar } from "../../../components/Butons";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../../components/AuthContext";

export default function CandidatoPut() {
  const { user } = useContext(AuthContext); // Acesse o usuário do contexto de autenticação
  const inputRef = useRef(null);
  const { id } = useParams();
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [telefoneContato, setTelefoneContato] = useState("");
  const [cep, setCep] = useState("");
  const [cepError, setCepError] = useState("");
  const [loading, setLoading] = useState(false);
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [zona, setZona] = useState("");
  const [pontoReferencia, setPontoReferencia] = useState("");
  const [tituloEleitor, setTituloEleitor] = useState("");
  const [zonaEleitoral, setZonaEleitoral] = useState("");
  const [solicitante, setSolicitante] = useState("");
  const [formKey, setFormKey] = useState(Date.now());

  const {
    successMessage,
    errorMessage,
    warningMessage,
    showSuccessMessage,
    showErrorMessage,
    showWarningMessage,
  } = useMensagem();

  useEffect(() => {
    const fetchReceber = async () => {
      try {
        const response = await instance1.get(`/solicitante/${id}`);
        const data = response.data;
        setSolicitante(data.solicitante),
          setNomeCompleto(data.nomeCompleto),
          setCpf(data.cpf),
          setCep(data.cep),
          setEndereco(data.endereco);
          setNumero(data.num);
          setBairro(data.bairro), setZona(data.zona);
          setPontoReferencia(data.pontoReferencia);
          setTituloEleitor(data.titulo),
          setTelefoneContato(data.telefoneContato),
          setEmail(data.email),
          setZonaEleitoral(data.zonaEleitoral)
      } catch (error) {
        console.error("Erro ao buscar os dados do backend: ", error);
        showErrorMessage("Erro ao buscar os dados.");
      }
    };
    fetchReceber();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await instance1.put(`/solicitante/${id}`, {
        solicitante,
        nomeCompleto,
        cpf,
        titulo: tituloEleitor,
        telefoneContato,
        cep,
        endereco,
        bairro,
        num: numero,
        zona,
        pontoReferencia,
        email,
        zonaEleitoral,
      });

      showSuccessMessage(
        response.data.message || "Demanda atualizado com sucesso!"
      );
    } catch (error) {
      if (error.response && error.response.data) {
        showErrorMessage(
          error.response.data.message || "Erro ao atualizar o demanda."
        );
      } else {
        console.log(error);
        showErrorMessage(
          "Erro ao enviar os dados. Por favor, tente novamente."
        );
      }
    }
  };

  const BuscarEndereco = async () => {
    if (cep === "") {
      alert("Digite um CEP!");
      setCep("");
      return;
    }

    setLoading(true);
    setCepError("");
    try {
      const response = await instance2.get(`/${cep}/json/`);
      const data = response.data;
      console.log("Resposta da API ViaCEP:", data);

      if (data.erro) {
        setCepError("CEP não encontrado!");
        setLoading(false);
        return;
      }

      setEndereco(data.logradouro);
      setBairro(data.bairro);
      setPontoReferencia(data.complemento);
      setLoading(false);
    } catch (err) {
      console.error("Erro ao buscar o CEP:", err);
      setCepError("Erro ao buscar o CEP. Por favor, tente novamente.");
      setLoading(false);
    }
  };

  return (
    <>
      <form key={formKey}>
        <div className="bg-slate-200 bg-opacity-10 backdrop-filter backdrop-blur-md rounded-lg shadow-xl">
          <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-4 mt-2 mx-2">
            <div className="col-span-3">
              <h3 className=" text-lg font-semibold">Dados Pessoal</h3>
              <hr className="border-t border-black" />
            </div>
            <CheckList
              descricao="Solicitante:"
              types="text"
              value={solicitante}
              onChange={setSolicitante}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder=""
                  value={solicitante}
                  onChange={(e) => setSolicitante(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                />
              }
            />
            <div className="col-span-2 w-full">
              <CheckListNome
                descricao="*Nome completo:"
                types="text"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value.toUpperCase())}
                messagemError=""
                inputComponent={
                  <input
                    type="text"
                    placeholder="Marcos Antonio"
                    value={nomeCompleto}
                    onChange={(e) =>
                      setNomeCompleto(e.target.value.toUpperCase())
                    }
                    className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full uppercase"
                    required
                  />
                }
              />
            </div>
            <CheckList
              types="text"
              descricao="*CPF:"
              value={cpf}
              onChange={setCpf}
              menssagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  value={cpf}
                  mask="999.999.999-99"
                  placeholder="135.477.445-02"
                  onChange={(e) => setCpf(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="Titulo de Eleitor:"
              types="text"
              value={tituloEleitor}
              onChange={(e) => setTituloEleitor(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  value={tituloEleitor}
                  mask="9999 9999 9999"
                  placeholder="0000 0000 0000"
                  onChange={(e) => setTituloEleitor(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              types="tel"
              descricao="*Telefone:"
              value={telefoneContato}
              onChange={setTelefoneContato}
              menssagemError=""
              inputComponent={
                <InputMask
                  ref={inputRef}
                  mask="(99) 9 9999-9999"
                  value={telefoneContato}
                  placeholder="(81) 9 2325-5555"
                  onChange={(e) => setTelefoneContato(e.target.value)}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                  required
                />
              }
            />
            <CheckList
              descricao="E-mail:"
              types="text"
              value={email}
              onChange={setEmail}
              placeholderInput="email@email.com"
              inputComponent={
                <input
                  type="text"
                  placeholder="email@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toUpperCase())}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                />
              }
              messagemError=""
            />
            <div className="col-span-3">
                          <h3 className=" text-lg font-semibold">Endereço</h3>
                          <hr className="border-t border-black" />
                        </div>
                        <div className="relative">
                          <CheckList
                            types="text"
                            descricao="Cep:"
                            value={cep}
                            onChange={setCep}
                            menssagemError=""
                            inputComponent={
                              <InputMask
                                ref={inputRef}
                                mask="99999-999"
                                value={cep}
                                onChange={(e) => setCep(e.target.value)}
                                placeholder="55520-000"
                                className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 pl-4"
                              />
                            }
                          />
                          <button
                            type="button"
                            onClick={BuscarEndereco}
                            className="absolute left-11 top-7 mt-1 ml-36"
                          >
                            <FaSearchLocation />
                          </button>
                          {cepError && (
                            <p className="top-14 mt-1 ml-2 absolute">{cepError}</p>
                          )}
                        </div>
                        <CheckList
                          types="text"
                          descricao="Endereço:"
                          placeholderInput="R: Joao mendes ferreira"
                          value={endereco}
                          onChange={setEndereco}
                          inputComponent={
                            <input
                              type="text"
                              placeholder="R: Joao mendes ferreira"
                              value={endereco}
                              onChange={(e) => setEndereco(e.target.value.toUpperCase())}
                              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                            />
                          }
                          menssagemError=""
                        />
                        <CheckList
                          types="text"
                          descricao="Número:"
                          placeholderInput="125"
                          value={numero}
                          onChange={setNumero}
                          menssagemError=""
                        />
                        <CheckList
                          types="text"
                          descricao="Bairro: "
                          placeholderInput="Salgado"
                          value={bairro}
                          onChange={setBairro}
                          inputComponent={
                            <input
                              type="text"
                              placeholder="Salgado"
                              value={bairro}
                              onChange={(e) => setBairro(e.target.value.toUpperCase())}
                              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                            />
                          }
                          menssagemError=""
                        />
                        <div>
                          <span className="block text-sm font-medium text-slate-700">
                            Zona:
                          </span>
                          <select
                            id="Zona"
                            value={zona}
                            onChange={(e) => setZona(e.target.value)}
                            className="mt-1 block w-52 px-3 bg-white border border-slate-300 rounded-md text-sm shadow-sm 
                                                            focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-slate-400
                                                            disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none h-10"
                            required
                          >
                            <option value="Urbana">Urbana</option>
                            <option value="Rural">Rural</option>
                          </select>
                        </div>
                        <CheckList
                          types="text"
                          descricao="Ponto Referencia:"
                          placeholderInput="Ao lado da praça"
                          value={pontoReferencia}
                          onChange={setPontoReferencia}
                          inputComponent={
                            <input
                              type="text"
                              placeholder="Ao lado da praça"
                              value={pontoReferencia}
                              onChange={(e) =>
                                setPontoReferencia(e.target.value.toUpperCase())
                              }
                              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                            />
                          }
                          menssagemError=""
                        />
            <CheckList
              descricao="Zona Eleitoral:"
              types="text"
              value={zonaEleitoral}
              onChange={(e) => setZonaEleitoral(e.target.value.toUpperCase())}
              messagemError=""
              inputComponent={
                <input
                  type="text"
                  placeholder="142"
                  value={zonaEleitoral}
                  onChange={(e) =>
                    setZonaEleitoral(e.target.value.toUpperCase())
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 uppercase" // CSS para forçar maiúsculas
                  required
                />
              }
            />
          </div>
          <div className="flex flex-row mt-11 justify-end">
            <BotaoAtualizar onClick={handleSubmit} />
            <BotaoVoltar />
          </div>
        </div>
      </form>
      <Mensagem
        successMessage={successMessage}
        errorMessage={errorMessage}
        warningMessage={warningMessage}
      />
    </>
  );
}
