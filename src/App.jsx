import React from 'react';
import { routes } from './rutas/routes';
import { RouterProvider } from 'react-router-dom';
import UsuarioState from './contexto/usuario/UsuarioState';
import Modal from 'react-modal';

Modal.setAppElement('#root');
function App() {
    return (
        <UsuarioState>
            <RouterProvider router={routes}>
            </RouterProvider>
        </UsuarioState>
        
    );
}

export default App;
