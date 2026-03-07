import { useEffect, useState } from "react";
import {
  mostraAlertaError,
  mostraAlertaOk,
  mostraAlertaPregunta,
  mostraAlertaWarning,
} from "../../componentes/alerts/sweetAlert";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import Dropzone from "../../componentes/imagenes/Dropzone";
import ModalButtonLess from "../../componentes/modal/ModalButtonLess";
import {
  ImagenMarcas,
  MarcasEditar,
  MarcasEliminar,
  MarcasGuardar,
  MarcasListar,
} from "../../configuracion/apiUrls";
import { regexNombre } from "../../configuracion/validaciones";

export const ModalFormularioMarca = ({ isOpen, setIsOpen, datos, onGuardado, token }) => {
  const esEdicion = !!datos;
  const [nombre, setNombre] = useState("");
  const [estado, setEstado] = useState("Activo");
  const [imagen, setImagen] = useState(null);
  const [errorNombre, setErrorNombre] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNombre(datos?.nombre || "");
      setEstado(datos?.estado || "Activo");
      setImagen(null);
    }
  }, [isOpen, datos]);

  useEffect(() => {
    setErrorNombre(nombre.length > 0 && !regexNombre.test(nombre));
  }, [nombre]);

  const handleGuardar = async () => {
    if (!nombre || errorNombre)
      return mostraAlertaWarning("Por favor, corrige los errores en el formulario.");

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("estado", estado);
    if (imagen) formData.append("imagen", Array.isArray(imagen) ? imagen[0] : imagen);

    try {
      AxiosPrivado.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      if (esEdicion) {
        await AxiosPrivado.put(MarcasEditar + datos.id, formData, config);
        mostraAlertaOk("Marca actualizada correctamente");
      } else {
        await AxiosPrivado.post(MarcasGuardar, formData, config);
        mostraAlertaOk("Marca guardada correctamente");
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
        .mmf-label {
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #64748b;
          margin-bottom: 6px;
        }
        .mmf-img-preview {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 10px;
        }
        .mmf-img-preview img {
          width: 52px; height: 52px;
          object-fit: contain;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          background: #fff;
        }
        .mmf-estado-row {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
        }
        .mmf-toggle { position: relative; width: 44px; height: 23px; flex-shrink: 0; }
        .mmf-toggle input { display: none; }
        .mmf-toggle-track {
          position: absolute; inset: 0;
          background: #cbd5e1;
          border-radius: 99px;
          cursor: pointer;
          transition: background .2s;
        }
        .mmf-toggle input:checked + .mmf-toggle-track { background: #22c55e; }
        .mmf-toggle-track::after {
          content: '';
          position: absolute;
          top: 3px; left: 3px;
          width: 17px; height: 17px;
          background: #fff;
          border-radius: 50%;
          transition: transform .2s;
          box-shadow: 0 1px 3px rgba(0,0,0,.2);
        }
        .mmf-toggle input:checked + .mmf-toggle-track::after { transform: translateX(21px); }
        .mmf-btn-save {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          border: none; color: #fff;
          padding: 9px 26px;
          border-radius: 9px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: opacity .2s, transform .1s;
        }
        .mmf-btn-save:hover { opacity: .9; transform: translateY(-1px); }
        .mmf-btn-save.editar { background: linear-gradient(135deg, #f59e0b, #d97706); }
      `}</style>

      <ModalButtonLess
        titulo={esEdicion ? `Editando: ${datos?.nombre}` : "Nueva marca"}
        modalIsOpen={isOpen}
        setModalIsOpen={setIsOpen}
        size="md"
        pie={
          <div className="d-flex justify-content-end gap-2">
   
            <button className={`mmf-btn-save btn ${esEdicion ? "editar" : ""}`} onClick={handleGuardar}>
              <i className={`fas ${esEdicion ? "fa-pen" : "fa-save"} mx-1`} />
              {esEdicion ? "Actualizar" : "Guardar"}
            </button>
          </div>
        }
      >
        <div className="d-flex flex-column gap-3">
          <div>
            <div className="mmf-label">Nombre de la marca</div>
            <input
              type="text"
              className={`form-control ${errorNombre ? "is-invalid" : ""}`}
              placeholder="Ej: Toyota, Ford, Honda..."
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            {errorNombre && (
              <div className="invalid-feedback">El nombre debe tener al menos 3 caracteres.</div>
            )}
          </div>

          {esEdicion && datos?.imagen && (
            <div>
              <div className="mmf-label">Imagen actual</div>
              <div className="mmf-img-preview">
                <img
                  src={ImagenMarcas + datos.imagen}
                  alt={datos.nombre}
                  onError={(e) => { e.target.src = ImagenMarcas + "marca_default.jpeg"; }}
                />
                <span className="text-muted small">{datos.imagen}</span>
              </div>
            </div>
          )}

          <div>
            <div className="mmf-label">{esEdicion ? "Nueva imagen (opcional)" : "Imagen"}</div>
            <Dropzone max={1} files={imagen} setFiles={setImagen} />
          </div>

          <div>
            <div className="mmf-label">Estado</div>
            <div className="mmf-estado-row">
              <label className="mmf-toggle">
                <input
                  type="checkbox"
                  checked={estado === "Activo"}
                  onChange={(e) => setEstado(e.target.checked ? "Activo" : "Inactivo")}
                />
                <span className="mmf-toggle-track" />
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
   GALERÍA DE MARCAS — renderizado directo
───────────────────────────────────────────── */
const ModalMarcaVehiculo = ({ token, listaMarcas = [], setListaMarcas, ActualizarLista }) => {
  const [mostrarInactivos, setMostrarInactivos] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [modalFormOpen, setModalFormOpen] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);

  useEffect(() => {
    ActualizarLista(MarcasListar, setListaMarcas);
  }, []);

  const refrescar = () => ActualizarLista(MarcasListar, setListaMarcas);
  const abrirCrear = () => { setMarcaSeleccionada(null); setModalFormOpen(true); };
  const abrirEditar = (marca) => { setMarcaSeleccionada(marca); setModalFormOpen(true); };

  const handleEliminar = (marca) => {
    if (marca.tieneVehiculos) {
      mostraAlertaError(`La marca "${marca.nombre}" no se puede eliminar porque tiene vehículos asociados.`);
      return;
    }
    mostraAlertaPregunta(
      async (confirmado) => {
        if (!confirmado) return;
        try {
          await AxiosPrivado.delete(MarcasEliminar + marca.id, {
            headers: { Authorization: `Bearer ${token}` },
          });
          mostraAlertaOk("Marca eliminada correctamente");
          refrescar();
        } catch (error) {
          mostraAlertaError(error.response?.data?.error || "Ocurrió un error al eliminar.");
        }
      },
      `¿Deseas eliminar la marca "${marca.nombre}" de forma permanente?`,
      "warning"
    );
  };

  const marcasFiltradas = listaMarcas.filter((m) => {
    const coincideBusqueda = m.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = mostrarInactivos ? m.estado === "Inactivo" : m.estado === "Activo";
    return coincideBusqueda && coincideEstado;
  });

  return (
    <>
      <style>{`
        .gm-toolbar {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
          padding-bottom: 14px; border-bottom: 1px solid #e2e8f0; margin-bottom: 14px;
        }
        .gm-search { flex: 1; min-width: 140px; position: relative; }
        .gm-search i {
          position: absolute; left: 10px; top: 50%;
          transform: translateY(-50%); color: #94a3b8; font-size: .82rem; pointer-events: none;
        }
        .gm-search input {
          width: 100%; padding: 0 12px 0 32px; height: 36px;
          border: 1.5px solid #e2e8f0; border-radius: 8px;
          font-size: .85rem; color: #374151; background: #fff; outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .gm-search input:focus { border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,.1); }
        .gm-select {
          height: 36px; border: 1.5px solid #e2e8f0; border-radius: 8px;
          font-size: .85rem; padding: 0 10px; color: #374151;
          background: #fff; cursor: pointer; outline: none; transition: border-color .2s;
        }
        .gm-select:focus { border-color: #3b82f6; }
        .gm-btn-nueva {
          height: 36px; padding: 0 16px;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: #fff; border: none; border-radius: 8px;
          font-size: .85rem; font-weight: 600; white-space: nowrap;
          cursor: pointer; display: flex; align-items: center; gap: 6px; transition: opacity .2s;
        }
        .gm-btn-nueva:hover { opacity: .88; }
        .gm-count { font-size: .75rem; color: #94a3b8; margin-bottom: 12px; }
        .gm-card {
          border-radius: 12px; border: 1.5px solid #e2e8f0; background: #fff;
          overflow: hidden; transition: box-shadow .2s, transform .15s;
        }
        .gm-card:hover { box-shadow: 0 6px 20px rgba(0,0,0,.09); transform: translateY(-2px); }
        .gm-card-img {
          background: #f8fafc; display: flex; align-items: center;
          justify-content: center; padding: 16px 0 10px; border-bottom: 1px solid #f1f5f9;
        }
        .gm-card-img img {
          width: 60px; height: 60px; object-fit: contain; border-radius: 8px;
          background: #fff; box-shadow: 0 1px 6px rgba(0,0,0,.06);
        }
        .gm-card-body { padding: 10px 12px 12px; }
        .gm-card-nombre {
          font-size: .875rem; font-weight: 700; color: #1e293b;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;
        }
        .gm-badge { font-size: .65rem; font-weight: 600; letter-spacing: .04em; padding: 2px 8px; border-radius: 99px; }
        .gm-card-actions {
          display: flex; gap: 5px; margin-top: 10px;
          padding-top: 8px; border-top: 1px solid #f1f5f9;
        }
        .gm-btn-editar {
          flex: 1; background: #fef3c7; color: #b45309; border: 1px solid #fde68a;
          border-radius: 7px; font-size: .75rem; font-weight: 600; padding: 5px 0;
          cursor: pointer; transition: background .15s;
        }
        .gm-btn-editar:hover { background: #fde68a; }
        .gm-btn-eliminar {
          background: #fee2e2; color: #b91c1c; border: 1px solid #fecaca;
          border-radius: 7px; font-size: .75rem; padding: 5px 9px;
          cursor: pointer; transition: background .15s;
        }
        .gm-btn-eliminar:hover { background: #fecaca; }
        .gm-empty { text-align: center; padding: 40px 0; }
        .gm-empty i { font-size: 2.4rem; color: #e2e8f0; display: block; margin-bottom: 10px; }
        .gm-empty span { font-size: .875rem; color: #94a3b8; }
      `}</style>

      <div className="gm-toolbar">
        <div className="gm-search">
          <i className="fas fa-search" />
          <input
            type="text"
            placeholder="Buscar marca..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="gm-select"
          value={mostrarInactivos ? "Inactivo" : "Activo"}
          onChange={(e) => setMostrarInactivos(e.target.value === "Inactivo")}
        >
          <option value="Activo">Activos</option>
          <option value="Inactivo">Inactivos</option>
        </select>
        <button className="gm-btn-nueva" onClick={abrirCrear}>
          <i className="fas fa-plus" /> Nueva marca
        </button>
      </div>

      <div className="gm-count">
        {marcasFiltradas.length} marca{marcasFiltradas.length !== 1 ? "s" : ""}{" "}
        {mostrarInactivos ? "inactiva(s)" : "activa(s)"}
      </div>

      {marcasFiltradas.length === 0 ? (
        <div className="gm-empty">
          <i className="fas fa-tag" />
          <span>No hay marcas {mostrarInactivos ? "inactivas" : "activas"} registradas</span>
        </div>
      ) : (
        <div className="row g-3">
          {marcasFiltradas.map((marca) => (
            <div className="col-6 col-sm-4 col-md-3" key={marca.id}>
              <div className="gm-card">
                <div className="gm-card-img">
                  <img
                    src={ImagenMarcas + marca.imagen}
                    alt={marca.nombre}
                    onError={(e) => { e.target.src = ImagenMarcas + "marca_default.jpeg"; }}
                  />
                </div>
                <div className="gm-card-body">
                  <div className="gm-card-nombre" title={marca.nombre}>{marca.nombre}</div>
                  <span className={`gm-badge badge ${marca.estado === "Activo" ? "bg-success" : "bg-secondary"}`}>
                    {marca.estado}
                  </span>
                  <div className="gm-card-actions">
                    <button className="gm-btn-editar" onClick={() => abrirEditar(marca)}>
                      <i className="fas fa-edit me-1" /> Editar
                    </button>
                    <button className="gm-btn-eliminar" onClick={() => handleEliminar(marca)} title="Eliminar">
                      <i className="fas fa-trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalFormularioMarca
        isOpen={modalFormOpen}
        setIsOpen={setModalFormOpen}
        datos={marcaSeleccionada}
        onGuardado={refrescar}
        token={token}
      />
    </>
  );
};

export default ModalMarcaVehiculo;