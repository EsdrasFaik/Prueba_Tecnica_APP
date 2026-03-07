import React from 'react';
import Header from './Header'
import SideNav from './SideNav';
import Footer from './Footer';
import Home from './Home';
import Contenido from './Contenido';

const Page = (props) => {
    return (
        <React.StrictMode>
            <Header></Header>
            <SideNav></SideNav>
            <Contenido datos={props.datos.titulo}>
                {props.children}
            </Contenido>
            <Footer />
        </React.StrictMode>
    );
}

export default Page;