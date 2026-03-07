import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { mostraAlerta } from "../../componentes/alerts/sweetAlert";
import { AxiosPublico } from "../../componentes/axios/Axios";
import { UsuarioIniciarSesion } from "../../configuracion/apiUrls";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import ModalRegistroUsuario from "./ModalRegistroCliente";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setLogin } = useContextUsuario();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      mostraAlerta("Complete los campos", "warning");
      return;
    }

    try {
      const response = await AxiosPublico.post(UsuarioIniciarSesion, {
        login: username,
        contrasena: password,
      });

      const { data } = response;

      if (!data.Usuario || !data.Token) {
        mostraAlerta("Credenciales inválidas", "warning");
        return;
      }

      const { Usuario: usuario, Token: token } = data;

      mostraAlerta(`Bienvenido(a) ${usuario.nombre}`, "success");
      await setLogin({ usuario, token });
      navigate("/app/vehiculos/listado");

    } catch (error) {
      console.error("Error completo:", error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400 && Array.isArray(data)) {
          data.forEach((err) => mostraAlerta(err.msg, "warning"));
        } else if (data && data.error) {
          mostraAlerta(data.error, "warning");
        } else {
          mostraAlerta("Error del servidor. Por favor, inténtalo de nuevo más tarde.", "warning");
        }
      } else if (error.request) {
        mostraAlerta("Error de conexión. Verifica tu conexión a internet.", "warning");
      } else {
        mostraAlerta("Error inesperado. Por favor, inténtalo de nuevo.", "warning");
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
        <div className="login-logo mb-4" style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/AppTest.png"
            alt="APPTest LOGO"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              border: "3px solid rgba(255,255,255,0.3)"
            }}
          />
        </div>

        <div className="card shadow-lg" style={{ 
          borderRadius: "20px", 
          border: "none", 
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)"
        }}>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="input-group mb-4" style={{ background: "#f8f9fa", borderRadius: "12px", padding: "5px" }}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-user text-muted"></i>
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  style={{ boxShadow: "none" }}
                />
              </div>

              <div className="input-group mb-4" style={{ background: "#f8f9fa", borderRadius: "12px", padding: "5px" }}>
                <div className="input-group-prepend">
                  <span className="input-group-text bg-transparent border-0">
                    <i className="fas fa-lock text-muted"></i>
                  </span>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control border-0 bg-transparent"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ boxShadow: "none" }}
                />
                <div className="input-group-append">
                  <div
                    className="input-group-text bg-transparent border-0"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ cursor: "pointer" }}
                  >
                    <span className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></span>
                  </div>
                </div>
              </div>

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
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link to="/recuperar-pin" style={{ color: "#fff", opacity: "0.9", fontSize: "0.9rem", textDecoration: "none" }}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        <div className="text-center mt-2" style={{ color: "#fff" }}>
          <ModalRegistroUsuario />
        </div>
      </div>
    </div>
  );
};

export default Login;