import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mostraAlerta } from "../../componentes/alerts/sweetAlert";
import { AxiosPublico } from "../../componentes/axios/Axios";
import { UsuarioEnviarPin } from "../../configuracion/apiUrls";

const EnviarPin = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (email.trim() === "") {
        mostraAlerta("Complete los campos", "warning");
        return;
      }
      const response = await AxiosPublico.post(UsuarioEnviarPin, {
        correo: email.trim(),
      });
      if (response.data && response.data.correo) {
        mostraAlerta("Se ha enviado un pin a su correo " + response.data.correo, "success");
        setTimeout(() => navigate("/actualizar-contrasena", { state: { correo: response.data.correo } }), 2000);
      } else {
        mostraAlerta("Se ha enviado un pin a su correo", "success");
        setTimeout(() => navigate("/actualizar-contrasena", { state: { correo: email.trim() } }), 2000);
      }
    } catch (error) {
      if (error.response) {
        if (Array.isArray(error.response.data)) {
          error.response.data.forEach((f) => mostraAlerta("Campo: " + f.path + ". " + f.msg, "warning"));
        } else if (error.response.data.error) {
          mostraAlerta(error.response.data.error, "warning");
        } else {
          mostraAlerta("Error al enviar el PIN", "error");
        }
      } else {
        mostraAlerta("Error de red o servidor no disponible", "error");
      }
    }
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
              Recuperar contraseña
            </p>
            <form onSubmit={handleSubmit}>

              {/* Campo correo */}
              <div className="input-group mb-4" style={{ background: "#f8f9fa", borderRadius: "12px", padding: "5px" }}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-envelope text-muted"></i>
                  </span>
                </div>
                <input
                  type="email"
                  className="form-control border-0 bg-transparent"
                  placeholder="Correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  style={{ boxShadow: "none" }}
                />
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="btn btn-block shadow-sm"
                style={{
                  background: "linear-gradient(to right, #667eea, #764ba2)",
                  color: "white",
                  borderRadius: "12px",
                  padding: "12px",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  border: "none"
                }}
              >
                Enviar PIN
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

export default EnviarPin;