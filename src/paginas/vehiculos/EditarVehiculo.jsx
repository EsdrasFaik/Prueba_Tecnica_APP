import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    mostraAlertaError,
    mostraAlertaOk,
    mostraAlertaWarning,
} from "../../componentes/alerts/sweetAlert";
import { AxiosImagen, AxiosPrivado } from "../../componentes/axios/Axios";
import Card from "../../componentes/contenedores/Card";
import Dropzone from "../../componentes/imagenes/Dropzone";
import Page from "../../componentes/plantilla/Page";
import { ModalFormularioMarca } from "../marcas/ModalMarcaVehiculo";
import EliminarMarcaVehiculo from "../marcas/EliminarMarcaVehiculo";
import {
    VehiculosBuscar,
    VehiculosEditar,
    MarcasListar,
    ImagenMarcas,
    ImagenVehiculos,
} from "../../configuracion/apiUrls";
import { regexNombre, regexEntero } from "../../configuracion/validaciones";
import { useContextUsuario } from "../../contexto/usuario/UsuarioContext";


const EditarVehiculo = () => {
    const { token, ActualizarLista } = useContextUsuario();
    const navigate = useNavigate();

    const location = useLocation();
    const vehiculoId = new URLSearchParams(location.search).get("id");

    const [cargando, setCargando] = useState(true);

    const [formulario, setFormulario] = useState({
        placa: "",
        modelo: "",
        anio: "",
        marcaId: null,
        estado: "Activo",
    });

    // Imágenes nuevas (Dropzone)
    const [nuevasImagenes, setNuevasImagenes] = useState([]);
    const [dropzoneKey, setDropzoneKey] = useState(Date.now());

    // Imágenes existentes en BD: [{ id, url }]
    const [imagenesExistentes, setImagenesExistentes] = useState([]);
    // IDs de imágenes marcadas para eliminar
    const [imagenesAEliminarIds, setImagenesAEliminarIds] = useState([]);

    const [listaMarcas, setListaMarcas] = useState([]);
    const [nombreMarcaSeleccionada, setNombreMarcaSeleccionada] = useState("");
    const [modalMarcaOpen, setModalMarcaOpen] = useState(false);

    const [errorPlaca, setErrorPlaca] = useState(false);
    const [errorModelo, setErrorModelo] = useState(false);
    const [errorAnio, setErrorAnio] = useState(false);
    const [errorMarca, setErrorMarca] = useState(false);

    const pageDatos = {
        titulo: {
            titulo: "Editar vehículo",
            url: "/app/admin/vehiculos",
            tituloUrl: "vehículos",
            nombreUrl: "editar",
        },
    };

    useEffect(() => {
        if (!token) return;
        ActualizarLista(MarcasListar, setListaMarcas);
        cargarVehiculo();
    }, [token]);

    useEffect(() => {
        document.body.style.overflow = modalMarcaOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [modalMarcaOpen]);

    const validarCampo = (name, value) => {
        if (name === "placa")  setErrorPlaca(!regexNombre.test(value));
        if (name === "modelo") setErrorModelo(!regexNombre.test(value));
        if (name === "anio") {
            const anio = parseInt(value, 10);
            setErrorAnio(!regexEntero.test(value) || anio < 1900 || anio > new Date().getFullYear() + 1);
        }
    };

    const cargarVehiculo = async () => {
        if (!vehiculoId) {
            mostraAlertaError("No se especificó un vehículo a editar.");
            setCargando(false);
            return;
        }
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await AxiosPrivado.get(VehiculosBuscar + vehiculoId, config);

            setFormulario({
                placa:   data.placa   || "",
                modelo:  data.modelo  || "",
                anio:    data.anio    || "",
                marcaId: data.marcaId || null,
                estado:  data.estado  || "Activo",
            });

            setNombreMarcaSeleccionada(data.MarcaVehiculo?.nombre || "");

            // Guardar imágenes existentes con su id y url completa
            setImagenesExistentes(
                data.ImagenVehiculos?.map(img => ({
                    id: img.id,
                    url: ImagenVehiculos + img.imagen,
                    nombre: img.imagen,
                })) || []
            );
            setImagenesAEliminarIds([]);
        } catch (error) {
            mostraAlertaError(error.response?.data?.error || "Error al cargar el vehículo.");
        } finally {
            setCargando(false);
        }
    };

    const manejador = (e) => {
        const { name, value, type, checked } = e.target;
        const nuevoValor = type === "checkbox" ? (checked ? "Activo" : "Inactivo") : value;
        setFormulario(prev => ({ ...prev, [name]: nuevoValor }));
        validarCampo(name, nuevoValor);
    };

    const handleMarcaSeleccionada = (marca) => {
        setFormulario(prev => ({ ...prev, marcaId: marca.id }));
        setNombreMarcaSeleccionada(marca.nombre);
        setErrorMarca(false);
        setModalMarcaOpen(false);
    };

    // Marcar imagen existente para eliminar (no la borra hasta guardar)
    const handleEliminarImagenExistente = (imgId) => {
        setImagenesExistentes(prev => prev.filter(img => img.id !== imgId));
        setImagenesAEliminarIds(prev => [...prev, imgId]);
        mostraAlertaOk("Imagen marcada para eliminación. Guarda los cambios para aplicar.");
    };

    const validar = () => {
        const placaErr  = !regexNombre.test(formulario.placa);
        const modeloErr = !regexNombre.test(formulario.modelo);
        const anio      = parseInt(formulario.anio, 10);
        const anioErr   = !regexEntero.test(String(formulario.anio)) || anio < 1900 || anio > new Date().getFullYear() + 1;
        const marcaErr  = !formulario.marcaId;

        setErrorPlaca(placaErr);
        setErrorModelo(modeloErr);
        setErrorAnio(anioErr);
        setErrorMarca(marcaErr);

        if (placaErr || modeloErr || anioErr || marcaErr) {
            mostraAlertaError("Existen errores en el formulario. Por favor corrígelos.", "Error");
            return false;
        }
        if (!formulario.placa.trim())  { mostraAlertaWarning("La placa es obligatoria.");       return false; }
        if (!formulario.modelo.trim()) { mostraAlertaWarning("El modelo es obligatorio.");       return false; }
        if (!formulario.anio)          { mostraAlertaWarning("El año es obligatorio.");          return false; }
        if (!formulario.marcaId)       { mostraAlertaWarning("Debe seleccionar una marca.");     return false; }

        // Debe quedar al menos una imagen (existente o nueva)
        if (imagenesExistentes.length === 0 && nuevasImagenes.length === 0) {
            mostraAlertaWarning("Debe haber al menos una imagen del vehículo.");
            return false;
        }
        return true;
    };

    const actualizarVehiculo = async () => {
        if (!validar()) return;

        const formData = new FormData();
        formData.append("placa",   formulario.placa);
        formData.append("modelo",  formulario.modelo);
        formData.append("anio",    formulario.anio);
        formData.append("marcaId", formulario.marcaId);
        formData.append("estado",  formulario.estado);

        // IDs de imágenes a eliminar
        if (imagenesAEliminarIds.length > 0) {
            formData.append("imagenesAEliminar", JSON.stringify(imagenesAEliminarIds));
        }

        // Nuevas imágenes
        nuevasImagenes.forEach(file => formData.append("imagenes", file));

        try {
            AxiosImagen.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            await AxiosImagen.put(VehiculosEditar + vehiculoId, formData);
            mostraAlertaOk("Vehículo actualizado correctamente.");
            navigate("/app/vehiculos/listado");
        } catch (error) {
            const msg = error.response?.data?.error || "Error al actualizar el vehículo.";
            mostraAlertaError(msg, "Error");
        }
    };

    const refrescarMarcas = () => ActualizarLista(MarcasListar, setListaMarcas);

    const BotonesAccion = () => (
        <>
            <button type="button" className="btn btn-warning mr-2" onClick={actualizarVehiculo}>
                <i className="fas fa-pen mx-1" /> Actualizar
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/app/vehiculos/listado")}>
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

    return (
        <Page datos={pageDatos}>
            <div className="row">
                <div className="col-12">
                    <Card titulo="Datos del vehículo" pie={<BotonesAccion />}>
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

                            {/* ── Imágenes ── */}
                            <h5 className="mt-4">Imágenes</h5>
                            <hr />

                            {/* Imágenes existentes con botón eliminar */}
                            {imagenesExistentes.length > 0 && (
                                <>
                                    <h6>Imágenes actuales</h6>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {imagenesExistentes.map(img => (
                                            <div
                                                key={img.id}
                                                className="position-relative"
                                                style={{ width: 110 }}
                                            >
                                                <img
                                                    src={img.url}
                                                    alt="Imagen vehículo"
                                                    className="img-thumbnail"
                                                    style={{
                                                        width: "100%",
                                                        height: 90,
                                                        objectFit: "cover",
                                                    }}
                                                    onError={e => {
                                                        e.target.onerror = null;
                                                        e.target.src = "/vehiculos.jpg";
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-danger btn-sm position-absolute"
                                                    style={{
                                                        top: 4, right: 4,
                                                        borderRadius: "50%",
                                                        width: 24, height: 24,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: 0,
                                                        fontSize: ".7rem",
                                                    }}
                                                    title="Eliminar imagen"
                                                    onClick={() => handleEliminarImagenExistente(img.id)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Dropzone para nuevas imágenes */}
                            <h6>Añadir nuevas imágenes</h6>
                            <div className="row mb-3">
                                <div className="col-12">
                                    <div className="form-group">
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


/* ─────────────────────────────────────────────
   MarcaSelectorModal
───────────────────────────────────────────── */
const MarcaSelectorModal = ({
    marcas, setListaMarcas, marcaSeleccionadaId,
    onSeleccionar, onCerrar, token, onMarcaCreada, ActualizarLista
}) => {
    const [busqueda, setBusqueda] = useState("");
    const [mostrarInactivos, setMostrarInactivos] = useState(false);
    const [modalFormOpen, setModalFormOpen] = useState(false);
    const [marcaEditando, setMarcaEditando] = useState(null);

    const abrirEditar = (e, marca) => { e.stopPropagation(); setMarcaEditando(marca); setModalFormOpen(true); };
    const abrirCrear  = () => { setMarcaEditando(null); setModalFormOpen(true); };

    const marcasFiltradas = marcas.filter(m => {
        const coincideEstado    = mostrarInactivos ? m.estado === "Inactivo" : m.estado === "Activo";
        const coincideBusqueda  = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
        return coincideEstado && coincideBusqueda;
    });

    return (
        <>
            <style>{`
                .msm-overlay { position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:1050;display:flex;align-items:flex-end;justify-content:center;padding:0;touch-action:none; }
                @media(min-width:576px){.msm-overlay{align-items:center;padding:16px;}}
                .msm-dialog{background:#fff;width:100%;max-width:680px;max-height:92vh;border-radius:18px 18px 0 0;display:flex;flex-direction:column;box-shadow:0 -8px 40px rgba(0,0,0,.18);overflow:hidden;touch-action:auto;}
                @media(min-width:576px){.msm-dialog{border-radius:14px;max-height:85vh;box-shadow:0 20px 60px rgba(0,0,0,.22);}}
                .msm-handle{display:flex;justify-content:center;padding:10px 0 4px;flex-shrink:0;background:#fff;}
                .msm-handle-bar{width:36px;height:4px;background:#cbd5e1;border-radius:99px;}
                @media(min-width:576px){.msm-handle{display:none;}}
                .msm-header{display:flex;align-items:center;justify-content:space-between;padding:12px 16px;background:#1e293b;color:#fff;flex-shrink:0;}
                @media(min-width:576px){.msm-header{padding:15px 20px;}}
                .msm-header h5{margin:0;font-size:.95rem;font-weight:600;display:flex;align-items:center;gap:8px;}
                .msm-close{background:none;border:none;color:#fff;font-size:1.4rem;line-height:1;cursor:pointer;opacity:.7;transition:opacity .2s;padding:0 4px;}
                .msm-close:hover{opacity:1;}
                .msm-toolbar{display:flex;align-items:center;gap:8px;padding:10px 14px;border-bottom:1px solid #e2e8f0;flex-shrink:0;background:#f8fafc;flex-wrap:wrap;}
                @media(min-width:576px){.msm-toolbar{padding:12px 20px;flex-wrap:nowrap;}}
                .msm-search{flex:1;min-width:0;position:relative;width:100%;}
                @media(min-width:576px){.msm-search{width:auto;}}
                .msm-search i{position:absolute;left:10px;top:50%;transform:translateY(-50%);color:#94a3b8;font-size:.82rem;pointer-events:none;}
                .msm-search input{width:100%;padding:0 12px 0 32px;height:38px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:.875rem;color:#374151;background:#fff;outline:none;transition:border-color .2s,box-shadow .2s;}
                .msm-search input:focus{border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,.1);}
                .msm-toolbar-row2{display:flex;align-items:center;justify-content:space-between;width:100%;gap:8px;}
                @media(min-width:576px){.msm-toolbar-row2{width:auto;display:contents;}}
                .msm-toggle-wrap{display:flex;align-items:center;gap:7px;white-space:nowrap;font-size:.82rem;color:#64748b;font-weight:600;user-select:none;cursor:pointer;margin:0;}
                .msm-toggle-pill{position:relative;width:38px;height:20px;flex-shrink:0;}
                .msm-toggle-pill input{display:none;}
                .msm-toggle-track{position:absolute;inset:0;background:#cbd5e1;border-radius:99px;cursor:pointer;transition:background .2s;}
                .msm-toggle-pill input:checked+.msm-toggle-track{background:#64748b;}
                .msm-toggle-track::after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.2);}
                .msm-toggle-pill input:checked+.msm-toggle-track::after{transform:translateX(18px);}
                .msm-btn-nueva{height:38px;padding:0 14px;background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;border:none;border-radius:8px;font-size:.82rem;font-weight:600;white-space:nowrap;cursor:pointer;display:flex;align-items:center;gap:5px;transition:opacity .2s;}
                .msm-btn-nueva:hover{opacity:.88;}
                .msm-count{padding:8px 16px 0;font-size:.73rem;color:#94a3b8;flex-shrink:0;}
                @media(min-width:576px){.msm-count{padding:8px 20px 0;}}
                .msm-body{overflow-y:auto;overflow-x:hidden;padding:10px 14px 32px;flex:1;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;}
                @media(min-width:576px){.msm-body{padding:10px 20px 20px;}}
                .msm-card{border-radius:10px;border:1.5px solid #e2e8f0;background:#fff;transition:border-color .15s,box-shadow .15s,background .15s;overflow:hidden;}
                .msm-card:not(.inactive):hover{border-color:#93c5fd;box-shadow:0 3px 12px rgba(59,130,246,.11);}
                .msm-card.selected{border-color:#3b82f6;background:#eff6ff;}
                .msm-card.inactive{background:#f8fafc;opacity:.82;}
                .msm-card-inner{display:flex;align-items:center;gap:10px;padding:10px 12px;}
                .msm-card-img{width:44px;height:44px;border-radius:8px;background:#f1f5f9;border:1px solid #e2e8f0;display:flex;align-items:center;justify-content:center;flex-shrink:0;overflow:hidden;}
                .msm-card-img img{width:100%;height:100%;object-fit:contain;padding:4px;}
                .msm-card-info{flex:1;min-width:0;}
                .msm-card-nombre{font-weight:700;font-size:.875rem;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
                .msm-card-badge{font-size:.62rem;font-weight:600;padding:1px 7px;border-radius:99px;}
                .msm-card-actions{display:flex;align-items:center;gap:4px;flex-shrink:0;}
                .msm-btn-sel-text{display:none;}
                @media(min-width:480px){.msm-btn-sel-text{display:inline;}}
                .msm-btn-sel{height:32px;padding:0 10px;border-radius:7px;font-size:.78rem;font-weight:600;border:1.5px solid #3b82f6;color:#3b82f6;background:transparent;cursor:pointer;transition:background .15s,color .15s;white-space:nowrap;display:flex;align-items:center;gap:4px;}
                .msm-btn-sel:hover,.msm-card.selected .msm-btn-sel{background:#3b82f6;color:#fff;}
                .msm-btn-edit{height:32px;width:32px;border-radius:7px;border:1.5px solid #fde68a;background:#fef3c7;color:#b45309;cursor:pointer;transition:background .15s;display:flex;align-items:center;justify-content:center;}
                .msm-btn-edit:hover{background:#fde68a;}
                .msm-card-actions .btn-danger{height:32px;width:32px;padding:0;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:.8rem;}
                .msm-empty{text-align:center;padding:36px 0;}
                .msm-empty i{font-size:2.2rem;color:#e2e8f0;display:block;margin-bottom:10px;}
                .msm-empty span{font-size:.875rem;color:#94a3b8;}
            `}</style>

            <div className="msm-overlay" onClick={onCerrar}>
                <div className="msm-dialog" onClick={e => e.stopPropagation()}>
                    <div className="msm-handle"><div className="msm-handle-bar" /></div>
                    <div className="msm-header">
                        <h5><i className="fas fa-tag" /> Seleccionar marca</h5>
                        <button className="msm-close" onClick={onCerrar}>&times;</button>
                    </div>
                    <div className="msm-toolbar">
                        <div className="msm-search">
                            <i className="fas fa-search" />
                            <input type="text" placeholder="Buscar marca por nombre..." value={busqueda} onChange={e => setBusqueda(e.target.value)} autoFocus />
                        </div>
                        <div className="msm-toolbar-row2">
                            <label className="msm-toggle-wrap">
                                <div className="msm-toggle-pill">
                                    <input type="checkbox" checked={mostrarInactivos} onChange={e => setMostrarInactivos(e.target.checked)} />
                                    <span className="msm-toggle-track" />
                                </div>
                                Inactivos
                            </label>
                            <button className="msm-btn-nueva" onClick={abrirCrear}>
                                <i className="fas fa-plus" /> Nueva marca
                            </button>
                        </div>
                    </div>
                    <div className="msm-count">
                        {marcasFiltradas.length} marca{marcasFiltradas.length !== 1 ? "s" : ""}{" "}
                        {mostrarInactivos ? "inactiva(s)" : "activa(s)"}
                    </div>
                    <div className="msm-body">
                        {marcasFiltradas.length === 0 ? (
                            <div className="msm-empty">
                                <i className="fas fa-tag" />
                                <span>No hay marcas {mostrarInactivos ? "inactivas" : "activas"} registradas</span>
                            </div>
                        ) : (
                            <div className="d-flex flex-column gap-2 mt-2">
                                {marcasFiltradas.map(marca => {
                                    const esInactiva    = marca.estado === "Inactivo";
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
                                                    <img src={ImagenMarcas + marca.imagen} alt={marca.nombre} onError={e => { e.target.src = ImagenMarcas + "marca_default.jpeg"; }} />
                                                </div>
                                                <div className="msm-card-info">
                                                    <div className="msm-card-nombre">{marca.nombre}</div>
                                                    <span className={`msm-card-badge badge ${esInactiva ? "bg-secondary" : "bg-success"}`}>{marca.estado}</span>
                                                </div>
                                                <div className="msm-card-actions">
                                                    {!esInactiva && (
                                                        <button className="msm-btn-sel" onClick={e => { e.stopPropagation(); onSeleccionar(marca); }}>
                                                            {esSeleccionada
                                                                ? <><i className="fas fa-check" /><span className="msm-btn-sel-text mx-1">Seleccionada</span></>
                                                                : <><i className="fas fa-hand-pointer" /><span className="msm-btn-sel-text mx-1">Seleccionar</span></>
                                                            }
                                                        </button>
                                                    )}
                                                    <button className="msm-btn-edit" onClick={e => abrirEditar(e, marca)} title="Editar marca">
                                                        <i className="fas fa-edit" />
                                                    </button>
                                                    <div onClick={e => e.stopPropagation()}>
                                                        <EliminarMarcaVehiculo datos={marca} token={token} setListaMarcas={setListaMarcas} ActualizarLista={ActualizarLista} />
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

            <ModalFormularioMarca isOpen={modalFormOpen} setIsOpen={setModalFormOpen} datos={marcaEditando} onGuardado={onMarcaCreada} token={token} />
        </>
    );
};

export default EditarVehiculo;