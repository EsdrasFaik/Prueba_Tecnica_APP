import React from 'react';
import { Link } from 'react-router-dom'

const TituloPagina = (props) => {
    return (
        <section className="content-header">
            <div className="container-fluid">
                <div className="row mb-2">
                    <div className="col-sm-6">
                        <h1 className="m-0">{props.datos.titulo}</h1>
                    </div>{/* /.col */}
                    <div className="col-sm-6">
                        <ol className="breadcrumb float-sm-right">
                            <li className="breadcrumb-item"> <Link to={props.datos.url}>{props.datos.tituloUrl}</Link></li>
                            <li className="breadcrumb-item active">{props.datos.nombreUrl}</li>
                        </ol>
                    </div>{/* /.col */}
                </div>{/* /.row */}
            </div>{/* /.container-fluid */}
        </section>
    );
}
export default TituloPagina;