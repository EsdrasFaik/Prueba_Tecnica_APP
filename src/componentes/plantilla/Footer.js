import React from "react";
import { FaPhone, FaMapMarkerAlt, FaClock, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import FooterNavItems from "./FooterNavItems";

const Footer = () => {
  const { usuario } = useContextUsuario();

  const navItemsEmpleados = [
    { url: "/app/admin/empleados/nuevo", nombre: "Empleados" },
    { url: "/app/admin/clientes/nuevo", nombre: "Clientes" },
    { url: "/app/admin/productos/nuevo", nombre: "Productos" },
    { url: "/app/admin/pedidos/nuevo", nombre: "Pedidos" },
  ];

  const navItemsClientes = [
    { url: "/app/clientes/pedidos/nuevo", nombre: "Pedidos" },
  ];

  return (
    <footer className="main-footer sidebar-dark-primary text-white py-4">
      <div className="container">
        <div className="row">
          {/* Información Principal */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold text-white">DESOFIW</h5>
            <p className="text-white">
              Sistema de Gestión de Ventas y Servicios
            </p>
          </div>

          {/* Navegación según usuario */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold text-white">Navegación</h6>
            <FooterNavItems items={usuario.tipo === "Empleado" ? navItemsEmpleados : navItemsClientes} />
          </div>

          {/* Datos de Contacto */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold text-white">Contacto</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 mx-2 text-white" />
                <a href="tel:+504-9996-9172" className="text-decoration-none text-white">
                  9996-9172
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 mx-2 text-white" />
                <a href="tel:+504-3341-7291" className="text-decoration-none text-white">
                  3341-7291
                </a>
              </li>
              <li className="mb-2 d-flex align-items-center">
                <FaMapMarkerAlt className="me-2 mx-2 text-white" />
                <a
                  href="https://maps.app.goo.gl/vxoCh9EfqnpXY1wt8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-decoration-none text-white"
                >
                  Calle Real a unos pasos de Paseo Alameda
                </a>
              </li>
              <li className="d-flex align-items-center">
                <FaClock className="me-2 mx-2 text-white" />
                <span className="text-white">Lunes a Domingo de 10:00 am a 7:00 pm</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Redes Sociales */}
        <div className="text-center mt-4">
          <a href="https://www.facebook.com/profile.php?id=61557356612581" className="text-white" target="_blank" rel="noopener noreferrer">
            <FaFacebookF size={27} />
          </a>
          <a href="https://wa.me/50499969172" className="text-white mx-2" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp size={27} />
          </a>
        </div>

        {/* Derechos Reservados */}
        <div className="text-center mt-3">
          <p className="text-white mb-0">
            &copy; 2024 DESOFIW. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
