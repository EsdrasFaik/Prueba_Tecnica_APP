import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import ImagenGaleria from './ImagenGaleria';

/**
 * Para el size
 * modal-sm
 * modal-lg
 * modal-xl
 */

const Galeria = (props) => {
    const Matriz = props.lista.map((fila, i) => (
        <div className="col-lg-2 col-sm-4 col-xs-6" key={i}>
            <ImagenGaleria datos={fila} url={props.url}/>
        </div>
));
    return (
        <div className='row'>
            { Matriz}
        </div>
    );
}

export default Galeria;