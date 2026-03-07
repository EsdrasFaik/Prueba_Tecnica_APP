import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Galeria from './Galeria';
import { mostraAlertaWarning } from '../alerts/sweetAlert';


const Dropzone = ({max, files, setFiles}) => {
    const [previa, setPrevia] = useState([]);
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > max) { 
            mostraAlertaWarning("Solo puedes subir un máximo de "+ max + " imágenes.")
            return; 
        }
        const validFiles = acceptedFiles.filter(file => { 
            if (file.size > 1024 * 1024) { // 1MB 
                mostraAlertaWarning("El archivo " + file.name + " es mayor de 1MB y no será subido."); 
                return false; 
            } 
            return true; 
        });
        const filesWithPreview = validFiles.map(file => ({
            ...file, 
            preview: URL.createObjectURL(file),
            sizeInKB: (file.size / 1024).toFixed(2),
            sizeInMB: (file.size / (1024 * 1024)).toFixed(2)
        }));
        setPrevia(filesWithPreview);
        setFiles(validFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    const thumbs = previa.map((file, i) => (
        <div className="col-lg-1 col-md-2 col-xs-3" key={i}>
            <img
                src={file.preview}
                className="img-fluid mb-2"
                // Revoke data uri after image is loaded
                onLoad={() => URL.revokeObjectURL(file.preview)} alt={file.name}
            />
            <div>
                    <small className={file.sizeInMB<=1?"" : "badge-danger"}>{file.sizeInMB + "MB"}</small>
            </div>
        </div>
    ));

    return (
        <div className='row'>
            <div className='col-12' {...getRootProps()}
                style={{ border: '2px dashed #cccccc', padding: '20px', borderRadius: '10px' }}>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Suelta los archivos aquí...</p>
                ) : (
                    <p>Arrastra y suelta algunos archivos aquí, o haz clic para seleccionar archivos</p>
                )}
            </div>
            <div className='row mt-3'>
                {thumbs}
            </div>
        </div>

    );
};

export default Dropzone;