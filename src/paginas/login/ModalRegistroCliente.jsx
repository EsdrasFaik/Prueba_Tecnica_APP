import { useEffect, useState } from "react";
import {
  mostraAlertaError,
  mostraAlertaOk,
  mostraAlertaWarning
} from "../../componentes/alerts/sweetAlert";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import ModalWizardBootstrap from "../../componentes/modal/ModalWizardBootstrap";
import { UsuariosGuardar } from "../../configuracion/apiUrls";
import {
  regexContrasena,
  regexEmail,
  regexNombre,
} from "../../configuracion/validaciones";

const ModalRegistroUsuario = ({ datos }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const [formulario, setFormulario] = useState({
    id: datos ? datos.id : null,
    nombre: datos ? datos.nombre : "",
    correo: datos ? datos.correo : "",
    contrasena: "",
    estado: "Activo",
  });

  // --- Errores ---
  const [errorNombre, setErrorNombre] = useState(false);
  const [errorCorreo, setErrorCorreo] = useState(false);
  const [errorContrasena, setErrorContrasena] = useState(false);
  const [errorConfirmarContrasena, setErrorConfirmarContrasena] = useState(false);

  // --- Validaciones reactivas ---
  useEffect(() => {
    setErrorNombre(!regexNombre.test(formulario.nombre));
    setErrorCorreo(!regexEmail.test(formulario.correo));
    setErrorContrasena(!regexContrasena.test(formulario.contrasena));
    setErrorConfirmarContrasena(formulario.contrasena !== passwordConfirm);
  }, [formulario, passwordConfirm]);

  // --- Resetear al abrir ---
  useEffect(() => {
    if (modalIsOpen) {
      setFormulario({
        id: datos ? datos.id : null,
        nombre: datos ? datos.nombre : "",
        correo: datos ? datos.correo : "",
        contrasena: "",
        estado: "Activo",
      });
      setPasswordConfirm("");
    }
  }, [modalIsOpen]);

  const manejador = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  const limpiarDatos = () => {
    setFormulario({ id: null, nombre: "", correo: "", contrasena: "", estado: "Activo" });
    setPasswordConfirm("");
    setErrorNombre(false);
    setErrorCorreo(false);
    setErrorContrasena(false);
    setErrorConfirmarContrasena(false);
  };

  const guardarUsuario = () => {
    if (errorNombre || errorCorreo || errorContrasena || errorConfirmarContrasena) {
      mostraAlertaWarning("Existen errores en la introducción de campos");
      return;
    }

    try {
      AxiosPrivado.post(UsuariosGuardar, formulario)
        .then(() => {
          mostraAlertaOk("Usuario registrado correctamente");
          limpiarDatos();
          setModalIsOpen(false);
        })
        .catch((er) => {
          let msjError = "";
          switch (er.response?.status) {
            case 400:
              if (Array.isArray(er.response.data)) {
                er.response.data.forEach((f) => { msjError += f.msg + ". "; });
              } else {
                msjError = er.response.data.error;
              }
              break;
            case 500:
              msjError = er.response.data.error;
              break;
            default:
              msjError = "Ocurrió un error desconocido.";
          }
          mostraAlertaError(msjError);
        });
    } catch (error) {
      mostraAlertaError("Error en la petición");
    }
  };

  return (
    <ModalWizardBootstrap
      titulo="Registro de Usuario"
      nombreBoton="Registrarse"
      estiloBoton="link-class"
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      iconos={["fas fa-user", "fas fa-lock"]}
      linkStyle={true}
      onFinish={guardarUsuario}
      size="lg"
      pasos={[
        {
          etiqueta: "Datos Personales",
          contenido: (
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Nombre de Usuario</label>
                  <input
                    type="text"
                    className={`form-control ${errorNombre ? "is-invalid" : ""}`}
                    placeholder="Ingrese su nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={manejador}
                  />
                  {errorNombre && (
                    <div className="invalid-feedback">
                      El nombre debe tener al menos 3 caracteres.
                    </div>
                  )}
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Correo Electrónico</label>
                  <input
                    type="text"
                    className={`form-control ${errorCorreo ? "is-invalid" : ""}`}
                    placeholder="Ingrese su correo"
                    name="correo"
                    value={formulario.correo}
                    onChange={manejador}
                  />
                  {errorCorreo && (
                    <div className="invalid-feedback">
                      Correo electrónico inválido.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ),
        },
        {
          etiqueta: "Contraseña",
          contenido: (
            <div className="row">
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className={`form-control ${errorContrasena ? "is-invalid" : ""}`}
                      placeholder="Contraseña"
                      name="contrasena"
                      value={formulario.contrasena}
                      onChange={manejador}
                    />
                    <div className="input-group-append">
                      <div
                        className="input-group-text"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} />
                      </div>
                    </div>
                    {errorContrasena && (
                      <div className="invalid-feedback">
                        Debe tener mayúscula, minúscula, número, símbolo y entre 6-12 caracteres.
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="form-group">
                  <label>Confirmar Contraseña</label>
                  <div className="input-group">
                    <input
                      type={showPasswordConfirm ? "text" : "password"}
                      className={`form-control ${errorConfirmarContrasena ? "is-invalid" : ""}`}
                      placeholder="Confirmar Contraseña"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                    <div className="input-group-append">
                      <div
                        className="input-group-text"
                        onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className={showPasswordConfirm ? "fas fa-eye-slash" : "fas fa-eye"} />
                      </div>
                    </div>
                    {errorConfirmarContrasena && (
                      <div className="invalid-feedback">
                        Las contraseñas no coinciden.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ]}
    />
  );
};

export default ModalRegistroUsuario;