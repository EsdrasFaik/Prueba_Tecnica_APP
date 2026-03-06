import React from 'react';
import Header from './Header'
import SideNav from './SideNav';
import Footer from './Footer'
import Home from './Home'

function PageHome() {
    return (
        <React.StrictMode>
            <div className="wrapper">
                <Header></Header>
                <SideNav></SideNav>
                <Home/>
                <Footer/>
            </div>
        </React.StrictMode>
    );
}

export default PageHome;
