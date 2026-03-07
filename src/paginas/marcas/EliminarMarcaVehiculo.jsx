import { mostraAlertaError, mostraAlertaOk, mostraAlertaPregunta } from "../../componentes/alerts/sweetAlert";
import { useEffect, useState } from "react";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import { MarcasEliminar, MarcasListar } from "../../configuracion/apiUrls";

const EliminarMarcaVehiculo = ({ datos, token, setListaMarcas, ActualizarLista }) => {
    const [eliminar, setEliminar] = useState(false);

    useEffect(() => {
        if (eliminar) {
            eliminarMarca();
        }
        return () => setEliminar(false);
    }, [eliminar]);

    const eliminarMarcaPregunta = () => {
        if (datos.tieneVehiculos) {
            mostraAlertaError(`La marca "${datos.nombre}" no se puede eliminar porque tiene vehículos asociados.`);
            return;
        }

        mostraAlertaPregunta(
            setEliminar,
            `¿Deseas eliminar la marca "${datos.nombre}" de forma permanente?`,
            "warning"
        );
    };

    const eliminarMarca = async () => {
        if (!datos.id) {
            return mostraAlertaError("Seleccione una marca");
        }
        if (datos.tieneVehiculos) {
            mostraAlertaError(`La marca "${datos.nombre}" no se puede eliminar porque tiene vehículos asociados.`);
            setEliminar(false);
            return;
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            await AxiosPrivado.delete(MarcasEliminar + datos.id, config);

            mostraAlertaOk("Marca eliminada correctamente");
            ActualizarLista(MarcasListar, setListaMarcas);

        } catch (error) {
            console.error(error);
            const msjError = error.response?.data?.error || "Ocurrió un error desconocido al eliminar.";
            mostraAlertaError(msjError);
        } finally {
            setEliminar(false);
        }
    };

    return (
        <button type="button" className="btn btn-danger" onClick={eliminarMarcaPregunta}>
            <i className="fas fa-trash" />
        </button>
    );
};

export default EliminarMarcaVehiculo;