import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../componentes/plantilla/Page";
import CardMovimiento from "../../componentes/contenedores/CardMovimiento";
import { MovimientosListar } from "../../configuracion/apiUrls";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";
import moment from "moment";
import "moment/locale/es";

moment.locale("es");

const HomeMovimientos = () => {
    const { token, ActualizarLista } = useContextUsuario();
    const navigate = useNavigate();

    const [listaMovimientos, setListaMovimientos] = useState([]);
    const [mostrarInactivos, setMostrarInactivos] = useState(false);

    // Filtros
    const [filtroFechaDesde, setFiltroFechaDesde] = useState("");
    const [filtroFechaHasta, setFiltroFechaHasta] = useState("");
    const [filtroVehiculo, setFiltroVehiculo] = useState("");
    const [filtroMotorista, setFiltroMotorista] = useState("");
    const [filtroTipo, setFiltroTipo] = useState(""); // "Entrada" | "Salida" | ""

    const pageDatos = {
        titulo: {
            titulo: "Movimientos",
            url: "/app/admin/movimientos",
            tituloUrl: "movimientos",
            nombreUrl: "listado",
        },
    };

    useEffect(() => {
        if (!token) return;
        cargar();
    }, [token]);

    const cargar = () => ActualizarLista(MovimientosListar, setListaMovimientos);

    // Opciones únicas para selects de vehículo y motorista
    const vehiculosUnicos = useMemo(() => {
        const mapa = new Map();
        listaMovimientos.forEach(m => {
            if (m.Vehiculo && !mapa.has(m.vehiculoId)) {
                mapa.set(m.vehiculoId, `${m.Vehiculo.placa} — ${m.Vehiculo.modelo}`);
            }
        });
        return Array.from(mapa.entries()).map(([id, label]) => ({ id, label }));
    }, [listaMovimientos]);

    const motoristasUnicos = useMemo(() => {
        const mapa = new Map();
        listaMovimientos.forEach(m => {
            if (m.Motoristum && !mapa.has(m.motoristaId)) {
                mapa.set(m.motoristaId, `${m.Motoristum.nombre} ${m.Motoristum.apellido}`);
            }
        });
        return Array.from(mapa.entries()).map(([id, label]) => ({ id, label }));
    }, [listaMovimientos]);

    const movimientosFiltrados = useMemo(() => {
        return listaMovimientos.filter(m => {
            // Estado
            const coincideEstado = mostrarInactivos
                ? m.estado === "Inactivo"
                : m.estado === "Activo";

            // Tipo
            const coincideTipo = filtroTipo === "" || m.tipo === filtroTipo;

            // Fecha desde
            const coincideFechaDesde = filtroFechaDesde === "" ||
                moment(m.fecha_hora).isSameOrAfter(moment(filtroFechaDesde), "day");

            // Fecha hasta
            const coincideFechaHasta = filtroFechaHasta === "" ||
                moment(m.fecha_hora).isSameOrBefore(moment(filtroFechaHasta), "day");

            // Vehículo
            const coincideVehiculo = filtroVehiculo === "" ||
                String(m.vehiculoId) === filtroVehiculo;

            // Motorista
            const coincideMotorista = filtroMotorista === "" ||
                String(m.motoristaId) === filtroMotorista;

            return coincideEstado && coincideTipo && coincideFechaDesde &&
                coincideFechaHasta && coincideVehiculo && coincideMotorista;
        });
    }, [listaMovimientos, mostrarInactivos, filtroTipo, filtroFechaDesde, filtroFechaHasta, filtroVehiculo, filtroMotorista]);

    const limpiarFiltros = () => {
        setFiltroFechaDesde("");
        setFiltroFechaHasta("");
        setFiltroVehiculo("");
        setFiltroMotorista("");
        setFiltroTipo("");
    };

    const hayFiltrosActivos = filtroFechaDesde || filtroFechaHasta ||
        filtroVehiculo || filtroMotorista || filtroTipo;

    return (
        <Page datos={pageDatos}>
            <style>{`
                .hm-toolbar {
                    display: flex; align-items: center; gap: 8px;
                    flex-wrap: wrap; margin-bottom: 16px;
                }
                .hm-toggle-wrap {
                    display: flex; align-items: center; gap: 7px;
                    white-space: nowrap; font-size: .82rem; color: #64748b;
                    font-weight: 600; user-select: none; cursor: pointer;
                }
                .hm-toggle-pill { position: relative; width: 40px; height: 22px; flex-shrink: 0; }
                .hm-toggle-pill input { display: none; }
                .hm-toggle-track {
                    position: absolute; inset: 0; background: #cbd5e1;
                    border-radius: 99px; cursor: pointer; transition: background .2s;
                }
                .hm-toggle-pill input:checked + .hm-toggle-track { background: #64748b; }
                .hm-toggle-track::after {
                    content: ''; position: absolute; top: 3px; left: 3px;
                    width: 16px; height: 16px; background: #fff; border-radius: 50%;
                    transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
                }
                .hm-toggle-pill input:checked + .hm-toggle-track::after { transform: translateX(18px); }

                .hm-btn-nuevo {
                    height: 38px; padding: 0 16px; margin-left: auto;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #fff; border: none; border-radius: 9px;
                    font-size: .85rem; font-weight: 600; white-space: nowrap;
                    cursor: pointer; display: flex; align-items: center; gap: 6px;
                    transition: opacity .2s;
                }
                .hm-btn-nuevo:hover { opacity: .88; }

                /* Panel de filtros */
                .hm-filtros {
                    background: #f8fafc; border: 1.5px solid #e2e8f0;
                    border-radius: 12px; padding: 16px 18px; margin-bottom: 16px;
                }
                .hm-filtros-titulo {
                    font-size: .72rem; font-weight: 700; text-transform: uppercase;
                    letter-spacing: .07em; color: #94a3b8; margin-bottom: 12px;
                    display: flex; align-items: center; gap: 8px;
                }
                .hm-filtros-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
                    gap: 10px;
                }
                .hm-filtro-label {
                    font-size: .72rem; font-weight: 600; color: #64748b; margin-bottom: 4px;
                }
                .hm-filtro-input {
                    width: 100%; height: 36px; padding: 0 10px;
                    border: 1.5px solid #e2e8f0; border-radius: 8px;
                    font-size: .82rem; color: #374151; background: #fff; outline: none;
                    transition: border-color .2s, box-shadow .2s;
                }
                .hm-filtro-input:focus {
                    border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1);
                }
                .hm-btn-limpiar {
                    align-self: flex-end; height: 36px; padding: 0 14px;
                    background: #fee2e2; color: #b91c1c;
                    border: 1.5px solid #fecaca; border-radius: 8px;
                    font-size: .8rem; font-weight: 600; cursor: pointer;
                    transition: background .15s; white-space: nowrap;
                    display: flex; align-items: center; gap: 5px;
                }
                .hm-btn-limpiar:hover { background: #fecaca; }

                .hm-count {
                    font-size: .75rem; color: #94a3b8; margin-bottom: 12px;
                }
                .hm-empty { text-align: center; padding: 60px 0; }
                .hm-empty i { font-size: 3rem; color: #e2e8f0; display: block; margin-bottom: 12px; }
                .hm-empty span { font-size: .9rem; color: #94a3b8; }
            `}</style>

            {/* ── Toolbar ── */}
            <div className="hm-toolbar">
                <label className="hm-toggle-wrap">
                    <div className="hm-toggle-pill">
                        <input
                            type="checkbox"
                            checked={mostrarInactivos}
                            onChange={e => setMostrarInactivos(e.target.checked)}
                        />
                        <span className="hm-toggle-track" />
                    </div>
                    Inactivos
                </label>

                <button className="hm-btn-nuevo" onClick={() => navigate("/app/movimientos/nuevo")}>
                    <i className="fas fa-plus" /> Nuevo movimiento
                </button>
            </div>

            {/* ── Panel de filtros ── */}
            <div className="hm-filtros">
                <div className="hm-filtros-titulo">
                    <i className="fas fa-filter" /> Filtros
                    {hayFiltrosActivos && <span className="badge bg-primary ms-1">Activos</span>}
                </div>
                <div className="hm-filtros-grid">

                    {/* Tipo */}
                    <div>
                        <div className="hm-filtro-label">Tipo</div>
                        <select
                            className="hm-filtro-input"
                            value={filtroTipo}
                            onChange={e => setFiltroTipo(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="Entrada">Entrada</option>
                            <option value="Salida">Salida</option>
                        </select>
                    </div>

                    {/* Fecha desde */}
                    <div>
                        <div className="hm-filtro-label">Fecha desde</div>
                        <input
                            type="date"
                            className="hm-filtro-input"
                            value={filtroFechaDesde}
                            onChange={e => setFiltroFechaDesde(e.target.value)}
                        />
                    </div>

                    {/* Fecha hasta */}
                    <div>
                        <div className="hm-filtro-label">Fecha hasta</div>
                        <input
                            type="date"
                            className="hm-filtro-input"
                            value={filtroFechaHasta}
                            onChange={e => setFiltroFechaHasta(e.target.value)}
                        />
                    </div>

                    {/* Vehículo */}
                    <div>
                        <div className="hm-filtro-label">Vehículo</div>
                        <select
                            className="hm-filtro-input"
                            value={filtroVehiculo}
                            onChange={e => setFiltroVehiculo(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {vehiculosUnicos.map(v => (
                                <option key={v.id} value={v.id}>{v.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Motorista */}
                    <div>
                        <div className="hm-filtro-label">Motorista</div>
                        <select
                            className="hm-filtro-input"
                            value={filtroMotorista}
                            onChange={e => setFiltroMotorista(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {motoristasUnicos.map(m => (
                                <option key={m.id} value={m.id}>{m.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Botón limpiar */}
                    {hayFiltrosActivos && (
                        <div style={{ display: "flex", alignItems: "flex-end" }}>
                            <button className="hm-btn-limpiar" onClick={limpiarFiltros}>
                                <i className="fas fa-times" /> Limpiar
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Contador ── */}
            <div className="hm-count">
                {movimientosFiltrados.length} movimiento{movimientosFiltrados.length !== 1 ? "s" : ""}{" "}
                {mostrarInactivos ? "inactivo(s)" : "activo(s)"}
            </div>

            {/* ── Lista de movimientos ── */}
            {movimientosFiltrados.length === 0 ? (
                <div className="hm-empty">
                    <i className="fas fa-exchange-alt" />
                    <span>No hay movimientos {mostrarInactivos ? "inactivos" : "activos"}</span>
                </div>
            ) : (
                movimientosFiltrados.map(movimiento => (
                    <CardMovimiento
                        key={movimiento.id}
                        movimiento={movimiento}
                        token={token}
                        onEstadoCambiado={cargar}
                    />
                ))
            )}
        </Page>
    );
};

export default HomeMovimientos;