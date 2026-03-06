import { useState } from 'react';
import { Modal } from 'react-bootstrap';

const ModalWizardBootstrap = (props) => {
    const openModal = () => props.setModalIsOpen(true);
    const closeModal = () => {
        setPasoActual(0);
        props.setModalIsOpen(false);
    };

    const [pasoActual, setPasoActual] = useState(0);
    const pasos = props.pasos || [];
    const iconos = props.iconos || ['fas fa-user', 'fas fa-key', 'fab fa-twitter'];

    const avanzarPaso = () => {
        if (pasoActual < pasos.length - 1) {
            setPasoActual(pasoActual + 1);
        } else if (props.onFinish) {
            props.onFinish();
        }
    };

    const retrocederPaso = () => {
        if (pasoActual > 0) {
            setPasoActual(pasoActual - 1);
        }
    };

    // Botón disparador flexible
    let triggerElement = null;
    if (props.mostrarBoton !== false) {
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
                {props.iconBoton && <i className={`ms-2 ${props.iconBoton}`} />}
            </a>
        ) : props.isListItem ? (
            <li
                className={`nav-item ${props.estiloBoton}`}
                onClick={handleTrigger}
                style={{ cursor: "pointer" }}
            >
                <span className="nav-link">
                    {props.nombreBoton}
                    {props.iconBoton && <i className={`ms-2 ${props.iconBoton}`} />}
                </span>
            </li>
        ) : (
            <button
                type="button"
                className={props.estiloBoton}
                onClick={handleTrigger}
            >
                {props.nombreBoton}
                {props.iconBoton && <i className={`ms-2 ${props.iconBoton}`} />}
            </button>
        );
    }

    return (
        <>
            {triggerElement}

            <Modal
                show={props.modalIsOpen}
                onHide={closeModal}
                size={props.size || 'md'}
                centered
            >
                <div className="modal-content p-4 shadow">
                    <div className="modal-header">
                        <h4 className="modal-title">{props.titulo || 'Registro'}</h4>
                        <button
                            type="button"
                            className="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={closeModal}
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>

                    <div className="text-center mb-3">
                        <p className="text-muted small mb-0">Completa los pasos para continuar</p>
                    </div>

                    {/* Indicadores de pasos */}
                    <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
                        {pasos.map((_, index) => (
                            <div key={index} className="d-flex align-items-center mx-3 mb-3">
                                <div className="d-flex flex-column align-items-center text-center">
                                    <div
                                        className={`rounded-circle border d-flex align-items-center justify-content-center
                                            ${index === pasoActual ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-dark border-secondary'}
                                        `}
                                        style={{
                                            width: 42,
                                            height: 42,
                                            fontSize: 20,
                                        }}
                                    >
                                        <i className={iconos[index] || 'fas fa-circle'} />
                                    </div>
                                    <small
                                        className={`mt-1 ${index === pasoActual ? 'text-dark fw-bold' : 'text-muted'}`}
                                        style={{ fontSize: 12, lineHeight: '1.2' }}
                                    >
                                        {pasos[index]?.etiqueta || `Paso ${index + 1}`}
                                    </small>
                                </div>

                                {/* Flecha hacia el siguiente paso */}
                                {index < pasos.length - 1 && (
                                    <i
                                        className="fas fa-arrow-right mx-3 text-muted"
                                        style={{
                                            fontSize: 14,
                                            alignSelf: 'center',
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Cuerpo del paso */}
                    <div className="modal-body">
                        {pasos[pasoActual]?.contenido}
                    </div>

                    {/* Pie de modal */}
                    <div className="modal-footer justify-content-between px-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={retrocederPaso}
                            disabled={pasoActual === 0}
                        >
                            Anterior
                        </button>
                        <div>
                            {pasoActual < pasos.length - 1 ? (
                                <button className="btn btn-primary" onClick={avanzarPaso}>
                                    Siguiente
                                </button>
                            ) : (
                                <button className="btn btn-success" onClick={avanzarPaso}>
                                    Finalizar
                                </button>
                            )}
                            <button className="btn btn-danger mx-2" onClick={closeModal}>
                                Cerrar <i className="fas fa-times ms-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ModalWizardBootstrap;