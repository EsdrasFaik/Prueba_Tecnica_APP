import React from "react";
import { Link } from "react-router-dom";

const NavItems = ({ isMenuExpanded, handleMenuToggle, items }) => {
  return items.map((f, i) => (
    <li key={i} className={`nav-item ${isMenuExpanded(i) ? "menu-open" : ""}`}>
      <Link
        to="#"
        className="nav-link"
        onClick={() => handleMenuToggle(i)}
      >
        <i className={"nav-icon " + f.icono} />
        <p>
          {f.nombre}
          <i className="fas fa-angle-left right" />
        </p>
      </Link>
      <ul className="nav nav-treeview">
        {f.urls.map((f2, i2) => (
          <li key={i2} className="nav-item">
            <Link to={f2.url} className="nav-link">
              <i className="far fa-circle nav-icon" />
              {f2.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  ));
};

export default NavItems;