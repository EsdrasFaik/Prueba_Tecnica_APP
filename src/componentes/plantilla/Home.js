import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Pantalla Principal</h1>
            </div>{/* /.col */}
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"> <Link to="/app/home">Inicio</Link></li>
                <li className="breadcrumb-item active">Pantalla Principal</li>
              </ol>
            </div>{/* /.col */}
          </div>{/* /.row */}
        </div>{/* /.container-fluid */}
      </section>
      {/* /.content-header */}
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
          {/* Small boxes (Stat box) */}
          <div className="row">
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>150</h3>
                  <p>Contratos</p>
                </div>
                <div className="icon">
                  <i className="ion ion-bag" />
                </div>
                <Link to="/app/contratos" className="small-box-footer">Mas informacion <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>53</h3>
                  <p>Clientes</p>
                </div>
                <div className="icon">
                  <i className="ion ion-stats-bars" />
                </div>
                <Link to="/app/clientes" className="small-box-footer">Mas informacion <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>44</h3>
                  <p>Lotes disponibles</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <Link to="/app/inmobiliario/lotes" className="small-box-footer">Mas informacion <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
            <div className="col-lg-3 col-6">
              {/* small box */}
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>0</h3>
                  <p>Lotes en mora</p>
                </div>
                <div className="icon">
                  <i className="ion ion-pie-graph" />
                </div>
                <Link to="/app/inmobiliario/lotes" className="small-box-footer">Mas informacion <i className="fas fa-arrow-circle-right" /></Link>
              </div>
            </div>
            {/* ./col */}
          </div>
        </div>{/* /.container-fluid */}
      </section>
      {/* /.content */}
    </div>
  )
}

export default Home