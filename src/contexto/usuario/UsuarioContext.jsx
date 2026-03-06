import { createContext, useContext } from "react";
export const UsuarioContext = createContext();

export const useContextUsuario=()=>{
    return useContext(UsuarioContext);
}