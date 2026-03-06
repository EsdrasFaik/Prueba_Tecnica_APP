import React from "react";
import { Link } from "react-router-dom";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";

const CerrarSesionButton = () => {
    const { setCerrarSesion } = useContextUsuario();

    const handleCerrarSesion = () => {
        setCerrarSesion();
    };

    return (
        <div className="d-flex justify-content-center mt-3 mb-3 mx-2">
            <Link
                to="/login"
                className="btn btn-danger btn-sm d-flex align-items-center justify-content-center shadow fw-bold text-white p-2"
                onClick={handleCerrarSesion}
                style={{ width: "40px", height: "40px", borderRadius: "50%" }} // Botón redondo
            >
                <i className="fas fa-sign-out-alt fa-lg"></i>
            </Link>
        </div>
    );
};

export default CerrarSesionButton;
