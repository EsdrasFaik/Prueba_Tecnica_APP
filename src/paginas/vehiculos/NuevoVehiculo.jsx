import { useEffect, useState } from "react";
import {
    mostraAlertaError,
    mostraAlertaOk,
    mostraAlertaWarning,
} from "../../componentes/alerts/sweetAlert";
import { AxiosImagen } from "../../componentes/axios/Axios";
import Card from "../../componentes/contenedores/Card";
import Dropzone from "../../componentes/imagenes/Dropzone";
import Page from "../../componentes/plantilla/Page";
import { ModalFormularioMarca } from "../marcas/ModalMarcaVehiculo";
import EliminarMarcaVehiculo from "../marcas/EliminarMarcaVehiculo";
import {
    VehiculosGuardar,
    MarcasListar,
    ImagenMarcas,
} from "../../configuracion/apiUrls";
import { regexNombre, regexEntero } from "../../configuracion/validaciones";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";


const NuevoVehiculo = () => {
    const { token, ActualizarLista } = useContextUsuario();

    const [formulario, setFormulario] = useState({
        placa: "",
        modelo: "",
        anio: "",
        marcaId: null,
        estado: "Activo",
    });

    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    const [dropzoneKey, setDropzoneKey] = useState(Date.now());

    const [listaMarcas, setListaMarcas] = useState([]);
    const [nombreMarcaSeleccionada, setNombreMarcaSeleccionada] = useState("");
    const [modalMarcaOpen, setModalMarcaOpen] = useState(false);

    const [errorPlaca, setErrorPlaca] = useState(false);
    const [errorModelo, setErrorModelo] = useState(false);
    const [errorAnio, setErrorAnio] = useState(false);
    const [errorMarca, setErrorMarca] = useState(false);

    const pageDatos = {
        titulo: {
            titulo: "Nuevo vehículo",
            url: "/app/admin/vehiculos",
            tituloUrl: "vehículos",
            nombreUrl: "nuevo",
        },
    };

    useEffect(() => {
        ActualizarLista(MarcasListar, setListaMarcas);
    }, []);

  
    useEffect(() => {
        if (modalMarcaOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [modalMarcaOpen]);

    useEffect(() => { setErrorPlaca(!regexNombre.test(formulario.placa)); }, [formulario.placa]);
    useEffect(() => { setErrorModelo(!regexNombre.test(formulario.modelo)); }, [formulario.modelo]);
    useEffect(() => {
        const anio = parseInt(formulario.anio, 10);
        setErrorAnio(!regexEntero.test(formulario.anio) || anio < 1900 || anio > new Date().getFullYear() + 1);
    }, [formulario.anio]);
    useEffect(() => { setErrorMarca(!formulario.marcaId); }, [formulario.marcaId]);

    const manejador = (e) => {
        const { name, value, type, checked } = e.target;
        setFormulario(prev => ({
            ...prev,
            [name]: type === "checkbox" ? (checked ? "Activo" : "Inactivo") : value,
        }));
    };

    const handleMarcaSeleccionada = (marca) => {
        setFormulario(prev => ({ ...prev, marcaId: marca.id }));
        setNombreMarcaSeleccionada(marca.nombre);
        setModalMarcaOpen(false);
    };

    const validar = () => {
        if (errorPlaca || errorModelo || errorAnio || errorMarca) {
            mostraAlertaError("Existen errores en el formulario. Por favor corrígelos.", "Error");
            return false;
        }
        if (!formulario.placa.trim()) { mostraAlertaWarning("La placa es obligatoria."); return false; }
        if (!formulario.modelo.trim()) { mostraAlertaWarning("El modelo es obligatorio."); return false; }
        if (!formulario.anio) { mostraAlertaWarning("El año es obligatorio."); return false; }
        if (!formulario.marcaId) { mostraAlertaWarning("Debe seleccionar una marca."); return false; }
        if (nuevasImagenes.length === 0) {
            mostraAlertaWarning("Debe adjuntar al menos una imagen del vehículo.");
            return false;
        }
        return true;
    };

    const guardarVehiculo = async () => {
        if (!validar()) return;

        const formData = new FormData();
        nuevasImagenes.forEach(file => formData.append("imagenes", file));
        formData.append("placa", formulario.placa);
        formData.append("modelo", formulario.modelo);
        formData.append("anio", formulario.anio);
        formData.append("marcaId", formulario.marcaId);
        formData.append("estado", formulario.estado);

        try {
            AxiosImagen.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await AxiosImagen.post(VehiculosGuardar, formData);
            mostraAlertaOk("Vehículo guardado correctamente.");
            limpiar();
        } catch (error) {
            const msg = error.response?.data?.error || "Error al guardar el vehículo.";
            mostraAlertaError(msg, "Error");
        }
    };

    const limpiar = () => {
        setFormulario({ placa: "", modelo: "", anio: "", marcaId: null, estado: "Activo" });
        setNuevasImagenes([]);
        setDropzoneKey(Date.now());
        setNombreMarcaSeleccionada("");
        setErrorPlaca(false);
        setErrorModelo(false);
        setErrorAnio(false);
        setErrorMarca(false);
    };

    const refrescarMarcas = () => ActualizarLista(MarcasListar, setListaMarcas);

    const BotonGuardar = () => (
        <>
            <button type="button" className="btn btn-success mr-3" onClick={guardarVehiculo}>
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
                    <Card titulo="Datos del vehículo" pie={<BotonGuardar />}>
                        <form onSubmit={e => e.preventDefault()}>

                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="placa">Placa</label>
                                        <input
                                            type="text"
                                            id="placa"
                                            name="placa"
                                            className={`form-control ${errorPlaca ? "is-invalid" : ""}`}
                                            placeholder="Ej: ABC-1234"
                                            value={formulario.placa}
                                            onChange={manejador}
                                        />
                                        {errorPlaca && <div className="invalid-feedback">Ingrese una placa válida (mín. 3 caracteres).</div>}
                                    </div>
                                </div>
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="modelo">Modelo</label>
                                        <input
                                            type="text"
                                            id="modelo"
                                            name="modelo"
                                            className={`form-control ${errorModelo ? "is-invalid" : ""}`}
                                            placeholder="Ej: Corolla, Hilux..."
                                            value={formulario.modelo}
                                            onChange={manejador}
                                        />
                                        {errorModelo && <div className="invalid-feedback">Ingrese un modelo válido (mín. 3 caracteres).</div>}
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="anio">Año</label>
                                        <input
                                            type="number"
                                            id="anio"
                                            name="anio"
                                            className={`form-control ${errorAnio ? "is-invalid" : ""}`}
                                            placeholder={`Ej: ${new Date().getFullYear()}`}
                                            value={formulario.anio}
                                            onChange={manejador}
                                            min="1900"
                                            max={new Date().getFullYear() + 1}
                                        />
                                        {errorAnio && <div className="invalid-feedback">Ingrese un año válido.</div>}
                                    </div>
                                </div>

                                <div className="col-md-6 col-sm-12">
                                    <div className="form-group">
                                        <label>Marca</label>
                                        <div className="input-group">
                                            <input
                                                type="text"
                                                className={`form-control ${errorMarca ? "is-invalid" : ""}`}
                                                value={nombreMarcaSeleccionada || "Ninguna marca seleccionada"}
                                                readOnly
                                            />
                                            <div className="input-group-append">
                                                <button
                                                    className="btn btn-outline-primary"
                                                    type="button"
                                                    onClick={() => setModalMarcaOpen(true)}
                                                >
                                                    <i className="fas fa-search" />
                                                </button>
                                            </div>
                                            {errorMarca && (
                                                <div className="invalid-feedback" style={{ display: "block" }}>
                                                    Debe seleccionar una marca.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-4 col-sm-12">
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <div className="custom-control custom-switch custom-switch-off-danger custom-switch-on-success">
                                            <input
                                                type="checkbox"
                                                className="custom-control-input"
                                                id="estadoSwitch"
                                                name="estado"
                                                checked={formulario.estado === "Activo"}
                                                onChange={manejador}
                                            />
                                            <label className="custom-control-label" htmlFor="estadoSwitch">
                                                {formulario.estado}
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <h5 className="mt-4">Imágenes del vehículo</h5>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="form-group">
                                        <label>Añadir imágenes</label>
                                        <Dropzone
                                            key={dropzoneKey}
                                            max={5}
                                            files={nuevasImagenes}
                                            setFiles={setNuevasImagenes}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>

            {modalMarcaOpen && (
                <MarcaSelectorModal
                    marcas={listaMarcas}
                    setListaMarcas={setListaMarcas}
                    marcaSeleccionadaId={formulario.marcaId}
                    onSeleccionar={handleMarcaSeleccionada}
                    onCerrar={() => setModalMarcaOpen(false)}
                    token={token}
                    onMarcaCreada={refrescarMarcas}
                    ActualizarLista={ActualizarLista}
                />
            )}
        </Page>
    );
};


const MarcaSelectorModal = ({
    marcas, setListaMarcas, marcaSeleccionadaId,
    onSeleccionar, onCerrar, token, onMarcaCreada, ActualizarLista
}) => {
    const [busqueda, setBusqueda] = useState("");
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [marcaEditando, setMarcaEditando] = useState(null);

    const abrirEditar = (e, marca) => {
        e.stopPropagation();
        setMarcaEditando(marca);
        setModalFormOpen(true);
    };

    const abrirCrear = () => {
        setMarcaEditando(null);
        setModalFormOpen(true);
    };

    const marcasFiltradas = marcas.filter(m => {
        const coincideEstado = mostrarInactivos ? m.estado === "Inactivo" : m.estado === "Activo";
        const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideEstado && coincideBusqueda;
    });

    return (
        <>
            <style>{`
                .msm-overlay {
                    position: fixed; inset: 0;
                    background: rgba(0,0,0,.5);
                    z-index: 1050;
                    display: flex;
                    align-items: flex-end;
                    justify-content: center;
                    padding: 0;
                    /* evita que el touch en el overlay haga scroll al fondo */
                    touch-action: none;
                }
                @media (min-width: 576px) {
                    .msm-overlay {
                        align-items: center;
                        padding: 16px;
                    }
                }

                .msm-dialog {
                    background: #fff;
                    width: 100%;
                    max-width: 680px;
                    max-height: 92vh;
                    border-radius: 18px 18px 0 0;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 -8px 40px rgba(0,0,0,.18);
                    overflow: hidden;
                    /* permite el scroll SOLO dentro del diálogo */
                    touch-action: auto;
                }
                @media (min-width: 576px) {
                    .msm-dialog {
                        border-radius: 14px;
                        max-height: 85vh;
                        box-shadow: 0 20px 60px rgba(0,0,0,.22);
                    }
                }

                /* Tirador mobile */
                .msm-handle {
                    display: flex;
                    justify-content: center;
                    padding: 10px 0 4px;
                    flex-shrink: 0;
                    background: #fff;
                }
                .msm-handle-bar {
                    width: 36px; height: 4px;
                    background: #cbd5e1; border-radius: 99px;
                }
                @media (min-width: 576px) {
                    .msm-handle { display: none; }
                }

                /* Header */
                .msm-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 16px;
                    background: #1e293b;
                    color: #fff;
                    flex-shrink: 0;
                }
                @media (min-width: 576px) {
                    .msm-header { padding: 15px 20px; }
                }
                .msm-header h5 {
                    margin: 0; font-size: .95rem; font-weight: 600;
                    display: flex; align-items: center; gap: 8px;
                }
                .msm-close {
                    background: none; border: none; color: #fff;
                    font-size: 1.4rem; line-height: 1; cursor: pointer;
                    opacity: .7; transition: opacity .2s; padding: 0 4px;
                }
                .msm-close:hover { opacity: 1; }

                /* Toolbar */
                .msm-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 14px;
                    border-bottom: 1px solid #e2e8f0;
                    flex-shrink: 0;
                    background: #f8fafc;
                    flex-wrap: wrap;
                }
                @media (min-width: 576px) {
                    .msm-toolbar { padding: 12px 20px; flex-wrap: nowrap; }
                }
                .msm-search {
                    flex: 1; min-width: 0; position: relative; width: 100%;
                }
                @media (min-width: 576px) { .msm-search { width: auto; } }
                .msm-search i {
                    position: absolute; left: 10px; top: 50%;
                    transform: translateY(-50%);
                    color: #94a3b8; font-size: .82rem; pointer-events: none;
                }
                .msm-search input {
                    width: 100%; padding: 0 12px 0 32px; height: 38px;
                    border: 1.5px solid #e2e8f0; border-radius: 8px;
                    font-size: .875rem; color: #374151; background: #fff;
                    outline: none; transition: border-color .2s, box-shadow .2s;
                }
                .msm-search input:focus {
                    border-color: #3b82f6;
                    box-shadow: 0 0 0 3px rgba(59,130,246,.1);
                }
                .msm-toolbar-row2 {
                    display: flex; align-items: center;
                    justify-content: space-between;
                    width: 100%; gap: 8px;
                }
                @media (min-width: 576px) {
                    .msm-toolbar-row2 { width: auto; display: contents; }
                }

                /* Toggle */
                .msm-toggle-wrap {
                    display: flex; align-items: center; gap: 7px;
                    white-space: nowrap; font-size: .82rem; color: #64748b;
                    font-weight: 600; user-select: none; cursor: pointer; margin: 0;
                }
                .msm-toggle-pill { position: relative; width: 38px; height: 20px; flex-shrink: 0; }
                .msm-toggle-pill input { display: none; }
                .msm-toggle-track {
                    position: absolute; inset: 0; background: #cbd5e1;
                    border-radius: 99px; cursor: pointer; transition: background .2s;
                }
                .msm-toggle-pill input:checked + .msm-toggle-track { background: #64748b; }
                .msm-toggle-track::after {
                    content: ''; position: absolute; top: 2px; left: 2px;
                    width: 16px; height: 16px; background: #fff; border-radius: 50%;
                    transition: transform .2s; box-shadow: 0 1px 3px rgba(0,0,0,.2);
                }
                .msm-toggle-pill input:checked + .msm-toggle-track::after { transform: translateX(18px); }

                .msm-btn-nueva {
                    height: 38px; padding: 0 14px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: #fff; border: none; border-radius: 8px;
                    font-size: .82rem; font-weight: 600; white-space: nowrap;
                    cursor: pointer; display: flex; align-items: center; gap: 5px;
                    transition: opacity .2s;
                }
                .msm-btn-nueva:hover { opacity: .88; }

                /* Contador */
                .msm-count {
                    padding: 8px 16px 0; font-size: .73rem;
                    color: #94a3b8; flex-shrink: 0;
                }
                @media (min-width: 576px) { .msm-count { padding: 8px 20px 0; } }

                /* Body — único elemento con scroll, contenido al toque */
                .msm-body {
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 10px 14px 32px;
                    flex: 1;
                    -webkit-overflow-scrolling: touch;
                    overscroll-behavior: contain;   /* evita que el scroll se propague al body */
                }
                @media (min-width: 576px) { .msm-body { padding: 10px 20px 20px; } }

                /* Tarjeta */
                .msm-card {
                    border-radius: 10px; border: 1.5px solid #e2e8f0;
                    background: #fff;
                    transition: border-color .15s, box-shadow .15s, background .15s;
                    overflow: hidden;
                }
                .msm-card:not(.inactive):hover {
                    border-color: #93c5fd;
                    box-shadow: 0 3px 12px rgba(59,130,246,.11);
                }
                .msm-card.selected { border-color: #3b82f6; background: #eff6ff; }
                .msm-card.inactive { background: #f8fafc; opacity: .82; }

                .msm-card-inner {
                    display: flex; align-items: center; gap: 10px; padding: 10px 12px;
                }

                .msm-card-img {
                    width: 44px; height: 44px; border-radius: 8px;
                    background: #f1f5f9; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; overflow: hidden;
                }
                .msm-card-img img { width: 100%; height: 100%; object-fit: contain; padding: 4px; }

                .msm-card-info { flex: 1; min-width: 0; }
                .msm-card-nombre {
                    font-weight: 700; font-size: .875rem; color: #1e293b;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .msm-card-badge {
                    font-size: .62rem; font-weight: 600;
                    padding: 1px 7px; border-radius: 99px;
                }

                .msm-card-actions {
                    display: flex; align-items: center; gap: 4px; flex-shrink: 0;
                }
                .msm-btn-sel-text { display: none; }
                @media (min-width: 480px) { .msm-btn-sel-text { display: inline; } }

                .msm-btn-sel {
                    height: 32px; padding: 0 10px; border-radius: 7px;
                    font-size: .78rem; font-weight: 600;
                    border: 1.5px solid #3b82f6; color: #3b82f6;
                    background: transparent; cursor: pointer;
                    transition: background .15s, color .15s; white-space: nowrap;
                    display: flex; align-items: center; gap: 4px;
                }
                .msm-btn-sel:hover, .msm-card.selected .msm-btn-sel {
                    background: #3b82f6; color: #fff;
                }
                .msm-btn-edit {
                    height: 32px; width: 32px; border-radius: 7px;
                    border: 1.5px solid #fde68a; background: #fef3c7; color: #b45309;
                    cursor: pointer; transition: background .15s;
                    display: flex; align-items: center; justify-content: center;
                }
                .msm-btn-edit:hover { background: #fde68a; }

                /* Eliminar usa el botón interno del componente — solo ajustamos tamaño */
                .msm-card-actions .btn-danger {
                    height: 32px; width: 32px; padding: 0;
                    border-radius: 7px;
                    display: flex; align-items: center; justify-content: center;
                    font-size: .8rem;
                }

                .msm-empty { text-align: center; padding: 36px 0; }
                .msm-empty i { font-size: 2.2rem; color: #e2e8f0; display: block; margin-bottom: 10px; }
                .msm-empty span { font-size: .875rem; color: #94a3b8; }
            `}</style>

            <div
                className="msm-overlay"
                onClick={onCerrar}
            >
                <div
                    className="msm-dialog"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Tirador mobile */}
                    <div className="msm-handle">
                        <div className="msm-handle-bar" />
                    </div>

                    {/* Header */}
                    <div className="msm-header">
                        <h5><i className="fas fa-tag" /> Seleccionar marca</h5>
                        <button className="msm-close" onClick={onCerrar}>&times;</button>
                    </div>

                    {/* Toolbar */}
                    <div className="msm-toolbar">
                        <div className="msm-search">
                            <i className="fas fa-search" />
                            <input
                                type="text"
                                placeholder="Buscar marca por nombre..."
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="msm-toolbar-row2">
                            <label className="msm-toggle-wrap">
                                <div className="msm-toggle-pill">
                                    <input
                                        type="checkbox"
                                        checked={mostrarInactivos}
                                        onChange={e => setMostrarInactivos(e.target.checked)}
                                    />
                                    <span className="msm-toggle-track" />
                                </div>
                                Inactivos
                            </label>
                            <button className="msm-btn-nueva" onClick={abrirCrear}>
                                <i className="fas fa-plus" /> Nueva marca
                            </button>
                        </div>
                    </div>

                    {/* Contador */}
                    <div className="msm-count">
                        {marcasFiltradas.length} marca{marcasFiltradas.length !== 1 ? "s" : ""}{" "}
                        {mostrarInactivos ? "inactiva(s)" : "activa(s)"}
                    </div>

                    {/* Lista — único contenedor con scroll */}
                    <div className="msm-body">
                        {marcasFiltradas.length === 0 ? (
                            <div className="msm-empty">
                                <i className="fas fa-tag" />
                                <span>No hay marcas {mostrarInactivos ? "inactivas" : "activas"} registradas</span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2 mt-2">
                                {marcasFiltradas.map(marca => {
                                    const esInactiva = marca.estado === "Inactivo";
                                    const esSeleccionada = marcaSeleccionadaId === marca.id;
                                    return (
                                        <div
                                            key={marca.id}
                                            className={`msm-card${esSeleccionada ? " selected" : ""}${esInactiva ? " inactive" : ""}`}
                                            onClick={() => !esInactiva && onSeleccionar(marca)}
                                            style={{ cursor: esInactiva ? "default" : "pointer" }}
                                        >
                                            <div className="msm-card-inner">
                                                <div className="msm-card-img">
                                                    <img
                                                        src={ImagenMarcas + marca.imagen}
                                                        alt={marca.nombre}
                                                        onError={e => { e.target.src = ImagenMarcas + "marca_default.jpeg"; }}
                                                    />
                                                </div>

                                                <div className="msm-card-info">
                                                    <div className="msm-card-nombre">{marca.nombre}</div>
                                                    <span className={`msm-card-badge badge ${esInactiva ? "bg-secondary" : "bg-success"}`}>
                                                        {marca.estado}
                                                    </span>
                                                </div>

                                                <div className="msm-card-actions">
                                                    {!esInactiva && (
                                                        <button
                                                            className="msm-btn-sel"
                                                            onClick={e => { e.stopPropagation(); onSeleccionar(marca); }}
                                                        >
                                                            {esSeleccionada
                                                                ? <><i className="fas fa-check" /><span className="msm-btn-sel-text mx-1">Seleccionada</span></>
                                                                : <><i className="fas fa-hand-pointer" /><span className="msm-btn-sel-text mx-1">Seleccionar</span></>
                                                            }
                                                        </button>
                                                    )}
                                                    <button
                                                        className="msm-btn-edit"
                                                        onClick={e => abrirEditar(e, marca)}
                                                        title="Editar marca"
                                                    >
                                                        <i className="fas fa-edit" />
                                                    </button>

                                                    {/* Componente oficial de eliminación */}
                                                    <div onClick={e => e.stopPropagation()}>
                                                        <EliminarMarcaVehiculo
                                                            datos={marca}
                                                            token={token}
                                                            setListaMarcas={setListaMarcas}
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

            {/* Modal crear / editar */}
            <ModalFormularioMarca
                isOpen={modalFormOpen}
                setIsOpen={setModalFormOpen}
                datos={marcaEditando}
                onGuardado={onMarcaCreada}
                token={token}
            />
        </>
    );
};

export default NuevoVehiculo;