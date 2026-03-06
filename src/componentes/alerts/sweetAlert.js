import swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
const MySwal = withReactContent(swal);
const swalWithBootstrapButtons = MySwal.mixin({
    customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false,
    heightAuto: false
});

export function mostraAlerta(mensaje, icono, foco) {

    MySwal.fire({

        title: mensaje,
        icon: icono, //success, info, error, warning
        confirmButtonText: 'Aceptar',
        customClass: {
            confirmButton: 'btn-primary', // Clases de Bootstrap para el botón de confirmación
        },
    });
}

export function mostraAlertaOk(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'success', //success, info, error, warning
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 1500
    });
}
export function mostraAlertaPregunta(accion, mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'question', //success, info, error, warning
        confirmButtonText: 'Si',
        showConfirmButton: true,
        cancelButtonText: 'No',
        showCancelButton: true,
    }).then((re)=>{
        if(re.isConfirmed){
            accion(true)
        }else{
            accion(false)
        }
    });
}
export function mostraAlertaPreguntaFacturaccion(accion, mensaje, icono, foco) {
    MySwal.fire({
        title: mensaje,
        icon: icono || 'question',
        confirmButtonText: 'Factura',
        denyButtonText: 'Recibo',
        cancelButtonText: 'Crédito',
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        focusConfirm: true,
        heightAuto: false,
        scrollbarPadding: false
    }).then((result) => {
        if (result.isConfirmed) {
            accion("FA");
        } else if (result.isDenied) {
            accion("RE");
        } else if (result.dismiss === MySwal.DismissReason.cancel) {
            accion("CR");
        }
    });
}
export function mostraAlertaError(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'error', //success, info, error, warning
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 3000
    });
}
export function mostraAlertaWarning(mensaje, icono, foco) {
    MySwal.fire({

        title: mensaje,
        icon: 'warning', //success, info, error, warning
        confirmButtonText: 'Aceptar',
        showConfirmButton: false,
        timer: 3000
    });
}

export function mostraAlertaModificar(titulo, mensaje, peticion) {
    swalWithBootstrapButtons.fire({
        title: titulo,
        text: mensaje,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Modificar',
        cancelButtonText: 'Cancel!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            swalWithBootstrapButtons.fire(
                'Modificado',
                'Registro Modificado',
                'success'
            )
        } else if (
            /* Read more about handling dismissals below */
            result.dismiss === swal.DismissReason.cancel
        ) {
            swalWithBootstrapButtons.fire(
                'Cancelled',
                'Your imaginary file is safe :)',
                'error'
            )
        }
    });
}

export function mostraAlertaPersonalizada({
    titulo = "¿Estás seguro?",
    mensaje = "",
    icono = "question",
    textoConfirmacion = "Aceptar",
    textoCancelacion = "Cancelar",
    accion,
    foco = true
}) {
    MySwal.fire({
        title: titulo,
        text: mensaje,
        icon: icono, // success, info, error, warning, question
        confirmButtonText: textoConfirmacion,
        cancelButtonText: textoCancelacion,
        showConfirmButton: true,
        showCancelButton: true,
        focusCancel: !foco,
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            accion(true); // Acción para confirmar
        } else {
            accion(false); // Acción para cancelar
        }
    });
}

function onfocus(foco) {
    if (foco !== '') {
        document.getElementById(foco).focus();
    }
}