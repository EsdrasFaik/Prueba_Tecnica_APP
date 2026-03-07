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
            <h5 className="fw-bold text-white">APP TEST</h5>
            <p className="text-white">
             APP DE PRUEBA
            </p>
          </div>

          {/* Datos de Contacto */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold text-white">Contacto</h6>
            <ul className="list-unstyled">
              <li className="mb-2 d-flex align-items-center">
                <FaPhone className="me-2 mx-2 text-white" />
                <a href="tel:+504-99524695" className="text-decoration-none text-white">
                  9952-4695
                </a>
              </li>
              <li className="d-flex align-items-center">
                <FaClock className="me-2 mx-2 text-white" />
                <span className="text-white">Lorem Ipsum</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Derechos Reservados */}
        <div className="text-center mt-3">
          <p className="text-white mb-0">
            &copy; APP TEST.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
