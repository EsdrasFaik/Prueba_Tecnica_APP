import { useEffect, useState } from "react";
import {
    mostraAlertaError,
    mostraAlertaOk,
    mostraAlertaWarning,
} from "../../componentes/alerts/sweetAlert";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import Dropzone from "../../componentes/imagenes/Dropzone";
import ModalButtonLess from "../../componentes/modal/ModalButtonLess";
import EliminarMotorista from "./EliminarMotorista";
import {
    ImagenMotoristas,
    MotoristasEditar,
    MotoristasGuardar,
    MotoristasListar,
} from "../../configuracion/apiUrls";
import { regexNombre } from "../../configuracion/validaciones";

export const ModalFormularioMotorista = ({ isOpen, setIsOpen, datos, onGuardado, token }) => {
    const esEdicion = !!datos;

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [licencia, setLicencia] = useState("");
    const [estado, setEstado] = useState("Activo");
    const [imagen, setImagen] = useState(null);

    const [errorNombre, setErrorNombre] = useState(false);
    const [errorApellido, setErrorApellido] = useState(false);
    const [errorLicencia, setErrorLicencia] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setNombre(datos?.nombre || "");
            setApellido(datos?.apellido || "");
            setLicencia(datos?.licencia || "");
            setEstado(datos?.estado || "Activo");
            setImagen(null);
            setErrorNombre(false);
            setErrorApellido(false);
            setErrorLicencia(false);
        }
    }, [isOpen, datos]);

    useEffect(() => { setErrorNombre(nombre.length > 0 && !regexNombre.test(nombre)); }, [nombre]);
    useEffect(() => { setErrorApellido(apellido.length > 0 && !regexNombre.test(apellido)); }, [apellido]);
    useEffect(() => { setErrorLicencia(licencia.length > 0 && licencia.trim().length < 3); }, [licencia]);

    const handleGuardar = async () => {
        if (!nombre || !apellido || !licencia || errorNombre || errorApellido || errorLicencia)
            return mostraAlertaWarning("Por favor, corrige los errores en el formulario.");

        const formData = new FormData();
        formData.append("nombre", nombre);
        formData.append("apellido", apellido);
        formData.append("licencia", licencia);
        formData.append("estado", estado);
        if (imagen) formData.append("imagen", Array.isArray(imagen) ? imagen[0] : imagen);

        try {
            AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            const config = { headers: { "Content-Type": "multipart/form-data" } };
            if (esEdicion) {
                await AxiosPrivado.put(MotoristasEditar + datos.id, formData, config);
                mostraAlertaOk("Motorista actualizado correctamente");
            } else {
                await AxiosPrivado.post(MotoristasGuardar, formData, config);
                mostraAlertaOk("Motorista guardado correctamente");
            }
            setIsOpen(false);
            onGuardado();
        } catch (error) {
            mostraAlertaError(error.response?.data?.error || "Error en la petición");
        }
    };

    return (
        <>
            <style>{`
                .mmot-label {
                    font-size: 0.78rem; font-weight: 700;
                    text-transform: uppercase; letter-spacing: 0.06em;
                    color: #64748b; margin-bottom: 6px;
                }
                .mmot-img-preview {
                    display: flex; align-items: center; gap: 14px;
                    padding: 12px 16px; background: #f8fafc;
                    border: 1px dashed #cbd5e1; border-radius: 10px;
                }
                .mmot-img-preview img {
                    width: 52px; height: 52px; object-fit: cover;
                    border-radius: 50%; border: 2px solid #e2e8f0; background: #fff;
                }
                .mmot-estado-row {
                    display: flex; align-items: center; gap: 12px;
                    padding: 10px 14px; background: #f8fafc;
                    border: 1px solid #e2e8f0; border-radius: 10px;
                }
                .mmot-toggle { position: relative; width: 44px; height: 23px; flex-shrink: 0; }
                .mmot-toggle input { display: none; }
                .mmot-toggle-track {
                    position: absolute; inset: 0; background: #cbd5e1;
                    border-radius: 99px; cursor: pointer; transition: background .2s;
                }
                .mmot-toggle input:checked + .mmot-toggle-track { background: #22c55e; }
                .mmot-toggle-track::after {
                    content: ''; position: absolute; top: 3px; left: 3px;
                    width: 17px; height: 17px; background: #fff; border-radius: 50%;
                    transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
                }
                .mmot-toggle input:checked + .mmot-toggle-track::after { transform: translateX(21px); }
                .mmot-btn-save {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    border: none; color: #fff; padding: 9px 26px;
                    border-radius: 9px; font-weight: 600; font-size: 0.875rem;
                    cursor: pointer; transition: opacity .2s, transform .1s;
                }
                .mmot-btn-save:hover { opacity: .9; transform: translateY(-1px); }
                .mmot-btn-save.editar { background: linear-gradient(135deg, #f59e0b, #d97706); }
            `}</style>

            <ModalButtonLess
                titulo={esEdicion ? `Editando: ${datos?.nombre} ${datos?.apellido}` : "Nuevo motorista"}
                modalIsOpen={isOpen}
                setModalIsOpen={setIsOpen}
                size="md"
                pie={
                    <div className="d-flex justify-content-end gap-2">
                        <button className={`mmot-btn-save btn ${esEdicion ? "editar" : ""}`} onClick={handleGuardar}>
                            <i className={`fas ${esEdicion ? "fa-pen" : "fa-save"} mx-1`} />
                            {esEdicion ? "Actualizar" : "Guardar"}
                        </button>
                    </div>
                }
            >
                <div className="d-flex flex-column gap-3">
                    {/* Nombre y Apellido */}
                    <div className="row g-2">
                        <div className="col-6">
                            <div className="mmot-label">Nombre</div>
                            <input
                                type="text"
                                className={`form-control ${errorNombre ? "is-invalid" : ""}`}
                                placeholder="Ej: Juan"
                                value={nombre}
                                onChange={e => setNombre(e.target.value)}
                            />
                            {errorNombre && <div className="invalid-feedback">Mínimo 3 caracteres.</div>}
                        </div>
                        <div className="col-6">
                            <div className="mmot-label">Apellido</div>
                            <input
                                type="text"
                                className={`form-control ${errorApellido ? "is-invalid" : ""}`}
                                placeholder="Ej: Pérez"
                                value={apellido}
                                onChange={e => setApellido(e.target.value)}
                            />
                            {errorApellido && <div className="invalid-feedback">Mínimo 3 caracteres.</div>}
                        </div>
                    </div>

                    {/* Licencia */}
                    <div>
                        <div className="mmot-label">Licencia</div>
                        <input
                            type="text"
                            className={`form-control ${errorLicencia ? "is-invalid" : ""}`}
                            placeholder="Ej: 0801-1990-12345"
                            value={licencia}
                            onChange={e => setLicencia(e.target.value)}
                        />
                        {errorLicencia && <div className="invalid-feedback">Ingrese un número de licencia válido.</div>}
                    </div>

                    {/* Imagen actual (solo edición) */}
                    {esEdicion && datos?.imagen && (
                        <div>
                            <div className="mmot-label">Imagen actual</div>
                            <div className="mmot-img-preview">
                                <img
                                    src={ImagenMotoristas + datos.imagen}
                                    alt={datos.nombre}
                                    onError={e => { e.target.src = ImagenMotoristas + "motorista_default.jpg"; }}
                                />
                                <span className="text-muted small">{datos.imagen}</span>
                            </div>
                        </div>
                    )}

                    {/* Dropzone imagen */}
                    <div>
                        <div className="mmot-label">{esEdicion ? "Nueva imagen (opcional)" : "Imagen"}</div>
                        <Dropzone max={1} files={imagen} setFiles={setImagen} />
                    </div>

                    {/* Estado */}
                    <div>
                        <div className="mmot-label">Estado</div>
                        <div className="mmot-estado-row">
                            <label className="mmot-toggle">
                                <input
                                    type="checkbox"
                                    checked={estado === "Activo"}
                                    onChange={e => setEstado(e.target.checked ? "Activo" : "Inactivo")}
                                />
                                <span className="mmot-toggle-track" />
                            </label>
                            <span className="fw-semibold" style={{ color: estado === "Activo" ? "#16a34a" : "#94a3b8" }}>
                                {estado}
                            </span>
                        </div>
                    </div>
                </div>
            </ModalButtonLess>
        </>
    );
};

/* ─────────────────────────────────────────────
   GALERÍA DE MOTORISTAS — renderizado directo
───────────────────────────────────────────── */
const ModalMotorista = ({ token, listaMotoristas = [], setListaMotoristas, ActualizarLista }) => {
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [motoristaSeleccionado, setMotoristaSeleccionado] = useState(null);

    useEffect(() => {
        ActualizarLista(MotoristasListar, setListaMotoristas);
    }, []);

    const refrescar = () => ActualizarLista(MotoristasListar, setListaMotoristas);
    const abrirCrear  = () => { setMotoristaSeleccionado(null); setModalFormOpen(true); };
    const abrirEditar = (m) => { setMotoristaSeleccionado(m);   setModalFormOpen(true); };

    const motoristasFiltrados = listaMotoristas.filter(m => {
        const nombre = `${m.nombre} ${m.apellido}`.toLowerCase();
        const coincideBusqueda = nombre.includes(busqueda.toLowerCase()) || m.licencia.toLowerCase().includes(busqueda.toLowerCase());
        const coincideEstado   = mostrarInactivos ? m.estado === "Inactivo" : m.estado === "Activo";
        return coincideBusqueda && coincideEstado;
    });

    return (
        <>
            <style>{`
                .gmo-toolbar {
                    display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
                    padding-bottom: 14px; border-bottom: 1px solid #e2e8f0; margin-bottom: 14px;
                }
                .gmo-search { flex: 1; min-width: 140px; position: relative; }
                .gmo-search i {
                    position: absolute; left: 10px; top: 50%;
                    transform: translateY(-50%); color: #94a3b8; font-size: .82rem; pointer-events: none;
                }
                .gmo-search input {
                    width: 100%; padding: 0 12px 0 32px; height: 36px;
                    border: 1.5px solid #e2e8f0; border-radius: 8px;
                    font-size: .85rem; color: #374151; background: #fff; outline: none;
                    transition: border-color .2s, box-shadow .2s;
                }
                .gmo-search input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
                .gmo-select {
                    height: 36px; border: 1.5px solid #e2e8f0; border-radius: 8px;
                    font-size: .85rem; padding: 0 10px; color: #374151;
                    background: #fff; cursor: pointer; outline: none; transition: border-color .2s;
                }
                .gmo-select:focus { border-color: #3b82f6; }
                .gmo-btn-nuevo {
                    height: 36px; padding: 0 16px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #fff; border: none; border-radius: 8px;
                    font-size: .85rem; font-weight: 600; white-space: nowrap;
                    cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity .2s;
                }
                .gmo-btn-nuevo:hover { opacity: .88; }
                .gmo-count { font-size: .75rem; color: #94a3b8; margin-bottom: 12px; }
                .gmo-card {
                    border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff;
                    overflow: hidden; transition: box-shadow .2s, transform .15s;
                }
                .gmo-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.09); transform: translateY(-2px); }
                .gmo-card-img {
                    background: #f8fafc; display: flex; align-items: center;
                    justify-content: center; padding: 16px 0 10px; border-bottom: 1px solid #f1f5f9;
                }
                .gmo-card-img img {
                    width: 64px; height: 64px; object-fit: cover;
                    border-radius: 50%; border: 2px solid #e2e8f0; background: #fff;
                    box-shadow: 0 2px 8px rgba(0,0,0,.08);
                }
                .gmo-card-body { padding: 10px 12px 12px; }
                .gmo-card-nombre {
                    font-size: .875rem; font-weight: 700; color: #1e293b;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px;
                }
                .gmo-card-licencia {
                    font-size: .72rem; color: #64748b; margin-bottom: 4px;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .gmo-badge { font-size: .65rem; font-weight: 600; letter-spacing: .04em; padding: 2px 8px; border-radius: 99px; }
                .gmo-card-actions {
                    display: flex; gap: 5px; margin-top: 10px;
                    padding-top: 8px; border-top: 1px solid #f1f5f9;
                }
                .gmo-btn-editar {
                    flex: 1; background: #fef3c7; color: #b45309; border: 1px solid #fde68a;
                    border-radius: 7px; font-size: .75rem; font-weight: 600; padding: 5px 0;
                    cursor: pointer; transition: background .15s;
                }
                .gmo-btn-editar:hover { background: #fde68a; }
                .gmo-empty { text-align: center; padding: 40px 0; }
                .gmo-empty i { font-size: 2.4rem; color: #e2e8f0; display: block; margin-bottom: 10px; }
                .gmo-empty span { font-size: .875rem; color: #94a3b8; }
            `}</style>

            <div className="gmo-toolbar">
                <div className="gmo-search">
                    <i className="fas fa-search" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o licencia..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>
                <select
                    className="gmo-select"
                    value={mostrarInactivos ? "Inactivo" : "Activo"}
                    onChange={e => setMostrarInactivos(e.target.value === "Inactivo")}
                >
                    <option value="Activo">Activos</option>
                    <option value="Inactivo">Inactivos</option>
                </select>
                <button className="gmo-btn-nuevo" onClick={abrirCrear}>
                    <i className="fas fa-plus" /> Nuevo motorista
                </button>
            </div>

            <div className="gmo-count">
                {motoristasFiltrados.length} motorista{motoristasFiltrados.length !== 1 ? "s" : ""}{" "}
                {mostrarInactivos ? "inactivo(s)" : "activo(s)"}
            </div>

            {motoristasFiltrados.length === 0 ? (
                <div className="gmo-empty">
                    <i className="fas fa-id-card" />
                    <span>No hay motoristas {mostrarInactivos ? "inactivos" : "activos"} registrados</span>
                </div>
            ) : (
                <div className="row g-3">
                    {motoristasFiltrados.map(motorista => (
                        <div className="col-6 col-sm-4 col-md-3" key={motorista.id}>
                            <div className="gmo-card">
                                <div className="gmo-card-img">
                                    <img
                                        src={ImagenMotoristas + motorista.imagen}
                                        alt={motorista.nombre}
                                        onError={e => { e.target.src = ImagenMotoristas + "motorista_default.jpg"; }}
                                    />
                                </div>
                                <div className="gmo-card-body">
                                    <div className="gmo-card-nombre" title={`${motorista.nombre} ${motorista.apellido}`}>
                                        {motorista.nombre} {motorista.apellido}
                                    </div>
                                    <div className="gmo-card-licencia" title={motorista.licencia}>
                                        <i className="fas fa-id-badge me-1" style={{ fontSize: ".65rem" }} />
                                        {motorista.licencia}
                                    </div>
                                    <span className={`gmo-badge badge ${motorista.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                                        {motorista.estado}
                                    </span>
                                    <div className="gmo-card-actions">
                                        <button className="gmo-btn-editar" onClick={() => abrirEditar(motorista)}>
                                            <i className="fas fa-edit me-1" /> Editar
                                        </button>
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
                    ))}
                </div>
            )}

            <ModalFormularioMotorista
                isOpen={modalFormOpen}
                setIsOpen={setModalFormOpen}
                datos={motoristaSeleccionado}
                onGuardado={refrescar}
                token={token}
            />
        </>
    );
};

export default ModalMotorista;