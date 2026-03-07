import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../componentes/contenedores/Card";
import Page from "../../componentes/plantilla/Page";
import CardVehiculo from "../../componentes/contenedores/CardVehiculo";
import {
    VehiculoListar,
    MarcasListar,
    ImagenMarcas,
} from "../../configuracion/apiUrls";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";

const HomeVehiculos = () => {
    const { token, ActualizarLista } = useContextUsuario();
    const navigate = useNavigate();

    const [listaVehiculos, setListaVehiculos] = useState([]);
    const [listaMarcas, setListaMarcas] = useState([]);
    const [filtroMarcaId, setFiltroMarcaId] = useState(null);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [panelFiltroAbierto, setPanelFiltroAbierto] = useState(false);

    const vehiculosRef = useRef(null);
    const marcasScrollRef = useRef(null);

    const pageDatos = {
        titulo: {
            titulo: "Vehículos",
            url: "/app/admin/vehiculos",
            tituloUrl: "vehículos",
            nombreUrl: "listado",
        },
    };

    useEffect(() => {
        ActualizarLista(VehiculoListar, setListaVehiculos);
        ActualizarLista(MarcasListar, setListaMarcas);
    }, []);

    const refrescar = () => ActualizarLista(VehiculoListar, setListaVehiculos);

    // Marcas activas que tienen al menos un vehículo
    const marcasConVehiculos = listaMarcas.filter(m =>
        m.estado === "Activo" &&
        listaVehiculos.some(v => v.marcaId === m.id)
    );

    // Filtrado principal
    const vehiculosFiltrados = listaVehiculos.filter(v => {
        const coincideEstado = mostrarInactivos ? v.estado === "Inactivo" : v.estado === "Activo";
        const coincideMarca = filtroMarcaId === null || v.marcaId === filtroMarcaId;
        const coincideBusqueda =
            busqueda === "" ||
            v.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
            v.modelo.toLowerCase().includes(busqueda.toLowerCase());
        return coincideEstado && coincideMarca && coincideBusqueda;
    });

    const aplicarFiltroMarca = (marcaId) => {
        setFiltroMarcaId(marcaId);
        if (vehiculosRef.current) {
            vehiculosRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <Page datos={pageDatos}>
            <style>{`
                /* ── Scroll de marcas ── */
                .hv-marcas-scroll {
                    display: flex;
                    flex-nowrap: nowrap;
                    overflow-x: auto;
                    gap: 1.2rem;
                    padding: 8px 4px 12px;
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }
                .hv-marcas-scroll::-webkit-scrollbar { display: none; }

                .hv-marca-item {
                    flex: 0 0 auto;
                    width: 80px;
                    text-align: center;
                    cursor: pointer;
                }
                .hv-marca-img-wrap {
                    width: 68px; height: 68px;
                    border-radius: 50%;
                    border: 3px solid transparent;
                    background: #fff;
                    padding: 4px;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto;
                    box-shadow: 0 3px 10px rgba(0,0,0,.08);
                    transition: border-color .2s, box-shadow .2s, transform .15s;
                    overflow: hidden;
                }
                .hv-marca-img-wrap:hover { transform: scale(1.08); }
                .hv-marca-img-wrap.activa {
                    border-color: #3b82f6;
                    box-shadow: 0 4px 14px rgba(59,130,246,.25);
                }
                .hv-marca-img-wrap img {
                    width: 100%; height: 100%; object-fit: contain;
                }
                .hv-marca-nombre {
                    font-size: .78rem;
                    font-weight: 500;
                    color: #374151;
                    margin-top: 5px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 80px;
                }
                .hv-marca-nombre.activa { font-weight: 700; color: #2563eb; }

                /* ── Toolbar ── */
                .hv-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 18px;
                }
                .hv-search {
                    flex: 1;
                    min-width: 160px;
                    position: relative;
                }
                .hv-search i {
                    position: absolute; left: 11px; top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8; font-size: .85rem; pointer-events: none;
                }
                .hv-search input {
                    width: 100%; padding: 0 14px 0 34px; height: 38px;
                    border: 1.5px solid #e2e8f0; border-radius: 9px;
                    font-size: .875rem; color: #374151; background: #fff;
                    outline: none; transition: border-color .2s, box-shadow .2s;
                }
                .hv-search input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
                }

                /* Toggle inactivos */
                .hv-toggle-wrap {
                    display: flex; align-items: center; gap: 7px;
                    white-space: nowrap; font-size: .82rem; color: #64748b;
                    font-weight: 600; user-select: none; cursor: pointer;
                }
                .hv-toggle-pill { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
                .hv-toggle-pill input { display: none; }
                .hv-toggle-track {
                    position: absolute; inset: 0; background: #cbd5e1;
                    border-radius: 99px; cursor: pointer; transition: background .2s;
                }
                .hv-toggle-pill input:checked + .hv-toggle-track { background: #64748b; }
                .hv-toggle-track::after {
                    content: ''; position: absolute; top: 3px; left: 3px;
                    width: 16px; height: 16px; background: #fff; border-radius: 50%;
                    transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
                }
                .hv-toggle-pill input:checked + .hv-toggle-track::after { transform: translateX(18px); }

                .hv-btn-nuevo {
                    height: 38px; padding: 0 16px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #fff; border: none; border-radius: 9px;
                    font-size: .85rem; font-weight: 600; white-space: nowrap;
                    cursor: pointer; display: flex; align-items: center; gap: 6px;
                    transition: opacity .2s;
                }
                .hv-btn-nuevo:hover { opacity: .88; }

                /* Count */
                .hv-count {
                    font-size: .75rem; color: #94a3b8; margin-bottom: 14px;
                }

                /* Empty */
                .hv-empty { text-align: center; padding: 60px 0; }
                .hv-empty i { font-size: 3rem; color: #e2e8f0; display: block; margin-bottom: 12px; }
                .hv-empty span { font-size: .9rem; color: #94a3b8; }
            `}</style>

            {/* ── Card de marcas (filtro por marca) ── */}
            <Card titulo="Filtrar por marca">
                <div ref={marcasScrollRef} className="hv-marcas-scroll">
                    {/* Opción "Todos" */}
                    <div className="hv-marca-item" onClick={() => aplicarFiltroMarca(null)}>
                        <div className={`hv-marca-img-wrap ${filtroMarcaId === null ? "activa" : ""}`}>
                            <img src="/categoriaDefault.jpg" alt="Todos" onError={e => { e.target.src = "/categoriaDefault.jpg"; }} />
                        </div>
                        <div className={`hv-marca-nombre ${filtroMarcaId === null ? "activa" : ""}`}>Todos</div>
                    </div>

                    {/* Una burbuja por cada marca con vehículos */}
                    {marcasConVehiculos.map(marca => (
                        <div
                            key={marca.id}
                            className="hv-marca-item"
                            onClick={() => aplicarFiltroMarca(marca.id)}
                        >
                            <div className={`hv-marca-img-wrap ${filtroMarcaId === marca.id ? "activa" : ""}`}>
                                <img
                                    src={ImagenMarcas + marca.imagen}
                                    alt={marca.nombre}
                                    onError={e => { e.target.src = ImagenMarcas + "marca_default.jpeg"; }}
                                />
                            </div>
                            <div className={`hv-marca-nombre ${filtroMarcaId === marca.id ? "activa" : ""}`}>
                                {marca.nombre}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* ── Card principal de vehículos ── */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">

                            {/* Toolbar */}
                            <div className="hv-toolbar">
                                {/* Buscador */}
                                <div className="hv-search">
                                    <i className="fas fa-search" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por placa o modelo..."
                                        value={busqueda}
                                        onChange={e => setBusqueda(e.target.value)}
                                    />
                                </div>

                                {/* Toggle inactivos */}
                                <label className="hv-toggle-wrap">
                                    <div className="hv-toggle-pill">
                                        <input
                                            type="checkbox"
                                            checked={mostrarInactivos}
                                            onChange={e => setMostrarInactivos(e.target.checked)}
                                        />
                                        <span className="hv-toggle-track" />
                                    </div>
                                    Inactivos
                                </label>

                                {/* Botón nuevo */}
                                <button
                                    className="hv-btn-nuevo"
                                    onClick={() => navigate("/app/vehiculos/nuevo")}
                                >
                                    <i className="fas fa-plus" /> Nuevo vehículo
                                </button>
                            </div>

                            {/* Contador */}
                            <div className="hv-count">
                                {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? "s" : ""}{" "}
                                {mostrarInactivos ? "inactivo(s)" : "activo(s)"}
                                {filtroMarcaId && ` · ${listaMarcas.find(m => m.id === filtroMarcaId)?.nombre}`}
                            </div>

                            {/* Grid de vehículos */}
                            <div ref={vehiculosRef} className="row g-3">
                                {vehiculosFiltrados.length === 0 ? (
                                    <div className="col-12">
                                        <div className="hv-empty">
                                            <i className="fas fa-car" />
                                            <span>
                                                No hay vehículos {mostrarInactivos ? "inactivos" : "activos"}
                                                {filtroMarcaId ? ` de esta marca` : ""}
                                            </span>
                                        </div>
                                    </div>
                                ) : (
                                    vehiculosFiltrados.map(vehiculo => (
                                        <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={vehiculo.id}>
                                            <CardVehiculo
                                                vehiculo={vehiculo}
                                                token={token}
                                                setListaVehiculos={setListaVehiculos}
                                                ActualizarLista={() => refrescar()}
                                                inactivo={vehiculo.estado === "Inactivo"}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default HomeVehiculos;