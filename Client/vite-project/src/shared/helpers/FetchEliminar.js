export const FetchEliminar = async (index, dataTable, onActualizar) => {
    // Validaciones para evitar errores
    
    if (!dataTable || !Array.isArray(dataTable) || index < 0 || index >= dataTable.length) {
        console.error('Error: dataTable inválido o índice fuera de rango');
        return;
    }
    
    const item = dataTable[index];
    if (!item || !item._id) {
        console.error('Error: item inválido o sin _id');
        return;
    }
    
    const itemId = item._id;
    const token = localStorage.getItem('token');
    



    // primero revisamos el header de la table y si tiene la palabra banco y numero IBAN entonces hacemos la peticion a la api de eliminar-datos-bancarios
    // si tiene la palabra pagina entonces hacemos la peticion a la api de eliminar-suscripciones
    try {
    if (item.banco && item.numeroIBAN) {
        const response = await fetch(`http://localhost:3000/api/eliminar-datos-bancarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ _id: itemId })
        });
        if (response.ok) {
            if (typeof onActualizar === 'function') {
                onActualizar();
            }
        }
    } else if (item.pagina) {
        const response = await fetch(`http://localhost:3000/api/eliminar-suscripcion`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ _id: itemId })
        });

        if (response.ok) {
            if (typeof onActualizar === 'function') {
                onActualizar();
            }
        }
    }
    
 
    
    
} catch (error) {
    console.error('Error al eliminar:', error);
}

   
    
    

}