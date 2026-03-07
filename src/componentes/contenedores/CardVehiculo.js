import React from "react";
import { useNavigate } from "react-router-dom";
import CarouselV2 from "../../componentes/carousel/CarouselV2";
import EliminarVehiculo from "../../paginas/vehiculos/EliminarVehiculo";
import { ImagenVehiculos } from "../../configuracion/apiUrls";

const CardVehiculo = ({ vehiculo, token, setListaVehiculos, ActualizarLista, inactivo = false }) => {
    const navigate = useNavigate();

    const imagenes = vehiculo.ImagenVehiculos?.length > 0
        ? vehiculo.ImagenVehiculos.map(img => ImagenVehiculos + img.imagen)
        : ["/vehiculos.jpg"];

    const handleEditar = () => {
        navigate(`/app/vehiculos/editar?id=${vehiculo.id}`);
    };

    return (
        <>
            <style>{`
                .cv-card {
                    border-radius: 14px;
                    border: 1.5px solid #e2e8f0;
                    background: #fff;
                    overflow: hidden;
                    transition: box-shadow .2s, transform .15s;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                .cv-card:not(.inactivo):hover {
                    box-shadow: 0 8px 28px rgba(0,0,0,.1);
                    transform: translateY(-2px);
                }
                .cv-card.inactivo {
                    opacity: .7;
                    filter: grayscale(30%);
                }
                .cv-img-wrap {
                    position: relative;
                    height: 200px;
                    background: #f8fafc;
                    overflow: hidden;
                    flex-shrink: 0;
                }
                .cv-img-wrap .carousel,
                .cv-img-wrap .carousel-inner,
                .cv-img-wrap .carousel-item {
                    height: 100%;
                }
                .cv-img-wrap .carousel-item img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .cv-badge-estado {
                    position: absolute;
                    top: 10px; left: 10px;
                    z-index: 5;
                    font-size: .65rem;
                    font-weight: 700;
                    padding: 3px 10px;
                    border-radius: 99px;
                    letter-spacing: .04em;
                    box-shadow: 0 2px 6px rgba(0,0,0,.15);
                }
                .cv-body {
                    padding: 14px 16px 16px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                }
                .cv-placa {
                    font-size: .72rem;
                    font-weight: 700;
                    letter-spacing: .08em;
                    text-transform: uppercase;
                    color: #64748b;
                    margin-bottom: 2px;
                }
                .cv-modelo {
                    font-size: 1rem;
                    font-weight: 700;
                    color: #1e293b;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-bottom: 2px;
                }
                .cv-meta {
                    font-size: .8rem;
                    color: #94a3b8;
                    margin-bottom: 0;
                }
                .cv-marca {
                    font-size: .78rem;
                    color: #64748b;
                    font-weight: 600;
                    margin-top: 2px;
                }
                .cv-actions {
                    display: flex;
                    gap: 6px;
                    margin-top: 14px;
                    padding-top: 12px;
                    border-top: 1px solid #f1f5f9;
                }
                .cv-btn-editar {
                    flex: 1;
                    background: #fef3c7;
                    color: #b45309;
                    border: 1px solid #fde68a;
                    border-radius: 8px;
                    font-size: .8rem;
                    font-weight: 600;
                    padding: 7px 0;
                    cursor: pointer;
                    transition: background .15s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 5px;
                }
                .cv-btn-editar:hover { background: #fde68a; }

                /* Ajuste del botón eliminar del componente externo */
                .cv-actions .btn-danger {
                    border-radius: 8px;
                    font-size: .8rem;
                    padding: 7px 12px;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                }
            `}</style>

            <div className={`cv-card${inactivo ? " inactivo" : ""}`}>
                {/* Imagen / Carrusel */}
                <div className="cv-img-wrap">
                    <span className={`cv-badge-estado badge ${vehiculo.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                        {vehiculo.estado}
                    </span>
                    <CarouselV2
                        id={`carouselVehiculo${vehiculo.id}`}
                        datos={imagenes.map(url => ({ url, nombre: vehiculo.modelo }))}
                    />
                </div>

                {/* Info */}
                <div className="cv-body">
                    <div className="cv-placa">{vehiculo.placa}</div>
                    <div className="cv-modelo" title={vehiculo.modelo}>{vehiculo.modelo}</div>
                    <div className="cv-meta">Año {vehiculo.anio}</div>
                    {vehiculo.MarcaVehiculo?.nombre && (
                        <div className="cv-marca">
                            <i className="fas fa-tag mx-1" />
                            {vehiculo.MarcaVehiculo.nombre}
                        </div>
                    )}

                    {/* Editar siempre disponible — Eliminar solo si activo */}
                    <div className="cv-actions">
                        <button className="cv-btn-editar" onClick={handleEditar}>
                            <i className="fas fa-edit" /> Editar
                        </button>
                        {!inactivo && (
                            <EliminarVehiculo
                                datos={vehiculo}
                                token={token}
                                setListaVehiculos={setListaVehiculos}
                                ActualizarLista={ActualizarLista}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CardVehiculo;