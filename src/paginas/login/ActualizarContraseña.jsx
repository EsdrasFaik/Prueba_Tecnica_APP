import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mostraAlerta } from "../../componentes/alerts/sweetAlert";
import { AxiosPublico } from "../../componentes/axios/Axios";
import { UsuarioActualizarContrasena } from "../../configuracion/apiUrls";

const ActualizarContrasena = () => {
  const [correo, setCorreo] = useState("");
  const [pin, setPin] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verificarContrasena, setVerificarContrasena] = useState("");
  const [showPasswordNueva, setShowPasswordNueva] = useState(false);
  const [showPasswordVerificar, setShowPasswordVerificar] = useState(false);
  const [errorMatch, setErrorMatch] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errorMatch) { mostraAlerta("Las contraseñas no coinciden", "warning"); return; }
    try {
      if (correo.trim() === "" || pin.trim() === "" || contrasena.trim() === "") {
        mostraAlerta("Complete todos los campos", "warning");
        return;
      }
      const response = await AxiosPublico.put(UsuarioActualizarContrasena, {
        correo: correo.trim(),
        pin: pin.trim(),
        contrasena: contrasena.trim(),
      });
      mostraAlerta("Contraseña actualizada correctamente", "success");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data)) {
          error.response.data.forEach((f) => mostraAlerta("Campo: " + f.path + ". " + f.msg, "warning"));
        } else if (error.response.data.error) {
          mostraAlerta(error.response.data.error, "warning");
        } else {
          mostraAlerta("Error al actualizar la contraseña", "error");
        }
      } else {
        mostraAlerta("Error de red o servidor no disponible", "error");
      }
    }
  };

  const handlePasswordChange = (value) => {
    setContrasena(value);
    setErrorMatch(value !== verificarContrasena);
  };

  const handleVerifyPasswordChange = (value) => {
    setVerificarContrasena(value);
    setErrorMatch(value !== contrasena);
  };

  const inputStyle = {
    background: "#f8f9fa",
    borderRadius: "12px",
    padding: "5px",
    marginBottom: "16px"
  };

  return (
    <div className="hold-transition login-page" style={{
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className="login-box" style={{ width: "380px" }}>

        {/* Logo */}
        <div className="login-logo mb-4" style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/AppTest.png"
            alt="AppTest LOGO"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              border: "3px solid rgba(255,255,255,0.3)"
            }}
          />
        </div>

        {/* Card */}
        <div className="card shadow-lg" style={{
          borderRadius: "20px",
          border: "none",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)"
        }}>
          <div className="card-body p-4">
            <p className="text-center mb-4" style={{ fontWeight: "600", fontSize: "1.1rem", color: "#4a5568" }}>
              Actualizar Contraseña
            </p>
            <form onSubmit={handleSubmit}>

              {/* Correo */}
              <div className="input-group" style={inputStyle}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-envelope text-muted"></i>
                  </span>
                </div>
                <input
                  type="email"
                  className="form-control border-0 bg-transparent"
                  placeholder="Correo electrónico"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  autoComplete="email"
                  style={{ boxShadow: "none" }}
                />
              </div>

              {/* PIN */}
              <div className="input-group" style={inputStyle}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-key text-muted"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Introduce tu PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoComplete="one-time-code"
                  style={{ boxShadow: "none" }}
                />
              </div>

              {/* Nueva Contraseña */}
              <div className="input-group" style={inputStyle}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-lock text-muted"></i>
                  </span>
                </div>
                <input
                  type={showPasswordNueva ? "text" : "password"}
                  className="form-control border-0 bg-transparent"
                  placeholder="Nueva contraseña"
                  value={contrasena}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  autoComplete="new-password"
                  style={{ boxShadow: "none" }}
                />
                <div className="input-group-append">
                  <div className="input-group-text bg-transparent border-0"
                    onClick={() => setShowPasswordNueva(!showPasswordNueva)}
                    style={{ cursor: "pointer" }}>
                    <span className={showPasswordNueva ? "fas fa-eye-slash" : "fas fa-eye"}></span>
                  </div>
                </div>
              </div>

              {/* Verificar Contraseña */}
              <div className="input-group" style={inputStyle}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-lock text-muted"></i>
                  </span>
                </div>
                <input
                  type={showPasswordVerificar ? "text" : "password"}
                  className="form-control border-0 bg-transparent"
                  placeholder="Verificar contraseña"
                  value={verificarContrasena}
                  onChange={(e) => handleVerifyPasswordChange(e.target.value)}
                  autoComplete="new-password"
                  style={{ boxShadow: "none" }}
                />
                <div className="input-group-append">
                  <div className="input-group-text bg-transparent border-0"
                    onClick={() => setShowPasswordVerificar(!showPasswordVerificar)}
                    style={{ cursor: "pointer" }}>
                    <span className={showPasswordVerificar ? "fas fa-eye-slash" : "fas fa-eye"}></span>
                  </div>
                </div>
              </div>

              {errorMatch && (
                <small className="text-danger d-block mb-3">
                  Las contraseñas no coinciden
                </small>
              )}

              {/* Botón */}
              <button
                type="submit"
                className="btn btn-block shadow-sm"
                disabled={errorMatch}
                style={{
                  background: errorMatch
                    ? "#ccc"
                    : "linear-gradient(to right, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: "12px",
                  padding: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  border: "none"
                }}
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
        </div>

        {/* Volver */}
        <div className="text-center mt-4">
          <Link to="/login" style={{ color: "#fff", opacity: "0.9", fontSize: "0.9rem", textDecoration: "none" }}>
            ← Volver al inicio de sesión
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ActualizarContrasena;