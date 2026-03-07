import React from "react";

const CarouselV2 = ({ id, datos }) => {
    return (
        <div style={{ width: "100%", position: "relative" }}>
            {/* 
                carousel-fade => Agrega transiciones de desvanecimiento entre diapositivas
                data-ride="carousel" => Activa la rotación automática
                data-interval="3000" => Cambia de imagen cada 3 segundos
                data-pause="hover" => Pausa la rotación cuando el usuario pasa el cursor
            */}
            <div
                id={id}
                className="carousel slide carousel-fade"
                data-ride="carousel"
                data-interval="3000"
                data-pause="hover"
            >
                {/* Indicadores */}
                <ol className="carousel-indicators">
                    {datos.map((_, index) => (
                        <li
                            key={index}
                            data-target={`#${id}`}
                            data-slide-to={index}
                            className={index === 0 ? "active" : ""}
                        />
                    ))}
                </ol>

                {/* Imágenes principales */}
                <div className="carousel-inner">
                    {datos.map((item, index) => (
                        <div
                            key={index}
                            className={`carousel-item ${index === 0 ? "active" : ""}`}
                        >
                            <img
                                src={item.url}
                                alt={item.nombre}
                                className="d-block w-100"
                                style={{
                                    maxHeight: "250px",
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Flecha anterior */}
                <a
                    className="carousel-control-prev"
                    href={`#${id}`}
                    role="button"
                    data-slide="prev"
                    style={{
                        left: "10px",
                        width: "auto",
                    }}
                >
                    <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                        style={{
                            filter: "brightness(0.5)",
                            backgroundColor: "rgba(128, 128, 128, 0.5)",
                            borderRadius: "50%",
                            padding: "15px",
                        }}
                    ></span>
                    <span className="sr-only">Anterior</span>
                </a>

                {/* Flecha siguiente */}
                <a
                    className="carousel-control-next"
                    href={`#${id}`}
                    role="button"
                    data-slide="next"
                    style={{
                        right: "10px",
                        width: "auto",
                    }}
                >
                    <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                        style={{
                            filter: "brightness(0.5)",
                            backgroundColor: "rgba(128, 128, 128, 0.5)",
                            borderRadius: "50%",
                            padding: "15px",
                        }}
                    ></span>
                    <span className="sr-only">Siguiente</span>
                </a>
            </div>

            {/* Miniaturas en una sola línea con desplazamiento horizontal */}
            <div
                className="d-flex flex-nowrap mt-2 justify-content-center"
                style={{ overflowX: "auto" }}
            >
                {datos.map((item, index) => (
                    <div key={index} className="p-1">
                        <img
                    src={item.url}
                    alt={item.nombre}
                    className="img-thumbnail"
                    style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        cursor: "pointer",
                    }}
                    data-target={`#${id}`}
                    data-slide-to={index}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CarouselV2;
