/**
 * Limpia y sanitiza los datos recibidos del frontend
 * @param {object} objeto - Objeto con los datos a limpiar
 * @returns {object} - Objeto con los datos limpios
 */
export const limpiarDatos = (objeto) => {
    if (!objeto || typeof objeto !== 'object') {
        throw new Error('La función limpiarDatos espera recibir un objeto');
    }

    const objetoLimpio = {};

    for (const [clave, valor] of Object.entries(objeto)) {
        if (valor === null || valor === undefined) {
            objetoLimpio[clave] = valor;
            continue;
        }

        if (valor instanceof Date) {
            // Si es una fecha, la mantenemos tal cual
            objetoLimpio[clave] = valor;
        } else if (typeof valor === 'string') {
            // Limpiamos espacios al inicio y final
            let valorLimpio = valor.trim();
            // Convertimos a minúsculas
            valorLimpio = valorLimpio.toLowerCase();
            // Eliminamos caracteres especiales que podrían usarse para inyección de código
            // Mantenemos letras, números, espacios, @ y algunos caracteres básicos
            valorLimpio = valorLimpio.replace(/[^a-z0-9\sáéíóúüñ.,-@]/g, '');
            objetoLimpio[clave] = valorLimpio;
        } else if (typeof valor === 'number') {
            // Si es un número, lo mantenemos tal cual
            objetoLimpio[clave] = valor;
        } else if (typeof valor === 'boolean') {
            // Si es un booleano, lo mantenemos tal cual
            objetoLimpio[clave] = valor;
        } else if (Array.isArray(valor)) {
            // Si es un array, limpiamos cada elemento
            objetoLimpio[clave] = valor.map(item => limpiarDatos({ item }).item);
        } else if (typeof valor === 'object') {
            // Si es un objeto anidado, lo limpiamos recursivamente
            objetoLimpio[clave] = limpiarDatos(valor);
        } else {
            // Para cualquier otro tipo, lo mantenemos tal cual
            objetoLimpio[clave] = valor;
        }
    }

    return objetoLimpio;
}


