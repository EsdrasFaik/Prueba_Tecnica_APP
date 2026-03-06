import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModoOscuro from "./ModoOscuro";

const Header = () => {
  const navigate = useNavigate();

  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light bg-transparent">
      <ul className="navbar-nav">
        <li className="nav-item">
          <button className="nav-link btn btn-link" data-widget="pushmenu" role="button">
            <i className="fas fa-bars"></i>
          </button>
        </li>
      </ul>
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <button className="nav-link btn btn-link" data-widget="fullscreen" role="button">
            <i className="fas fa-expand-arrows-alt"></i>
          </button>
        </li>
        <ModoOscuro />
      </ul>
    </nav>
  );
};

export default Header;