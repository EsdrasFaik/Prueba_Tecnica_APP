import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSessionStorage } from "../storage/useSessionStorage";
import {
    MotoristasListar,
    MovimientosListar,
    VehiculoListar,
    MarcasListar
} from "../../configuracion/apiUrls";
import { UsuarioContext } from "./UsuarioContext";

const UsuarioState = (props) => {
    // --- Sesión ---
    const [usuario, setUsuario] = useSessionStorage("usuario_almacenado", null);
    const [token, setToken] = useSessionStorage("toke_almacenado", null);

    // --- Listas ---
    const [listaMotoristas, setListaMotoristas] = useState([]);
    const [listaMovimientos, setListaMovimientos] = useState([]);
    const [listaVehiculos, setListaVehiculos] = useState([]);
    const [listaMarcas, setListaMarcas] = useState([]);
    const [actualizar, setActualizar] = useState(false);

    useEffect(() => {
        Lista();
    }, []);

    // --- Autenticación ---
    const setCerrarSesion = () => {
        setUsuario(null);
        setToken(null);
    };

    const setLogin = async (data) => {
        try {
            setUsuario(data.usuario);
            setToken(data.token);
        } catch (error) {
            console.log(error);
        }
    };

    // --- Carga inicial de listas ---
    const Lista = async () => {
        try {
            const motoristas = await axios.get(MotoristasListar);
            setListaMotoristas(motoristas.data || []);

            const movimientos = await axios.get(MovimientosListar);
            setListaMovimientos(movimientos.data || []);

            const vehiculos = await axios.get(VehiculoListar);
            setListaVehiculos(vehiculos.data || []);

            const marcas = await axios.get(MarcasListar);
            setListaMarcas(marcas.data || []);
        } catch (error) {
            console.error("Error al obtener datos:", error);
            setListaMotoristas([]);
            setListaMovimientos([]);
            setListaVehiculos([]);
            setListaMarcas([]);
        }
    };

    // --- Actualizar lista individual ---
    const ActualizarLista = async (url, setDatos) => {
        try {
            const respuesta = await axios.get(url);
            const data = respuesta.data || [];
            setDatos(data);
            return data;
        } catch (error) {
            console.error(`Error al actualizar la lista desde ${url}:`, error);
            setDatos([]);
            return [];
        }
    };

    return (
        <UsuarioContext.Provider
            value={{
                // Sesión
                usuario,
                token,
                setLogin,
                setCerrarSesion,

                // Listas
                listaMotoristas,
                listaMovimientos,
                listaVehiculos,
                listaMarcas,
                actualizar,

                // Setters
                setActualizar,
                setListaMotoristas,
                setListaMovimientos,
                setListaVehiculos,

                // Funciones
                Lista,
                ActualizarLista,
            }}
        >
            {props.children}
        </UsuarioContext.Provider>
    );
};

export default UsuarioState;