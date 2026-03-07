import React, { useState } from 'react';
import ModalImagen from './ModalImagen';


const ImagenGaleria = ({ datos, url }) => {
    const imagenDatos = {
        urlImagen: datos?.imagen ? url + datos.imagen : url + "empleados.jpeg",
        nombre: datos.imagen
    }

    return (
        <ModalImagen
            datos={datos}
        ></ModalImagen>
    );
}

export default ImagenGaleria;