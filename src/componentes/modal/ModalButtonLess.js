import React from 'react';
import { Modal } from 'react-bootstrap';
/**
 * Para el size
 * modal-sm
 * modal-lg
 * modal-xl
 */

const ModalButtonLess = (props) => {
    const openModal = () => props.setModalIsOpen(true);
    const closeModal = () => props.setModalIsOpen(false);

    let triggerElement = null;

    // Modificación clave aquí:
    // El botón se renderizará SÓLO si:
    // 1. props.mostrarBoton no es explícitamente false (permite control externo)
    // 2. Y props.nombreBoton tiene un valor (no es nulo/vacío), lo que significa que quieres que ModalButtonLess lo genere.
    if (props.mostrarBoton !== false && props.nombreBoton) {
        const handleTrigger = props.onTriggerClick || openModal;
        triggerElement = props.linkStyle ? (
            <a
                href="#"
                className={props.estiloBoton}
                onClick={(e) => {
                    e.preventDefault();
                    handleTrigger();
                }}
            >
                {props.nombreBoton}
                {props.iconBoton && <i className={props.iconBoton} style={{ marginLeft: "8px" }} />} {/* Agregué icono al enlace */}
            </a>
        ) : props.isListItem ? (
            <li
                className={`nav-item ${props.estiloBoton}`}
                onClick={handleTrigger}
                style={{ cursor: "pointer" }}
            >
                <span className="nav-link">
                    {props.nombreBoton}
                    {props.iconBoton && <i className={props.iconBoton} style={{ marginLeft: "8px" }} />}
                </span>
            </li>
        ) : (
            <button
                type="button"
                className={props.estiloBoton}
                onClick={handleTrigger}
            >
                {props.nombreBoton}
                {props.iconBoton && <i className={props.iconBoton} style={{ marginLeft: "8px" }} />}
            </button>
        );
    }

    return (
        <>
            {triggerElement} {/* Se renderizará solo si se cumplen las condiciones */}
            <Modal
                show={props.modalIsOpen} onHide={closeModal} size={props.size || 'lg'} className="modal fade" // Usar props.size
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{props.titulo}</h4>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                    <div className="modal-body table-responsive">
                        {props.children}
                    </div>
                    <div className="modal-footer justify-content-end">
                        {props.pie}
                        <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={closeModal}>
                            Cerrar
                            <i className="fas fa-times mr-1 mx-1" />
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ModalButtonLess;