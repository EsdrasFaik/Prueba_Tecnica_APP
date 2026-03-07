import React, { useState } from 'react';
import { ImagenEmpleado } from '../../configuracion/apiUrls';
import ModalBootstrap from '../modal/ModalBootstrap';



const ModalImagen = ({ datos }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const BotonGuardar = () => {
        return (
            <button type="button" className="btn btn-primary" onClick={guardarImagen}>Guardar</button>
        )
    }
    const BotonEditar = () => {
        return (
            <button type="button" className="btn btn-primary" onClick={eliminarImagen}>Editar</button>
        )
    }
    const guardarImagen = () =>{

    }
    const eliminarImagen = () =>{
        
    }
    return (
        <ModalBootstrap
        titulo={datos ? "Ver imagen producto" : "Nueva Imagen"}
            nombreBoton={datos ? "Eliminar" : "Agregar"}
            estiloBoton={datos ? "btn btn-danger" : "btn btn-info"}
            iconBoton={datos ? "fas fa-edit" : "fas fa-user-plus"}
            pie={datos ? <BotonEditar /> : <BotonGuardar />}
            modalIsOpen={modalIsOpen}
            setModalIsOpen={setModalIsOpen}
        >
            <img src={datos.preview} className="img-fluid mb-2" alt={datos.nombre} />

        </ModalBootstrap>
    );
}

export default ModalImagen;