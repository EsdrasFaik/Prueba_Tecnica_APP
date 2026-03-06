export const regexIdentidad = /^\d{13}$/;//validar identidad
export const regexRTN = /^\d{14}$/;//validar identidad
export const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;//validar correo
export const regexContrasena = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{6,15}$/;
export const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]{3,}$/;
export const regexNombreVacio = /^$|^[a-zA-Z\s]{3,50}$/;
export const regexDescripcion = /^$|^.{10,250}$/;
export const regexEntero = /^\d+$/;
export const regexDecimal = /^\d+(\.\d+)?$/;
export const regexEAN13 = /^\d{13}$/;
export const regexUPC = /^\d{4,15}$/;
export const regexCODE = /^[a-zA-Z0-9\s]{4,15}$/;
export const regexTelefono = /^\d{8,12}$/;
export const regexAbreviatura = /^[a-zA-Z0-9.]{1,10}$/;