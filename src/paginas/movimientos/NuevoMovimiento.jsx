import { useEffect, useState } from "react";
import {
    mostraAlertaError,
    mostraAlertaOk,
    mostraAlertaWarning,
} from "../../componentes/alerts/sweetAlert";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import Card from "../../componentes/contenedores/Card";
import Page from "../../componentes/plantilla/Page";
import { ModalFormularioMotorista } from "../motoristas/ModalMotorista";
import EliminarMotorista from "../motoristas/EliminarMotorista";
import {
    MovimientosGuardar,
    MotoristasListar,
    VehiculoListar,
    ImagenMotoristas,
    ImagenVehiculos,
    ImagenMarcas,
} from "../../configuracion/apiUrls";
import { regexEntero } from "../../configuracion/validaciones";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";

const NuevoMovimiento = () => {
    const { token, ActualizarLista } = useContextUsuario();

    const [formulario, setFormulario] = useState({
        tipo: "Entrada",
        fecha_hora: new Date().toISOString().slice(0, 16),
        kilometraje: "",
        observaciones: "",
        estado: "Activo",
    });

    const [listaMotoristas, setListaMotoristas] = useState([]);
    const [listaVehiculos, setListaVehiculos] = useState([]);

    const [motoristaSeleccionado, setMotoristaSeleccionado] = useState(null);
    const [vehiculoSeleccionado, setVehiculoSeleccionado] = useState(null);

    const [modalMotoristaOpen, setModalMotoristaOpen] = useState(false);
    const [modalVehiculoOpen, setModalVehiculoOpen] = useState(false);

    const [errorKilometraje, setErrorKilometraje] = useState(false);
    const [errorMotorista, setErrorMotorista] = useState(false);
    const [errorVehiculo, setErrorVehiculo] = useState(false);

    const pageDatos = {
        titulo: {
            titulo: "Nuevo movimiento",
            url: "/app/admin/movimientos",
            tituloUrl: "movimientos",
            nombreUrl: "nuevo",
        },
    };

    useEffect(() => {
        if (!token) return;
        ActualizarLista(MotoristasListar, setListaMotoristas);
        ActualizarLista(VehiculoListar, setListaVehiculos);
    }, [token]);

    useEffect(() => {
        if (modalMotoristaOpen || modalVehiculoOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [modalMotoristaOpen, modalVehiculoOpen]);

    const manejador = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: value }));
        if (name === "kilometraje") {
            setErrorKilometraje(!regexEntero.test(value) || parseInt(value, 10) < 0);
        }
    };

    const validar = () => {
        const kmErr = !regexEntero.test(formulario.kilometraje) || parseInt(formulario.kilometraje, 10) < 0;
        setErrorKilometraje(kmErr);
        setErrorMotorista(!motoristaSeleccionado);
        setErrorVehiculo(!vehiculoSeleccionado);

        if (kmErr || !motoristaSeleccionado || !vehiculoSeleccionado) {
            mostraAlertaError("Existen errores en el formulario. Por favor corrígelos.", "Error");
            return false;
        }
        if (!formulario.tipo) { mostraAlertaWarning("Debe seleccionar el tipo de movimiento."); return false; }
        if (!formulario.fecha_hora) { mostraAlertaWarning("La fecha y hora son obligatorias."); return false; }
        if (!formulario.kilometraje) { mostraAlertaWarning("El kilometraje es obligatorio."); return false; }
        return true;
    };

    const guardarMovimiento = async () => {
        if (!validar()) return;

        const payload = {
            tipo: formulario.tipo,
            fecha_hora: formulario.fecha_hora,
            kilometraje: parseInt(formulario.kilometraje, 10),
            observaciones: formulario.observaciones || null,
            vehiculoId: vehiculoSeleccionado.id,
            motoristaId: motoristaSeleccionado.id,
            estado: formulario.estado,
        };

        try {
            AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await AxiosPrivado.post(MovimientosGuardar, payload);
            mostraAlertaOk("Movimiento registrado correctamente.");
            limpiar();
        } catch (error) {
            const msg = error.response?.data?.error || "Error al registrar el movimiento.";
            mostraAlertaError(msg, "Error");
        }
    };

    const limpiar = () => {
        setFormulario({
            tipo: "Entrada",
            fecha_hora: new Date().toISOString().slice(0, 16),
            kilometraje: "",
            observaciones: "",
            estado: "Activo",
        });
        setMotoristaSeleccionado(null);
        setVehiculoSeleccionado(null);
        setErrorKilometraje(false);
        setErrorMotorista(false);
        setErrorVehiculo(false);
    };

    const refrescarMotoristas = () => ActualizarLista(MotoristasListar, setListaMotoristas);

    const BotonGuardar = () => (
        <>
            <button type="button" className="btn btn-success mr-3" onClick={guardarMovimiento}>
                <i className="fas fa-save mx-1" /> Guardar
            </button>
            <button type="button" className="btn btn-warning mr-3" onClick={limpiar}>
                <i className="fas fa-broom mx-1" /> Limpiar
            </button>
        </>
    );

    return (
        <Page datos={pageDatos}>
            <div className="row">
                <div className="col-12">
                    <Card titulo="Datos del movimiento" pie={<BotonGuardar />}>
                        <form onSubmit={e => e.preventDefault()}>

                            {/* Tipo y Fecha */}
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="tipo">Tipo de movimiento</label>
                                        <select
                                            id="tipo"
                                            name="tipo"
                                            className="form-control"
                                            value={formulario.tipo}
                                            onChange={manejador}
                                        >
                                            <option value="Entrada">Entrada</option>
                                            <option value="Salida">Salida</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="fecha_hora">Fecha y hora</label>
                                        <input
                                            type="datetime-local"
                                            id="fecha_hora"
                                            name="fecha_hora"
                                            className="form-control"
                                            value={formulario.fecha_hora}
                                            onChange={manejador}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Kilometraje */}
                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="kilometraje">Kilometraje</label>
                                        <input
                                            type="number"
                                            id="kilometraje"
                                            name="kilometraje"
                                            className={`form-control ${errorKilometraje ? "is-invalid" : ""}`}
                                            placeholder="Ej: 45000"
                                            value={formulario.kilometraje}
                                            onChange={manejador}
                                            min="0"
                                        />
                                        {errorKilometraje && <div className="invalid-feedback">Ingrese un kilometraje válido (mayor o igual a 0).</div>}
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            name="estado"
                                            className="form-control"
                                            value={formulario.estado}
                                            onChange={manejador}
                                        >
                                            <option value="Activo">Activo</option>
                                            <option value="Inactivo">Inactivo</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label htmlFor="observaciones">Observaciones</label>
                                        <textarea
                                            id="observaciones"
                                            name="observaciones"
                                            className="form-control"
                                            placeholder="Observaciones opcionales..."
                                            rows={3}
                                            value={formulario.observaciones}
                                            onChange={manejador}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ── Vehículo ── */}
                            <h5 className="mt-3">Vehículo</h5>
                            <hr />
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Vehículo seleccionado</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className={`form-control ${errorVehiculo ? "is-invalid" : ""}`}
                                                value={vehiculoSeleccionado
                                                    ? `${vehiculoSeleccionado.placa} — ${vehiculoSeleccionado.modelo} (${vehiculoSeleccionado.anio})`
                                                    : "Ningún vehículo seleccionado"}
                                                readOnly
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    type="button"
                                                    onClick={() => setModalVehiculoOpen(true)}
                                                >
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                            {errorVehiculo && (
                                                <div className="invalid-feedback" style={{ display: "block" }}>
                                                    Debe seleccionar un vehículo.
                                                </div>
                                            )}
                                        </div>

                                        {/* Preview vehículo */}
                                        {vehiculoSeleccionado && (
                                            <VehiculoPreview vehiculo={vehiculoSeleccionado} />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* ── Motorista ── */}
                            <h5 className="mt-3">Motorista</h5>
                            <hr />
                            <div className="row">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Motorista seleccionado</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className={`form-control ${errorMotorista ? "is-invalid" : ""}`}
                                                value={motoristaSeleccionado
                                                    ? `${motoristaSeleccionado.nombre} ${motoristaSeleccionado.apellido} — ${motoristaSeleccionado.licencia}`
                                                    : "Ningún motorista seleccionado"}
                                                readOnly
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    type="button"
                                                    onClick={() => setModalMotoristaOpen(true)}
                                                >
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                            {errorMotorista && (
                                                <div className="invalid-feedback" style={{ display: "block" }}>
                                                    Debe seleccionar un motorista.
                                                </div>
                                            )}
                                        </div>

                                        {/* Preview motorista */}
                                        {motoristaSeleccionado && (
                                            <MotoristaPreview motorista={motoristaSeleccionado} />
                                        )}
                                    </div>
                                </div>
                            </div>

                        </form>
                    </Card>
                </div>
            </div>

            {/* Modal selector de vehículo */}
            {modalVehiculoOpen && (
                <VehiculoSelectorModalInline
                    vehiculos={listaVehiculos}
                    vehiculoSeleccionadoId={vehiculoSeleccionado?.id}
                    onSeleccionar={v => { setVehiculoSeleccionado(v); setErrorVehiculo(false); setModalVehiculoOpen(false); }}
                    onCerrar={() => setModalVehiculoOpen(false)}
                />
            )}

            {/* Modal selector de motorista (con crear/editar/eliminar) */}
            {modalMotoristaOpen && (
                <MotoristaSelectorModal
                    motoristas={listaMotoristas}
                    setListaMotoristas={setListaMotoristas}
                    motoristaSeleccionadoId={motoristaSeleccionado?.id}
                    onSeleccionar={m => { setMotoristaSeleccionado(m); setErrorMotorista(false); setModalMotoristaOpen(false); }}
                    onCerrar={() => setModalMotoristaOpen(false)}
                    token={token}
                    onMotoristaCreado={refrescarMotoristas}
                    ActualizarLista={ActualizarLista}
                />
            )}
        </Page>
    );
};

/* ─────────────────────────────────────────────
   PREVIEW VEHÍCULO — tras seleccionar
───────────────────────────────────────────── */
const VehiculoPreview = ({ vehiculo }) => {
    const primeraImg  = vehiculo.ImagenVehiculos?.[0]?.imagen;
    const imgMarca    = vehiculo.MarcaVehiculo?.imagen;
    const nombreMarca = vehiculo.MarcaVehiculo?.nombre;

    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginTop: 10, padding: "10px 14px",
            background: "#eff6ff", border: "1.5px solid #93c5fd",
            borderRadius: 10,
        }}>
            <div style={{ width: 64, height: 50, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#dbeafe" }}>
                <img
                    src={primeraImg ? ImagenVehiculos + primeraImg : "/vehiculos.jpg"}
                    alt={vehiculo.modelo}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={e => { e.target.src = "/vehiculos.jpg"; }}
                />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, fontSize: ".9rem", color: "#1e40af", letterSpacing: ".04em" }}>{vehiculo.placa}</div>
                <div style={{ fontSize: ".78rem", color: "#475569" }}>{vehiculo.modelo} · {vehiculo.anio}</div>
                {nombreMarca && (
                    <div style={{
                        display: "inline-flex", alignItems: "center", gap: 5,
                        fontSize: ".68rem", fontWeight: 600, color: "#475569",
                        background: "#dbeafe", borderRadius: 99, padding: "2px 8px", marginTop: 3,
                    }}>
                        {imgMarca && (
                            <img src={ImagenMarcas + imgMarca} alt={nombreMarca}
                                style={{ width: 14, height: 14, objectFit: "contain" }}
                                onError={e => { e.target.style.display = "none"; }} />
                        )}
                        {nombreMarca}
                    </div>
                )}
            </div>
            <span className="badge bg-success">{vehiculo.estado}</span>
        </div>
    );
};

/* ─────────────────────────────────────────────
   PREVIEW MOTORISTA — tras seleccionar
───────────────────────────────────────────── */
const MotoristaPreview = ({ motorista }) => (
    <div style={{
        display: "flex", alignItems: "center", gap: 12,
        marginTop: 10, padding: "10px 14px",
        background: "#f0fdf4", border: "1.5px solid #86efac",
        borderRadius: 10,
    }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#dcfce7" }}>
            <img
                src={ImagenMotoristas + motorista.imagen}
                alt={motorista.nombre}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={e => { e.target.src = ImagenMotoristas + "motorista_default.jpg"; }}
            />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: ".9rem", color: "#166534" }}>
                {motorista.nombre} {motorista.apellido}
            </div>
            <div style={{ fontSize: ".75rem", color: "#4b5563" }}>
                <i className="fas fa-id-badge mx-1" style={{ fontSize: ".65rem" }} />
                {motorista.licencia}
            </div>
        </div>
        <span className="badge bg-success">{motorista.estado}</span>
    </div>
);

/* ─────────────────────────────────────────────
   SELECTOR DE MOTORISTAS — con crear/editar/eliminar
   (mismo patrón que MarcaSelectorModal)
───────────────────────────────────────────── */
const MotoristaSelectorModal = ({
    motoristas, setListaMotoristas, motoristaSeleccionadoId,
    onSeleccionar, onCerrar, token, onMotoristaCreado, ActualizarLista,
}) => {
    const [busqueda, setBusqueda] = useState("");
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [motoristaEditando, setMotoristaEditando] = useState(null);

    const abrirEditar = (e, motorista) => { e.stopPropagation(); setMotoristaEditando(motorista); setModalFormOpen(true); };
    const abrirCrear  = () => { setMotoristaEditando(null); setModalFormOpen(true); };

    const motoristasFiltrados = motoristas.filter(m => {
        const coincideEstado   = mostrarInactivos ? m.estado === "Inactivo" : m.estado === "Activo";
        const texto = `${m.nombre} ${m.apellido} ${m.licencia}`.toLowerCase();
        const coincideBusqueda = texto.includes(busqueda.toLowerCase());
        return coincideEstado && coincideBusqueda;
    });

    return (
        <>
            <style>{`
                .msm2-overlay { position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1050;display:flex;align-items:flex-end;justify-content:center;padding:0;touch-action:none; }
                @media(min-width:576px){.msm2-overlay{align-items:center;padding:16px;}}
                .msm2-dialog{background:#fff;width:100%;max-width:680px;max-height:92vh;border-radius:18px 18px 0 0;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.18);overflow:hidden;touch-action:auto;}
                @media(min-width:576px){.msm2-dialog{border-radius:14px;max-height:85vh;}}
                .msm2-handle{display:flex;justify-content:center;padding:10px 0 4px;flex-shrink:0;}
                .msm2-handle-bar{width:36px;height:4px;background:#cbd5e1;border-radius:99px;}
                @media(min-width:576px){.msm2-handle{display:none;}}
                .msm2-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#1e293b;color:#fff;flex-shrink:0;}
                .msm2-header h5{margin:0;font-size:.95rem;font-weight:600;display:flex;align-items:center;gap:8px;}
                .msm2-close{background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;opacity:.7;padding:0 4px;}
                .msm2-close:hover{opacity:1;}
                .msm2-toolbar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid #e2e8f0;flex-shrink:0;background:#f8fafc;flex-wrap:wrap;}
                @media(min-width:576px){.msm2-toolbar{padding:12px 20px;flex-wrap:nowrap;}}
                .msm2-search{flex:1;min-width:0;position:relative;width:100%;}
                @media(min-width:576px){.msm2-search{width:auto;}}
                .msm2-search i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:.82rem;pointer-events:none;}
                .msm2-search input{width:100%;padding:0 12px 0 32px;height:38px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.875rem;color:#374151;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s;}
                .msm2-search input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1);}
                .msm2-toolbar-row2{display:flex;align-items:center;justify-content:space-between;width:100%;gap:8px;}
                @media(min-width:576px){.msm2-toolbar-row2{width:auto;display:contents;}}
                .msm2-toggle-wrap{display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:.82rem;color:#64748b;font-weight:600;user-select:none;cursor:pointer;margin:0;}
                .msm2-toggle-pill{position:relative;width:38px;height:20px;flex-shrink:0;}
                .msm2-toggle-pill input{display:none;}
                .msm2-toggle-track{position:absolute;inset:0;background:#cbd5e1;border-radius:99px;cursor:pointer;transition:background .2s;}
                .msm2-toggle-pill input:checked+.msm2-toggle-track{background:#64748b;}
                .msm2-toggle-track::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
                .msm2-toggle-pill input:checked+.msm2-toggle-track::after{transform:translateX(18px);}
                .msm2-btn-nuevo{height:38px;padding:0 14px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:8px;font-size:.82rem;font-weight:600;white-space:nowrap;cursor:pointer;display:flex;align-items:center;gap:5px;transition:opacity .2s;}
                .msm2-btn-nuevo:hover{opacity:.88;}
                .msm2-count{padding:8px 16px 0;font-size:.73rem;color:#94a3b8;flex-shrink:0;}
                .msm2-body{overflow-y:auto;overflow-x:hidden;padding:10px 14px 32px;flex:1;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
                @media(min-width:576px){.msm2-body{padding:10px 20px 20px;}}
                .msm2-card{border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;transition:border-color .15s,box-shadow .15s,background .15s;overflow:hidden;}
                .msm2-card:not(.inactive):hover{border-color:#93c5fd;box-shadow:0 3px 12px rgba(59,130,246,.11);}
                .msm2-card.selected{border-color:#3b82f6;background:#eff6ff;}
                .msm2-card.inactive{background:#f8fafc;opacity:.82;}
                .msm2-card-inner{display:flex;align-items:center;gap:10px;padding:10px 12px;}
                .msm2-card-img{width:44px;height:44px;border-radius:50%;background:#f1f5f9;border:2px solid #e2e8f0;flex-shrink:0;overflow:hidden;}
                .msm2-card-img img{width:100%;height:100%;object-fit:cover;}
                .msm2-card-info{flex:1;min-width:0;}
                .msm2-card-nombre{font-weight:700;font-size:.875rem;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                .msm2-card-licencia{font-size:.72rem;color:#64748b;}
                .msm2-card-badge{font-size:.62rem;font-weight:600;padding:1px 7px;border-radius:99px;}
                .msm2-card-actions{display:flex;align-items:center;gap:4px;flex-shrink:0;}
                .msm2-btn-sel{height:32px;padding:0 10px;border-radius:7px;font-size:.78rem;font-weight:600;border:1.5px solid #3b82f6;color:#3b82f6;background:transparent;cursor:pointer;transition:background .15s,color .15s;white-space:nowrap;display:flex;align-items:center;gap:4px;}
                .msm2-btn-sel:hover,.msm2-card.selected .msm2-btn-sel{background:#3b82f6;color:#fff;}
                .msm2-btn-sel-text{display:none;}
                @media(min-width:480px){.msm2-btn-sel-text{display:inline;}}
                .msm2-btn-edit{height:32px;width:32px;border-radius:7px;border:1.5px solid #fde68a;background:#fef3c7;color:#b45309;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:center;}
                .msm2-btn-edit:hover{background:#fde68a;}
                .msm2-card-actions .btn-danger{height:32px;width:32px;padding:0;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.8rem;}
                .msm2-empty{text-align:center;padding:36px 0;}
                .msm2-empty i{font-size:2.2rem;color:#e2e8f0;display:block;margin-bottom:10px;}
                .msm2-empty span{font-size:.875rem;color:#94a3b8;}
            `}</style>

            <div className="msm2-overlay" onClick={onCerrar}>
                <div className="msm2-dialog" onClick={e => e.stopPropagation()}>

                    <div className="msm2-handle"><div className="msm2-handle-bar" /></div>

                    <div className="msm2-header">
                        <h5><i className="fas fa-id-card" /> Seleccionar motorista</h5>
                        <button className="msm2-close" onClick={onCerrar}>&times;</button>
                    </div>

                    <div className="msm2-toolbar">
                        <div className="msm2-search">
                            <i className="fas fa-search" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o licencia..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="msm2-toolbar-row2">
                            <label className="msm2-toggle-wrap">
                                <div className="msm2-toggle-pill">
                                    <input type="checkbox" checked={mostrarInactivos} onChange={e => setMostrarInactivos(e.target.checked)} />
                                    <span className="msm2-toggle-track" />
                                </div>
                                Inactivos
                            </label>
                            <button className="msm2-btn-nuevo" onClick={abrirCrear}>
                                <i className="fas fa-plus" /> Nuevo motorista
                            </button>
                        </div>
                    </div>

                    <div className="msm2-count">
                        {motoristasFiltrados.length} motorista{motoristasFiltrados.length !== 1 ? "s" : ""}{" "}
                        {mostrarInactivos ? "inactivo(s)" : "activo(s)"}
                    </div>

                    <div className="msm2-body">
                        {motoristasFiltrados.length === 0 ? (
                            <div className="msm2-empty">
                                <i className="fas fa-id-card" />
                                <span>No hay motoristas {mostrarInactivos ? "inactivos" : "activos"} registrados</span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2 mt-2">
                                {motoristasFiltrados.map(motorista => {
                                    const esInactivo     = motorista.estado === "Inactivo";
                                    const esSeleccionado = motoristaSeleccionadoId === motorista.id;
                                    return (
                                        <div
                                            key={motorista.id}
                                            className={`msm2-card${esSeleccionado ? " selected" : ""}${esInactivo ? " inactive" : ""}`}
                                            onClick={() => !esInactivo && onSeleccionar(motorista)}
                                            style={{ cursor: esInactivo ? "default" : "pointer" }}
                                        >
                                            <div className="msm2-card-inner">
                                                <div className="msm2-card-img">
                                                    <img
                                                        src={ImagenMotoristas + motorista.imagen}
                                                        alt={motorista.nombre}
                                                        onError={e => { e.target.src = ImagenMotoristas + "motorista_default.jpg"; }}
                                                    />
                                                </div>
                                                <div className="msm2-card-info">
                                                    <div className="msm2-card-nombre">{motorista.nombre} {motorista.apellido}</div>
                                                    <div className="msm2-card-licencia">
                                                        <i className="fas fa-id-badge mx-1" style={{ fontSize: ".65rem" }} />
                                                        {motorista.licencia}
                                                    </div>
                                                    <span className={`msm2-card-badge badge ${esInactivo ? "bg-secondary" : "bg-success"}`}>
                                                        {motorista.estado}
                                                    </span>
                                                </div>
                                                <div className="msm2-card-actions">
                                                    {!esInactivo && (
                                                        <button className="msm2-btn-sel" onClick={e => { e.stopPropagation(); onSeleccionar(motorista); }}>
                                                            {esSeleccionado
                                                                ? <><i className="fas fa-check" /><span className="msm2-btn-sel-text mx-1">Seleccionado</span></>
                                                                : <><i className="fas fa-hand-pointer" /><span className="msm2-btn-sel-text mx-1">Seleccionar</span></>
                                                            }
                                                        </button>
                                                    )}
                                                    <button className="msm2-btn-edit" onClick={e => abrirEditar(e, motorista)} title="Editar motorista">
                                                        <i className="fas fa-edit" />
                                                    </button>
                                                    <div onClick={e => e.stopPropagation()}>
                                                        <EliminarMotorista
                                                            datos={motorista}
                                                            token={token}
                                                            setListaMoristas={setListaMotoristas}
                                                            ActualizarLista={ActualizarLista}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ModalFormularioMotorista
                isOpen={modalFormOpen}
                setIsOpen={setModalFormOpen}
                datos={motoristaEditando}
                onGuardado={onMotoristaCreado}
                token={token}
            />
        </>
    );
};


/* ─────────────────────────────────────────────
   SELECTOR DE VEHÍCULOS — inline, solo seleccionar
───────────────────────────────────────────── */
const VehiculoSelectorModalInline = ({ vehiculos = [], vehiculoSeleccionadoId, onSeleccionar, onCerrar }) => {
    const [busqueda, setBusqueda] = useState("");

    const vehiculosFiltrados = vehiculos.filter(v => {
        if (v.estado !== "Activo") return false;
        const texto = `${v.placa} ${v.modelo} ${v.MarcaVehiculo?.nombre || ""}`.toLowerCase();
        return texto.includes(busqueda.toLowerCase());
    });

    return (
        <>
            <style>{`
                .vsi-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1050;display:flex;align-items:flex-end;justify-content:center;padding:0;touch-action:none;}
                @media(min-width:576px){.vsi-overlay{align-items:center;padding:16px;}}
                .vsi-dialog{background:#fff;width:100%;max-width:680px;max-height:92vh;border-radius:18px 18px 0 0;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.18);overflow:hidden;touch-action:auto;}
                @media(min-width:576px){.vsi-dialog{border-radius:14px;max-height:85vh;}}
                .vsi-handle{display:flex;justify-content:center;padding:10px 0 4px;flex-shrink:0;}
                .vsi-handle-bar{width:36px;height:4px;background:#cbd5e1;border-radius:99px;}
                @media(min-width:576px){.vsi-handle{display:none;}}
                .vsi-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#1e293b;color:#fff;flex-shrink:0;}
                .vsi-header h5{margin:0;font-size:.95rem;font-weight:600;display:flex;align-items:center;gap:8px;}
                .vsi-close{background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;opacity:.7;padding:0 4px;}
                .vsi-close:hover{opacity:1;}
                .vsi-toolbar{padding:12px 16px;border-bottom:1px solid #e2e8f0;flex-shrink:0;background:#f8fafc;}
                .vsi-search{position:relative;}
                .vsi-search i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:.82rem;pointer-events:none;}
                .vsi-search input{width:100%;padding:0 12px 0 32px;height:38px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.875rem;color:#374151;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s;}
                .vsi-search input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1);}
                .vsi-count{padding:8px 16px 0;font-size:.73rem;color:#94a3b8;flex-shrink:0;}
                .vsi-body{overflow-y:auto;padding:10px 16px 24px;flex:1;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
                .vsi-card{border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;cursor:pointer;transition:border-color .15s,box-shadow .15s,background .15s;overflow:hidden;}
                .vsi-card:hover{border-color:#93c5fd;box-shadow:0 3px 12px rgba(59,130,246,.11);}
                .vsi-card.selected{border-color:#3b82f6;background:#eff6ff;}
                .vsi-card-inner{display:flex;align-items:center;gap:12px;padding:10px 14px;}
                .vsi-card-img{width:64px;height:50px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;flex-shrink:0;overflow:hidden;}
                .vsi-card-img img{width:100%;height:100%;object-fit:cover;}
                .vsi-card-info{flex:1;min-width:0;}
                .vsi-card-placa{font-weight:800;font-size:.9rem;color:#1e293b;letter-spacing:.04em;}
                .vsi-card-modelo{font-size:.78rem;color:#64748b;}
                .vsi-card-marca{display:inline-flex;align-items:center;gap:5px;font-size:.68rem;font-weight:600;color:#475569;background:#f1f5f9;border-radius:99px;padding:2px 8px;margin-top:3px;}
                .vsi-card-marca img{width:14px;height:14px;object-fit:contain;}
                .vsi-btn-sel{height:34px;padding:0 14px;border-radius:8px;font-size:.8rem;font-weight:600;flex-shrink:0;border:1.5px solid #3b82f6;color:#3b82f6;background:transparent;cursor:pointer;transition:background .15s,color .15s;display:flex;align-items:center;gap:5px;white-space:nowrap;}
                .vsi-btn-sel:hover,.vsi-card.selected .vsi-btn-sel{background:#3b82f6;color:#fff;}
                .vsi-btn-sel-text{display:none;}
                @media(min-width:480px){.vsi-btn-sel-text{display:inline;}}
                .vsi-empty{text-align:center;padding:40px 0;}
                .vsi-empty i{font-size:2.2rem;color:#e2e8f0;display:block;margin-bottom:10px;}
                .vsi-empty span{font-size:.875rem;color:#94a3b8;}
            `}</style>

            <div className="vsi-overlay" onClick={onCerrar}>
                <div className="vsi-dialog" onClick={e => e.stopPropagation()}>
                    <div className="vsi-handle"><div className="vsi-handle-bar" /></div>
                    <div className="vsi-header">
                        <h5><i className="fas fa-truck" /> Seleccionar vehículo</h5>
                        <button className="vsi-close" onClick={onCerrar}>&times;</button>
                    </div>
                    <div className="vsi-toolbar">
                        <div className="vsi-search">
                            <i className="fas fa-search" />
                            <input
                                type="text"
                                placeholder="Buscar por placa, modelo o marca..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </div>
                    <div className="vsi-count">
                        {vehiculosFiltrados.length} vehículo{vehiculosFiltrados.length !== 1 ? "s" : ""} activo{vehiculosFiltrados.length !== 1 ? "s" : ""}
                    </div>
                    <div className="vsi-body">
                        {vehiculosFiltrados.length === 0 ? (
                            <div className="vsi-empty">
                                <i className="fas fa-truck" />
                                <span>No se encontraron vehículos activos</span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2 mt-2">
                                {vehiculosFiltrados.map(vehiculo => {
                                    const esSeleccionado = vehiculoSeleccionadoId === vehiculo.id;
                                    const primeraImg     = vehiculo.ImagenVehiculos?.[0]?.imagen;
                                    const imgMarca       = vehiculo.MarcaVehiculo?.imagen;
                                    const nombreMarca    = vehiculo.MarcaVehiculo?.nombre;
                                    return (
                                        <div
                                            key={vehiculo.id}
                                            className={`vsi-card${esSeleccionado ? " selected" : ""}`}
                                            onClick={() => onSeleccionar(vehiculo)}
                                        >
                                            <div className="vsi-card-inner">
                                                <div className="vsi-card-img">
                                                    <img
                                                        src={primeraImg ? ImagenVehiculos + primeraImg : "/vehiculos.jpg"}
                                                        alt={vehiculo.modelo}
                                                        onError={e => { e.target.src = "/vehiculos.jpg"; }}
                                                    />
                                                </div>
                                                <div className="vsi-card-info">
                                                    <div className="vsi-card-placa">{vehiculo.placa}</div>
                                                    <div className="vsi-card-modelo">{vehiculo.modelo} · {vehiculo.anio}</div>
                                                    {nombreMarca && (
                                                        <div className="vsi-card-marca">
                                                            {imgMarca && (
                                                                <img src={ImagenMarcas + imgMarca} alt={nombreMarca}
                                                                    onError={e => { e.target.style.display = "none"; }} />
                                                            )}
                                                            {nombreMarca}
                                                        </div>
                                                    )}
                                                </div>
                                                <button className="vsi-btn-sel" onClick={e => { e.stopPropagation(); onSeleccionar(vehiculo); }}>
                                                    {esSeleccionado
                                                        ? <><i className="fas fa-check" /><span className="vsi-btn-sel-text mx-1">Seleccionado</span></>
                                                        : <><i className="fas fa-hand-pointer" /><span className="vsi-btn-sel-text mx-1">Seleccionar</span></>
                                                    }
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default NuevoMovimiento;