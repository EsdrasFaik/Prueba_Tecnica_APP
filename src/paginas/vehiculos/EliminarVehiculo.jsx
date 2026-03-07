import { mostraAlertaError, mostraAlertaOk, mostraAlertaPregunta } from "../../componentes/alerts/sweetAlert";
import { useEffect, useState } from "react";
import { AxiosPrivado } from "../../componentes/axios/Axios";
import { VehiculosEliminar, VehiculoListar } from "../../configuracion/apiUrls";

const EliminarVehiculo = ({ datos, token, setListaVehiculos, ActualizarLista }) => {
    const [eliminar, setEliminar] = useState(false);

    useEffect(() => {
        if (eliminar) {
            eliminarVehiculo();
        }
        return () => setEliminar(false);
    }, [eliminar]);

    const eliminarVehiculoPregunta = () => {
        if (datos.tieneMovimientos) {
            mostraAlertaError(`El vehículo "${datos.placa} - ${datos.modelo}" no se puede eliminar porque tiene movimientos asociados.`);
            return;
        }

        mostraAlertaPregunta(
            setEliminar,
            `¿Deseas eliminar el vehículo "${datos.placa} - ${datos.modelo}" de forma permanente?`,
            "warning"
        );
    };

    const eliminarVehiculo = async () => {
        if (!datos.id) {
            return mostraAlertaError("Seleccione un vehículo");
        }

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };
            await AxiosPrivado.delete(VehiculosEliminar + datos.id, config);

            mostraAlertaOk("Vehículo eliminado correctamente");
            ActualizarLista(VehiculoListar, setListaVehiculos);

        } catch (error) {
            console.error(error);
            const msjError = error.response?.data?.error || "Ocurrió un error desconocido al eliminar.";
            mostraAlertaError(msjError);
        } finally {
            setEliminar(false);
        }
    };

    return (
        <button type="button" className="btn btn-danger" onClick={eliminarVehiculoPregunta}>
            <i className="fas fa-trash" />
        </button>
    );
};

export default EliminarVehiculo;