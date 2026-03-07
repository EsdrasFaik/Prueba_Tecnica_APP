import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import CerrarSesionButton from "../contenedores/CerrarSesion";
import NavItems from "./NavItems";
import RelojDigital from "./RelojDigital";

const navItems = [
  {
    nombre: "Vehículos",
    icono: "fas fa-car",
    url: "/app/vehiculos",
    urls: [
   
      { url: "/app/vehiculos/listado", nombre: "Listado" },
    ],
  },
  {
    nombre: "Movimientos",
    icono: "fas fa-exchange-alt",
    url: "/app/movimientos",
    urls: [
      { url: "/app/movimientos/editar", nombre: "Editar" },
    ],
  },
];

const SideNav = () => {
  const { usuario } = useContextUsuario();
  const [expandedItems, setExpandedItems] = useState([]);

  const nombreUsuario = usuario?.nombre ?? "Usuario";

  const handleMenuToggle = (index) => {
    setExpandedItems((prev) =>
      prev.includes(index) ? prev.filter((item) => item !== index) : [...prev, index]
    );
  };

  const isMenuExpanded = (index) => expandedItems.includes(index);

  return (
    <aside className="main-sidebar main-sidebar-custom sidebar-dark-warning elevation-4"
      style={{ backgroundColor: "#8a2b9e" }}
    >
      <Link to="/app/vehiculos/editar" className="brand-link d-flex align-items-center">
        <img
          src="/APPTEST.png"
          alt="Logo"
          className="brand-image img-circle elevation-3"
          style={{ opacity: ".8", width: "35px", height: "35px" }}
        />
        <span className="brand-text font-weight-semibold h2 mx-2">APPTEST</span>
      </Link>

      <div className="sidebar">
        {/* Perfil sin imagen */}
        <div className="user-panel mt-3 pb-3 mb-3 d-flex align-items-center">
          <div className="image">
            <i className="fas fa-user-circle fa-2x" style={{ color: "#fff" }}></i>
          </div>
          <div className="info ml-2">
            <span className="d-block" style={{ color: "#fff" }}>
              {nombreUsuario}
            </span>
          </div>
        </div>

        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column nav-legacy nav-child-indent"
            data-widget="treeview" role="menu" data-accordion="false">
            <li className="nav-header">Menu Principal</li>
            
            <NavItems
              items={navItems}
              handleMenuToggle={handleMenuToggle}
              isMenuExpanded={isMenuExpanded}
            />
            <li className="nav-item">
              <RelojDigital />
            </li>
          </ul>
        </nav>
      </div>

      <div className="sidebar-custom d-flex justify-content-between align-items-center">
        <CerrarSesionButton />
      </div>
    </aside>
  );
};

export default SideNav;