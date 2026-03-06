import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import PageHome from '../componentes/plantilla/PageHome';
import ModalRegistroUsuario from "../paginas/login/ModalRegistroCliente";







import ActualizarContrasena from "../paginas/login/ActualizarContraseña";

import EnviarPin from "../paginas/login/EnviarPin";


import Login from "../paginas/login/Login";



import { AutenticacionRoute } from "./AutenticacionRoute";







export const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route>

      <Route path="/" element={<Login />} />

      <Route path="/login" element={<Login />} />
      <Route path="/recuperar-pin" element={<EnviarPin />} />
      <Route path="/actualizar-contrasena" element={<ActualizarContrasena />} />
      <Route path="/registro-cliente" element={<ModalRegistroUsuario />} />
      <Route path="app/" element={<AutenticacionRoute />}>

      

       

     

        
        <Route path="home" element={<PageHome />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);