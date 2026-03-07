import { Navigate, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import PageHome from '../componentes/plantilla/PageHome';
import ModalRegistroUsuario from "../paginas/login/ModalRegistroCliente";
import ActualizarContrasena from "../paginas/login/ActualizarContraseña";
import EnviarPin from "../paginas/login/EnviarPin";
import Login from "../paginas/login/Login";
import VehiculosLayout from './VehiculoLayout';
import NuevoVehiculo from '../paginas/vehiculos/NuevoVehiculo';
import HomeVehiculos from '../paginas/vehiculos/HomeVehiculo';
import EditarVehiculo from '../paginas/vehiculos/EditarVehiculo'
import MovimientoLayout from './VehiculoLayout'
import NuevoMovimiento from '../paginas/movimientos/NuevoMovimiento';
import HomeMovimientos from '../paginas/movimientos/HomeMovimiento';
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

        <Route path="vehiculos" element={<VehiculosLayout />}>
          <Route path="nuevo" element={<NuevoVehiculo />} />
          <Route path="editar" element={<EditarVehiculo />} />
          <Route path="listado" element={<HomeVehiculos />} />
        </Route>

        <Route path="movimientos" element={<MovimientoLayout />}>
          <Route path="nuevo" element={<NuevoMovimiento/>} />
          <Route path="listado" element={<HomeMovimientos/>} />
        </Route>






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