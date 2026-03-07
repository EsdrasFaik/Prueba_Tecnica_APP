import { mostraAlertaError, mostraAlertaOk, mostraAlertaPregunta } from "../../componentes/alerts/sweetAlert";
import { useEffect, useState } from "react";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import { MotoristasEliminar, MotoristasListar } from "../../configuracion/apiUrls";

const EliminarMotorista = ({ datos, token, setListaMoristas, ActualizarLista }) => {
    const [eliminar, setEliminar] = useState(false);

    useEffect(() => {
        if (eliminar) {
            eliminarMotorista();
        }
        return () => setEliminar(false);
    }, [eliminar]);

    const eliminarMotoristaPregunta = () => {
        if (datos.tieneMovimientos) {
            mostraAlertaError(`El motorista "${datos.nombre} ${datos.apellido}" no se puede eliminar porque tiene movimientos asociados.`);
            return;
        }

        mostraAlertaPregunta(
            setEliminar,
            `¿Deseas eliminar al motorista "${datos.nombre} ${datos.apellido}" de forma permanente?`,
            "warning"
        );
    };

    const eliminarMotorista = async () => {
        if (!datos.id) {
            return mostraAlertaError("Seleccione un motorista");
        }


        if (datos.tieneMovimientos) {
            mostraAlertaError(`El motorista "${datos.nombre} ${datos.apellido}" no se puede eliminar porque tiene movimientos asociados.`);
            setEliminar(false);
            return;
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            await AxiosPrivado.delete(MotoristasEliminar + datos.id, config);

            mostraAlertaOk("Motorista eliminado correctamente");
            ActualizarLista(MotoristasListar, setListaMoristas);

        } catch (error) {
            console.error(error);
            const msjError = error.response?.data?.error || "Ocurrió un error desconocido al eliminar.";
            mostraAlertaError(msjError);
        } finally {
            setEliminar(false);
        }
    };

    return (
        <button type="button" className="btn btn-danger" onClick={eliminarMotoristaPregunta}>
            <i className="fas fa-trash" />
        </button>
    );
};

export default EliminarMotorista;