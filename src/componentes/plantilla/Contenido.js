import React from 'react';
import Header from './Header';
import SideNav from './SideNav';
import Footer from './Footer';
import Home from './Home';
import TituloPagina from './TituloPagina';
const Contenido = (props) => {
    return (
        <div className="content-wrapper">
            {/* Content Header (Page header) */}
            <TituloPagina datos={props.datos}></TituloPagina>
            {/* /.content-header */}
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    {/* Small boxes (Stat box) */}
                    {props.children}
                </div>{/* /.container-fluid */}
            </section>
            {/* /.content */}
        </div>
    );
}

export default Contenido;