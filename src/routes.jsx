// routes.js
import { useContext } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "./components/AuthContext";

import Erro from "./pages/Error";
import Home from "./pages/Home";
import Login from "./pages/Login/";

import PassPut from "./pages/CadastroOperador/recuperarSenha/";

import Clientes from "./pages/CadastroOperador";
import SearchRecords from "./pages/CadastroOperador/listaOperadores";
import Atualizador from "./pages/CadastroOperador/atualizar";

//Operações
import SearchOperacao from "./pages/operacoes/buscaroperacao/searchOperacao";
import Operacao from "./pages/operacoes/novaOperacao";
import Operacaoput from "./pages/operacoes/atualizar/";

//Configuração
import Config from "./pages/config";

//Contas a Receber
import InputReceber from "./pages/Receber";
import Financeiro from "./pages//FInanceiro/index";
import PutReceber from "./pages/Receber/atualizar";

//Contas a pagar
import InputContas from "./pages/ContasApagar";
import Contas from "./pages/ContasApagar/buscarContas";
import PutContas from "./pages/ContasApagar/atualizarContas";

//Pet
import InputPet from "./pages/pet";
import Pet from "./pages/pet/buscar";
import PutPet from "./pages/pet/atualizar";

//Raça
import InputRaca from "./pages/pet/racas/input";
import PutRaca from "./pages/pet/racas/atualizar";

//whatApp teste
import WhatsAppTest from "./pages/config/whatsApp/teste";

//Vacina
import InputVacinas from "./pages/pet/vacinas/input";
import PutVacinas from "./pages/pet/vacinas/atualizar";

//Setores
import InputSetor from "./pages/config/sectors/input";
import PutSetor from "./pages/config/sectors/atualizar";

//Pagamentos
import InputPayment from "./pages/config/payment/input";
import PutPayment from "./pages/config/payment/atualizar";

import IndexComercio from "./pages/config/negocio/input";
import UpdateComercio from "./pages/config/negocio/atualizar";

import Inputcliente from "./pages/client/NovoCliente";
import Cliente from "./pages/client/buscarClientes";
import PutCliente from "./pages/client/main";

//Categorias
import InputCategory from "./pages/config/category/input";
import PutCategorys from "./pages/config/category/atualizar";
import Category from "./pages/config/category/buscar";

import InputParceiro from "./pages/parceiros/NovoParceiros";
import Parceiro from "./pages/parceiros/buscarParceiros";
import PutParceiro from "./pages/parceiros/main";

import NavAmenese from "./pages/anamnese/main";
import NavParceiro from "./pages/anamnese/main/indexParceiro";

import InputExame from "./pages/anamnese/exameFisica/NovoExame";
import PutExame from "./pages/anamnese/exameFisica/atualizarExame/";

import InputManejo from "./pages/anamnese/manejo/NovoManejo";
import ManejoPut from "./pages/anamnese/manejo/atualizarManejo";

import InputCardio from "./pages/anamnese/cardio/NovoCardio";
import CardioPut from "./pages/anamnese/cardio/atualizarCardio";

import InputGastro from "./pages/anamnese/Gastro/NovoGastro";
import GastroPut from "./pages/anamnese/Gastro/atualizarGastro";

import InputLocomotor from "./pages/anamnese/locomotor/NovoLocoMotor";
import LocomotorPut from "./pages/anamnese/locomotor/atualizarLocoMotor";

import InputNeurologico from "./pages/anamnese/neurologico/NovoNeurologico";
import NeurologicoPut from "./pages/anamnese/neurologico/atualizarNeurologico/";

import InputTegumenta from "./pages/anamnese/tegumenta/NovoTegumenta";
import PutTegumenta from "./pages/anamnese/tegumenta/atualizarTegumenta";

import InputUrinario from "./pages/anamnese/urinario/NovoUrinario";
import PutUrinario from "./pages/anamnese/urinario/atualizarUrinario";

import ListaCandidato from "./pages/Candidatos/buscarCandidato";
import InputCandidato from "./pages/Candidatos/NovoCandidato";
import Candidato from "./pages/Candidatos/atualizarCandidato";

import DemandaInput from "./pages/Demanda/NovaDemanda/";
import Demanda from "./pages/Demanda/buscarDemanda/";
import PutDemanda from "./pages/Demanda/atualizarDemanda";

import SolicitanteInput from "./pages/Solicitante/NovaSolicitante";
import Solicitante from "./pages/Solicitante/buscarSolicitante";
import PutSolicitante from "./pages/Solicitante/atualizarSolicitante";

import PetGeral from "./pages/pet/geral";
import Layout from "./pages/styles/layout";

// Função que retorna uma rota privada
function PrivateRoute({ element, ...rest }) {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/irl/" replace />;
}

export default function RoutesApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/irl" element={<Login />} />
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route
                    path="*"
                    element={<PrivateRoute element={<Erro />} />}
                  />
                  <Route
                    path="/irl/home"
                    element={<PrivateRoute element={<Home />} />}
                  />

                  <Route
                    path="/irl/geral/:id"
                    element={<PrivateRoute element={<PetGeral />} />}
                  />

                  <Route
                    path="/irl/cadastro"
                    element={<PrivateRoute element={<Clientes />} />}
                  />
                  <Route
                    path="/irl/operadores"
                    element={<PrivateRoute element={<SearchRecords />} />}
                  />
                  <Route
                    path="/irl/operador/:id"
                    element={<PrivateRoute element={<Atualizador />} />}
                  />

                  <Route
                    path="/irl/receber"
                    element={<PrivateRoute element={<InputReceber />} />}
                  />
                  <Route
                    path="/irl/financeiro"
                    element={<PrivateRoute element={<Financeiro />} />}
                  />
                  <Route
                    path="/irl/receber/:id"
                    element={<PrivateRoute element={<PutReceber />} />}
                  />

                  <Route
                    path="/irl/pet"
                    element={<PrivateRoute element={<InputPet />} />}
                  />
                  <Route
                    path="/irl/pets"
                    element={<PrivateRoute element={<Pet />} />}
                  />
                  <Route
                    path="/irl/pet/:id"
                    element={<PrivateRoute element={<PutPet />} />}
                  />

                  <Route
                    path="/irl/raca"
                    element={<PrivateRoute element={<InputRaca />} />}
                  />
                  <Route
                    path="/irl/raca/:id"
                    element={<PrivateRoute element={<PutRaca />} />}
                  />

                  <Route
                    path="/irl/vacina"
                    element={<PrivateRoute element={<InputVacinas />} />}
                  />
                  <Route
                    path="/irl/vacina/:id"
                    element={<PrivateRoute element={<PutVacinas />} />}
                  />

                  <Route
                    path="/irl/config"
                    element={<PrivateRoute element={<Config />} />}
                  />

                  <Route
                    path="/irl/setor"
                    element={<PrivateRoute element={<InputSetor />} />}
                  />
                  <Route
                    path="/irl/setor/:id"
                    element={<PrivateRoute element={<PutSetor />} />}
                  />

                  <Route
                    path="/irl/payment"
                    element={<PrivateRoute element={<InputPayment />} />}
                  />
                  <Route
                    path="/irl/payment/:id"
                    element={<PrivateRoute element={<PutPayment />} />}
                  />

                  <Route
                    path="/irl/setor"
                    element={<PrivateRoute element={<InputSetor />} />}
                  />
                  <Route
                    path="/irl/setor/:id"
                    element={<PrivateRoute element={<PutSetor />} />}
                  />

                  <Route
                    path="/irl/comercio"
                    element={<PrivateRoute element={<IndexComercio />} />}
                  />
                  <Route
                    path="/irl/comercio/:id"
                    element={<PrivateRoute element={<UpdateComercio />} />}
                  />

                  <Route
                    path="/irl/categoria"
                    element={<PrivateRoute element={<InputCategory />} />}
                  />
                  <Route
                    path="/irl/categorias"
                    element={<PrivateRoute element={<Category />} />}
                  />
                  <Route
                    path="/irl/categoria/:id"
                    element={<PrivateRoute element={<PutCategorys />} />}
                  />

                  <Route
                    path="/irl/operacoes"
                    element={<PrivateRoute element={<SearchOperacao />} />}
                  />
                  <Route
                    path="/irl/operacao"
                    element={<PrivateRoute element={<Operacao />} />}
                  />
                  <Route
                    path="/irl/putOperacao/:id"
                    element={<PrivateRoute element={<Operacaoput />} />}
                  />

                  <Route
                    path="/irl/cliente"
                    element={<PrivateRoute element={<Inputcliente />} />}
                  />
                  <Route
                    path="/irl/clientes"
                    element={<PrivateRoute element={<Cliente />} />}
                  />
                  <Route
                    path="/irl/cliente/:id"
                    element={<PrivateRoute element={<PutCliente />} />}
                  />

                  <Route
                    path="/irl/conta"
                    element={<PrivateRoute element={<InputContas />} />}
                  />
                  <Route
                    path="/irl/contas"
                    element={<PrivateRoute element={<Contas />} />}
                  />
                  <Route
                    path="/irl/putContas/:id"
                    element={<PrivateRoute element={<PutContas />} />}
                  />

                  <Route
                    path="/irl/parceiro"
                    element={<PrivateRoute element={<InputParceiro />} />}
                  />
                  <Route
                    path="/irl/parceiros"
                    element={<PrivateRoute element={<Parceiro />} />}
                  />
                  <Route
                    path="/irl/parceiro/:id"
                    element={<PrivateRoute element={<PutParceiro />} />}
                  />

                  <Route
                    path="/irl/anamnese/:petId"
                    element={<PrivateRoute element={<NavAmenese />} />}
                  />
                  <Route
                    path="/irl/anamneseP/:petId"
                    element={<PrivateRoute element={<NavParceiro />} />}
                  />

                  <Route
                    path="/irl/exameFisico"
                    element={<PrivateRoute element={<InputExame />} />}
                  />
                  <Route
                    path="/irl/exameFisico/:id"
                    element={<PrivateRoute element={<PutExame />} />}
                  />

                  <Route
                    path="/irl/manejo"
                    element={<PrivateRoute element={<InputManejo />} />}
                  />
                  <Route
                    path="/irl/manejo/:id"
                    element={<PrivateRoute element={<ManejoPut />} />}
                  />

                  <Route
                    path="/irl/cardio"
                    element={<PrivateRoute element={<InputCardio />} />}
                  />
                  <Route
                    path="/irl/cardio/:id"
                    element={<PrivateRoute element={<CardioPut />} />}
                  />

                  <Route
                    path="/irl/gastro"
                    element={<PrivateRoute element={<InputGastro />} />}
                  />
                  <Route
                    path="/irl/gastro/:id"
                    element={<PrivateRoute element={<GastroPut />} />}
                  />

                  <Route
                    path="/irl/locomotor"
                    element={<PrivateRoute element={<InputLocomotor />} />}
                  />
                  <Route
                    path="/irl/locomotor/:id"
                    element={<PrivateRoute element={<LocomotorPut />} />}
                  />

                  <Route
                    path="/irl/neurologico"
                    element={<PrivateRoute element={<InputNeurologico />} />}
                  />
                  <Route
                    path="/irl/neurologico/:id"
                    element={<PrivateRoute element={<NeurologicoPut />} />}
                  />

                  <Route
                    path="/irl/tegumentar"
                    element={<PrivateRoute element={<InputTegumenta />} />}
                  />
                  <Route
                    path="/irl/tegumentar/:id"
                    element={<PrivateRoute element={<PutTegumenta />} />}
                  />

                  <Route
                    path="/irl/urinario"
                    element={<PrivateRoute element={<InputUrinario />} />}
                  />
                  <Route
                    path="/irl/urinario/:id"
                    element={<PrivateRoute element={<PutUrinario />} />}
                  />

                  <Route
                    path="/irl/candidatos"
                    element={<PrivateRoute element={<ListaCandidato />} />}
                  />
                  <Route
                    path="/irl/candidato"
                    element={<PrivateRoute element={<InputCandidato />} />}
                  />
                  <Route
                    path="/irl/candidato/:id"
                    element={<PrivateRoute element={<Candidato />} />}
                  />

                  <Route
                    path="/irl/demanda"
                    element={<PrivateRoute element={<DemandaInput />} />}
                  />
                  <Route
                    path="/irl/demandas"
                    element={<PrivateRoute element={<Demanda />} />}
                  />
                  <Route
                    path="/irl/demanda/:id"
                    element={<PrivateRoute element={<PutDemanda />} />}
                  />

                  <Route
                    path="/irl/solicitante"
                    element={<PrivateRoute element={<SolicitanteInput />} />}
                  />
                  <Route
                    path="/irl/solicitantes"
                    element={<PrivateRoute element={<Solicitante />} />}
                  />
                  <Route
                    path="/irl/solicitante/:id"
                    element={<PrivateRoute element={<PutSolicitante />} />}
                  />
                  
                  <Route
                    path="/irl/whatsApp"
                    element={<PrivateRoute element={<WhatsAppTest />} />}
                  />

                  <Route
                    path="/irl/recuperacao"
                    element={<PrivateRoute element={<PassPut />} />}
                  />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
