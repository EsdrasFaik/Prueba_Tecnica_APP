import { useState } from "react";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import { mostraAlertaError, mostraAlertaOk } from "../../componentes/alerts/sweetAlert";
import { ImagenVehiculos, ImagenMarcas, ImagenMotoristas, MovimientosEditar } from "../../configuracion/apiUrls";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

const CardMovimiento = ({ movimiento, token, onEstadoCambiado }) => {
    const [expandido, setExpandido] = useState(false);
    const [estado, setEstado] = useState(movimiento.estado || "Activo");
    const [guardando, setGuardando] = useState(false);

    const vehiculo    = movimiento.Vehiculo;
    const motorista   = movimiento.Motoristum || movimiento.Motorista;
    const primeraImg  = vehiculo?.ImagenVehiculos?.[0]?.imagen;
    const imgMarca    = vehiculo?.MarcaVehiculo?.imagen;
    const nombreMarca = vehiculo?.MarcaVehiculo?.nombre;
    const esEntrada   = movimiento.tipo === "Entrada";

    const handleEstado = async (nuevoEstado) => {
        const estadoAnterior = estado;
        setEstado(nuevoEstado);
        setGuardando(true);
        try {
            AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await AxiosPrivado.put(MovimientosEditar + movimiento.id, { estado: nuevoEstado });
            mostraAlertaOk("Estado actualizado correctamente.");
            onEstadoCambiado?.();
        } catch (error) {
            mostraAlertaError(error.response?.data?.error || "Error al actualizar el estado.");
            setEstado(estadoAnterior);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <>
            <style>{`
                .cm-card {
                    border-radius: 14px; border: 1.5px solid #e2e8f0;
                    background: #fff; overflow: hidden;
                    transition: box-shadow .2s, border-color .2s;
                    margin-bottom: 10px;
                }
                .cm-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,.08); }
                .cm-card.expandida { border-color: #93c5fd; box-shadow: 0 4px 20px rgba(59,130,246,.1); }

                /* Barra lateral */
                .cm-tipo-bar {
                    width: 5px; align-self: stretch; flex-shrink: 0;
                    border-radius: 14px 0 0 14px;
                }
                .cm-tipo-bar.entrada { background: #22c55e; }
                .cm-tipo-bar.salida  { background: #ef4444; }

                /* Contenedor principal */
                .cm-main { display: flex; cursor: pointer; }
                .cm-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }

                /* Fila superior */
                .cm-top-row {
                    display: flex; align-items: center; gap: 8px;
                    padding: 10px 14px 6px;
                }
                .cm-badge-tipo {
                    display: inline-flex; align-items: center; gap: 5px;
                    padding: 3px 10px; border-radius: 99px;
                    font-size: .72rem; font-weight: 700; letter-spacing: .04em; flex-shrink: 0;
                }
                .cm-badge-tipo.entrada { background: #dcfce7; color: #166534; }
                .cm-badge-tipo.salida  { background: #fee2e2; color: #991b1b; }
                .cm-fecha { font-size: .72rem; color: #94a3b8; flex: 1; }
                .cm-acciones { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

                /* Toggle */
                .cm-toggle { position: relative; width: 38px; height: 20px; }
                .cm-toggle input { display: none; }
                .cm-toggle-track {
                    position: absolute; inset: 0; background: #cbd5e1;
                    border-radius: 99px; cursor: pointer; transition: background .2s;
                }
                .cm-toggle input:checked + .cm-toggle-track { background: #22c55e; }
                .cm-toggle-track::after {
                    content: ''; position: absolute; top: 2px; left: 2px;
                    width: 16px; height: 16px; background: #fff; border-radius: 50%;
                    transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
                }
                .cm-toggle input:checked + .cm-toggle-track::after { transform: translateX(18px); }
                .cm-toggle input:disabled + .cm-toggle-track { opacity: .5; cursor: not-allowed; }
                .cm-chevron { color: #94a3b8; font-size: .82rem; transition: transform .25s; }
                .cm-chevron.abierto { transform: rotate(180deg); }

                /* Fila inferior */
                .cm-bottom-row {
                    display: flex; align-items: center;
                    padding: 6px 14px 12px; gap: 0;
                }
                .cm-div-v {
                    width: 1px; background: #f1f5f9;
                    align-self: stretch; flex-shrink: 0; margin: 0 12px;
                }

                /* Vehículo */
                .cm-veh { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; }
                .cm-veh-img {
                    width: 54px; height: 42px; border-radius: 8px;
                    overflow: hidden; flex-shrink: 0; background: #f1f5f9;
                    border: 1px solid #e2e8f0;
                }
                .cm-veh-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .cm-veh-info { min-width: 0; }
                .cm-veh-placa { font-weight: 800; font-size: .8rem; color: #1e293b; letter-spacing: .05em; }
                .cm-veh-modelo { font-size: .72rem; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .cm-chip-marca {
                    display: inline-flex; align-items: center; gap: 4px;
                    font-size: .6rem; font-weight: 600; color: #475569;
                    background: #f1f5f9; border-radius: 99px; padding: 1px 6px; margin-top: 2px;
                }
                .cm-chip-marca img { width: 11px; height: 11px; object-fit: contain; }

                /* Motorista */
                .cm-mot { flex: 1; min-width: 0; display: flex; align-items: center; gap: 10px; }
                .cm-mot-img {
                    width: 38px; height: 38px; border-radius: 50%;
                    overflow: hidden; flex-shrink: 0; background: #f1f5f9;
                    border: 2px solid #e2e8f0;
                }
                .cm-mot-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
                .cm-mot-info { min-width: 0; }
                .cm-mot-nombre { font-weight: 700; font-size: .8rem; color: #1e293b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .cm-mot-licencia { font-size: .66rem; color: #94a3b8; }

                /* Responsive: móvil < 500px */
                @media (max-width: 500px) {
                    .cm-veh-img { display: none; }
                    .cm-mot-img { width: 32px; height: 32px; }
                    .cm-chip-marca { display: none; }
                    .cm-div-v { margin: 0 8px; }
                    .cm-top-row { padding: 8px 10px 4px; }
                    .cm-bottom-row { padding: 4px 10px 10px; }
                    .cm-fecha { font-size: .66rem; }
                }

                /* Panel expandido */
                .cm-detalle {
                    border-top: 1px solid #f1f5f9; padding: 14px 18px 16px;
                    background: #fafbfc;
                    display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
                    gap: 12px; animation: cm-slide .2s ease;
                }
                @keyframes cm-slide {
                    from { opacity: 0; transform: translateY(-5px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .cm-det-label {
                    font-size: .63rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: .07em; color: #94a3b8; margin-bottom: 3px;
                }
                .cm-det-value { font-size: .82rem; font-weight: 600; color: #1e293b; }
                .cm-det-obs { grid-column: 1 / -1; }
                .cm-det-obs .cm-det-value {
                    font-weight: 400; color: #475569; font-style: italic; white-space: pre-wrap;
                }
            `}</style>

            <div className={`cm-card${expandido ? " expandida" : ""}`}>
                <div className="cm-main" onClick={() => setExpandido(p => !p)}>

                    {/* Barra lateral de color */}
                    <div className={`cm-tipo-bar ${esEntrada ? "entrada" : "salida"}`} />

                    <div className="cm-content">
                        {/* ── Fila superior: badge · fecha · acciones ── */}
                        <div className="cm-top-row">
                            <span className={`cm-badge-tipo ${esEntrada ? "entrada" : "salida"}`}>
                                <i className={`fas ${esEntrada ? "fa-arrow-down" : "fa-arrow-up"}`} />
                                {movimiento.tipo}
                            </span>
                            <span className="cm-fecha">
                                {moment(movimiento.fecha_hora).format("DD MMM YYYY · HH:mm")}
                            </span>
                            <div className="cm-acciones" onClick={e => e.stopPropagation()}>
                                <label className="cm-toggle" title={estado}>
                                    <input
                                        type="checkbox"
                                        checked={estado === "Activo"}
                                        disabled={guardando}
                                        onChange={e => handleEstado(e.target.checked ? "Activo" : "Inactivo")}
                                    />
                                    <span className="cm-toggle-track" />
                                </label>
                                <i
                                    className={`fas fa-chevron-down cm-chevron${expandido ? " abierto" : ""}`}
                                    onClick={e => { e.stopPropagation(); setExpandido(p => !p); }}
                                />
                            </div>
                        </div>

                        {/* ── Fila inferior: vehículo | motorista ── */}
                        <div className="cm-bottom-row">
                            {/* Vehículo */}
                            <div className="cm-veh">
                                <div className="cm-veh-img">
                                    <img
                                        src={primeraImg ? ImagenVehiculos + primeraImg : "/vehiculos.jpg"}
                                        alt={vehiculo?.modelo}
                                        onError={e => { e.target.onerror = null; e.target.src = "/vehiculos.jpg"; }}
                                    />
                                </div>
                                <div className="cm-veh-info">
                                    <div className="cm-veh-placa">{vehiculo?.placa}</div>
                                    <div className="cm-veh-modelo">{vehiculo?.modelo} · {vehiculo?.anio}</div>
                                    {nombreMarca && (
                                        <div className="cm-chip-marca">
                                            {imgMarca && (
                                                <img src={ImagenMarcas + imgMarca} alt={nombreMarca}
                                                    onError={e => { e.target.onerror = null; e.target.style.display = "none"; }} />
                                            )}
                                            {nombreMarca}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="cm-div-v" />

                            {/* Motorista */}
                            <div className="cm-mot">
                                <div className="cm-mot-img">
                                    <img
                                        src={motorista?.imagen ? ImagenMotoristas + motorista.imagen : "/motorista_default.jpg"}
                                        alt={motorista?.nombre}
                                        onError={e => { e.target.onerror = null; e.target.src = "/motorista_default.jpg"; }}
                                    />
                                </div>
                                <div className="cm-mot-info">
                                    <div className="cm-mot-nombre">{motorista?.nombre} {motorista?.apellido}</div>
                                    <div className="cm-mot-licencia">
                                        <i className="fas fa-id-badge" style={{ fontSize: ".6rem", marginRight: 3 }} />
                                        {motorista?.licencia}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Panel expandido ── */}
                {expandido && (
                    <div className="cm-detalle" onClick={e => e.stopPropagation()}>
                        <div>
                            <div className="cm-det-label">Kilometraje</div>
                            <div className="cm-det-value">
                                <i className="fas fa-tachometer-alt mx-1 text-muted" />
                                {movimiento.kilometraje?.toLocaleString()} km
                            </div>
                        </div>
                        <div>
                            <div className="cm-det-label">Fecha completa</div>
                            <div className="cm-det-value">
                                {moment(movimiento.fecha_hora).format("LL [a las] HH:mm")}
                            </div>
                        </div>
                        <div>
                            <div className="cm-det-label">Estado</div>
                            <div className="cm-det-value">
                                <span className={`badge ${estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                                    {estado}
                                </span>
                            </div>
                        </div>
                        <div>
                            <div className="cm-det-label">ID</div>
                            <div className="cm-det-value text-muted">#{movimiento.id}</div>
                        </div>
                        {movimiento.observaciones && (
                            <div className="cm-det-obs">
                                <div className="cm-det-label">Observaciones</div>
                                <div className="cm-det-value">{movimiento.observaciones}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default CardMovimiento;