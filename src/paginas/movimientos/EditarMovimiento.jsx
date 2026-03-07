import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    mostraAlertaError,
    mostraAlertaOk,
} from "../../componentes/alerts/sweetAlert";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import Card from "../../componentes/contenedores/Card";
import Page from "../../componentes/plantilla/Page";
import {
    MovimientosBuscar,
    MovimientosEditar,
    ImagenMotoristas,
    ImagenVehiculos,
    ImagenMarcas,
} from "../../configuracion/apiUrls";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

const EditarMovimiento = () => {
    const { token } = useContextUsuario();
    const navigate = useNavigate();
    const location = useLocation();
    const movimientoId = new URLSearchParams(location.search).get("id");

    const [cargando, setCargando] = useState(true);
    const [estado, setEstado] = useState("Activo");
    const [movimiento, setMovimiento] = useState(null);

    const pageDatos = {
        titulo: {
            titulo: "Editar movimiento",
            url: "/app/admin/movimientos",
            tituloUrl: "movimientos",
            nombreUrl: "editar",
        },
    };

    useEffect(() => {
        if (!token) return;
        cargarMovimiento();
    }, [token]);

    const cargarMovimiento = async () => {
        if (!movimientoId) {
            mostraAlertaError("No se especificó un movimiento a editar.");
            setCargando(false);
            return;
        }
        try {
            AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const { data } = await AxiosPrivado.get(MovimientosBuscar + movimientoId);
            setMovimiento(data);
            setEstado(data.estado || "Activo");
        } catch (error) {
            mostraAlertaError(error.response?.data?.error || "Error al cargar el movimiento.");
        } finally {
            setCargando(false);
        }
    };

    const actualizarMovimiento = async () => {
        try {
            AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await AxiosPrivado.put(MovimientosEditar + movimientoId, { estado });
            mostraAlertaOk("Movimiento actualizado correctamente.");
            navigate("/app/admin/movimientos");
        } catch (error) {
            const msg = error.response?.data?.error || "Error al actualizar el movimiento.";
            mostraAlertaError(msg, "Error");
        }
    };

    const BotonesAccion = () => (
        <>
            <button type="button" className="btn btn-warning mr-2" onClick={actualizarMovimiento}>
                <i className="fas fa-pen mx-1" /> Actualizar
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/app/admin/movimientos")}>
                <i className="fas fa-times mx-1" /> Cancelar
            </button>
        </>
    );

    if (cargando) {
        return (
            <Page datos={pageDatos}>
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 200 }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Cargando...</span>
                    </div>
                </div>
            </Page>
        );
    }

    if (!movimiento) return null;

    const vehiculo   = movimiento.Vehiculo;
    const motorista  = movimiento.Motorista;
    const primeraImg = vehiculo?.ImagenVehiculos?.[0]?.imagen;
    const imgMarca   = vehiculo?.MarcaVehiculo?.imagen;
    const nombreMarca = vehiculo?.MarcaVehiculo?.nombre;

    return (
        <Page datos={pageDatos}>
            <style>{`
                .em-field-label {
                    font-size: .72rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: .06em; color: #64748b; margin-bottom: 4px;
                }
                .em-field-value {
                    font-size: .9rem; color: #1e293b; font-weight: 500;
                    padding: 8px 12px; background: #f8fafc;
                    border: 1.5px solid #e2e8f0; border-radius: 8px;
                }
                .em-badge-tipo {
                    display: inline-flex; align-items: center; gap: 6px;
                    padding: 4px 14px; border-radius: 99px;
                    font-size: .8rem; font-weight: 700; letter-spacing: .04em;
                }
                .em-badge-entrada { background: #dcfce7; color: #166534; }
                .em-badge-salida  { background: #fee2e2; color: #991b1b; }

                .em-preview-card {
                    display: flex; align-items: center; gap: 14px;
                    padding: 14px 16px; border-radius: 12px;
                    border: 1.5px solid #e2e8f0; background: #f8fafc;
                }
                .em-preview-img-vehiculo {
                    width: 80px; height: 60px; border-radius: 10px;
                    overflow: hidden; flex-shrink: 0; background: #e2e8f0;
                }
                .em-preview-img-vehiculo img { width: 100%; height: 100%; object-fit: cover; }
                .em-preview-img-motorista {
                    width: 56px; height: 56px; border-radius: 50%;
                    overflow: hidden; flex-shrink: 0; background: #e2e8f0;
                    border: 2px solid #cbd5e1;
                }
                .em-preview-img-motorista img { width: 100%; height: 100%; object-fit: cover; }
                .em-preview-info { flex: 1; min-width: 0; }
                .em-preview-title { font-weight: 800; font-size: .95rem; color: #1e293b; }
                .em-preview-sub   { font-size: .78rem; color: #64748b; }
                .em-chip-marca {
                    display: inline-flex; align-items: center; gap: 5px;
                    font-size: .68rem; font-weight: 600; color: #475569;
                    background: #e2e8f0; border-radius: 99px;
                    padding: 2px 8px; margin-top: 4px;
                }
                .em-chip-marca img { width: 14px; height: 14px; object-fit: contain; }

                .em-estado-row {
                    display: flex; align-items: center; gap: 12px;
                    padding: 12px 14px; background: #f8fafc;
                    border: 1.5px solid #e2e8f0; border-radius: 10px;
                }
                .em-toggle { position: relative; width: 46px; height: 24px; flex-shrink: 0; }
                .em-toggle input { display: none; }
                .em-toggle-track {
                    position: absolute; inset: 0; background: #cbd5e1;
                    border-radius: 99px; cursor: pointer; transition: background .2s;
                }
                .em-toggle input:checked + .em-toggle-track { background: #22c55e; }
                .em-toggle-track::after {
                    content: ''; position: absolute; top: 3px; left: 3px;
                    width: 18px; height: 18px; background: #fff; border-radius: 50%;
                    transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
                }
                .em-toggle input:checked + .em-toggle-track::after { transform: translateX(22px); }
            `}</style>

            <div className="row">
                <div className="col-12">
                    <Card titulo="Datos del movimiento" pie={<BotonesAccion />}>

                        {/* ── Tipo y Fecha ── */}
                        <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                                <div className="em-field-label">Tipo de movimiento</div>
                                <div>
                                    <span className={`em-badge-tipo ${movimiento.tipo === "Entrada" ? "em-badge-entrada" : "em-badge-salida"}`}>
                                        <i className={`fas ${movimiento.tipo === "Entrada" ? "fa-arrow-down" : "fa-arrow-up"}`} />
                                        {movimiento.tipo}
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-6 col-sm-12">
                                <div className="em-field-label">Fecha y hora</div>
                                <div className="em-field-value">
                                    <i className="fas fa-clock me-2 text-muted" />
                                    {moment(movimiento.fecha_hora).format("LL [a las] HH:mm")}
                                </div>
                            </div>
                        </div>

                        {/* ── Kilometraje ── */}
                        <div className="row mb-3">
                            <div className="col-md-6 col-sm-12">
                                <div className="em-field-label">Kilometraje</div>
                                <div className="em-field-value">
                                    <i className="fas fa-tachometer-alt me-2 text-muted" />
                                    {movimiento.kilometraje?.toLocaleString()} km
                                </div>
                            </div>
                        </div>

                        {/* ── Observaciones ── */}
                        {movimiento.observaciones && (
                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="em-field-label">Observaciones</div>
                                    <div className="em-field-value" style={{ whiteSpace: "pre-wrap" }}>
                                        {movimiento.observaciones}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ── Vehículo ── */}
                        <h5 className="mt-4">Vehículo</h5>
                        <hr />
                        <div className="row mb-3">
                            <div className="col-12">
                                <div className="em-preview-card">
                                    <div className="em-preview-img-vehiculo">
                                        <img
                                            src={primeraImg ? ImagenVehiculos + primeraImg : "/vehiculos.jpg"}
                                            alt={vehiculo?.modelo}
                                            onError={e => { e.target.src = "/vehiculos.jpg"; }}
                                        />
                                    </div>
                                    <div className="em-preview-info">
                                        <div className="em-preview-title">{vehiculo?.placa}</div>
                                        <div className="em-preview-sub">{vehiculo?.modelo} · {vehiculo?.anio}</div>
                                        {nombreMarca && (
                                            <div className="em-chip-marca">
                                                {imgMarca && (
                                                    <img src={ImagenMarcas + imgMarca} alt={nombreMarca}
                                                        onError={e => { e.target.style.display = "none"; }} />
                                                )}
                                                {nombreMarca}
                                            </div>
                                        )}
                                    </div>
                                    <span className={`badge ${vehiculo?.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                                        {vehiculo?.estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Motorista ── */}
                        <h5 className="mt-4">Motorista</h5>
                        <hr />
                        <div className="row mb-4">
                            <div className="col-12">
                                <div className="em-preview-card">
                                    <div className="em-preview-img-motorista">
                                        <img
                                            src={ImagenMotoristas + motorista?.imagen}
                                            alt={motorista?.nombre}
                                            onError={e => { e.target.src = ImagenMotoristas + "motorista_default.jpg"; }}
                                        />
                                    </div>
                                    <div className="em-preview-info">
                                        <div className="em-preview-title">{motorista?.nombre} {motorista?.apellido}</div>
                                        <div className="em-preview-sub">
                                            <i className="fas fa-id-badge me-1" style={{ fontSize: ".65rem" }} />
                                            {motorista?.licencia}
                                        </div>
                                    </div>
                                    <span className={`badge ${motorista?.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                                        {motorista?.estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* ── Estado (único campo editable) ── */}
                        <h5 className="mt-2">Estado del movimiento</h5>
                        <hr />
                        <div className="row">
                            <div className="col-md-4 col-sm-12">
                                <div className="em-estado-row">
                                    <label className="em-toggle">
                                        <input
                                            type="checkbox"
                                            checked={estado === "Activo"}
                                            onChange={e => setEstado(e.target.checked ? "Activo" : "Inactivo")}
                                        />
                                        <span className="em-toggle-track" />
                                    </label>
                                    <span className="fw-semibold" style={{ color: estado === "Activo" ? "#16a34a" : "#94a3b8" }}>
                                        {estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </Card>
                </div>
            </div>
        </Page>
    );
};

export default EditarMovimiento;