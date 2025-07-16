import { useState } from 'react';
import { FetchEliminar } from '../../helpers/FetchEliminar';


export const TableComponent = ({ dataTable, title, edit = false, columns = [], onActualizar }) => {
    const [visibleRows, setVisibleRows] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Validación: no renderizar si no hay datos
    if (!dataTable || !Array.isArray(dataTable) || dataTable.length === 0) {
        return (
            <div className="table-container">
                <p className="text-center text-muted p-4">No hay datos para mostrar</p>
            </div>
        );
    }

    const toggleRowVisibility = (rowIndex) => {
        setVisibleRows(prev => ({
            ...prev,
            [rowIndex]: !prev[rowIndex]
        }));
    };

    const maskValue = (value) => {
        return '*'.repeat(value?.length || 0);
    };

    const isRowVisible = (rowIndex) => {
        return visibleRows[rowIndex];
    };

    const handleDeleteClick = (index) => {
        setItemToDelete(index);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = async () => {
        if (itemToDelete !== null) {
            setIsDeleting(true);
            console.log('🔄 Iniciando eliminación desde TableComponent...');
            
            try {
                const result = await FetchEliminar(itemToDelete, dataTable, onActualizar);
                console.log('✅ Resultado de eliminación:', result);
                
                if (result) {
                    console.log('🎉 Eliminación exitosa');
                } else {
                    console.error('❌ Error en la eliminación');
                    // Aquí podrías mostrar un mensaje de error al usuario
                    alert('Error al eliminar el elemento. Por favor, intenta de nuevo.');
                }
            } catch (error) {
                console.error('💥 Error inesperado:', error);
                alert('Error inesperado al eliminar. Por favor, intenta de nuevo.');
            } finally {
                setIsDeleting(false);
            }
        }
        setShowConfirmModal(false);
        setItemToDelete(null);
    };

    const handleCancelDelete = () => {
        setShowConfirmModal(false);
        setItemToDelete(null);
    };

    // Si no hay columnas definidas, usar las claves del primer elemento de dataTable
    // Pero filtrar el _id para que no se muestre
    const allColumns = columns.length > 0 ? columns : 
        (dataTable.length > 0 ? Object.keys(dataTable[0]) : []);
    
    // Filtrar las columnas para ocultar _id
    const tableColumns = allColumns.filter(column => column !== '_id');

    return (
        <>
            <div className="container-fluid py-4">
                <h1 className="mb-4">{title}</h1>
                <div className="table-responsive">
                    <table className="table table-striped table-hover">
                        <thead className="table-light">
                            <tr>
                                {tableColumns.map((column) => (
                                    <th key={column} scope="col">{column}</th>
                                ))}
                                <th scope="col">Visibilidad</th>
                                {edit && <th scope="col">Acciones</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {dataTable.map((item, index) => (
                                <tr key={index}>
                                    {tableColumns.map((column) => (
                                        <td key={column}>
                                            {column === tableColumns[0] ? (
                                                item[column] || '-'
                                            ) : (
                                                <span>
                                                    {isRowVisible(index) ? item[column] : maskValue(item[column])}
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                    <td>
                                        <button 
                                            className="btn btn-sm btn-outline-secondary"
                                            onClick={() => toggleRowVisibility(index)}
                                        >
                                            <i className={`bi bi-eye${isRowVisible(index) ? '-fill' : ''}`}></i>
                                        </button>
                                        <button 
                                            className="btn btn-sm btn-outline-danger ms-1"
                                            onClick={() => handleDeleteClick(index)}
                                            title="Eliminar fila"
                                        >
                                            <i className="bi bi-x-lg"></i>
                                        </button>
                                    </td>
                                    {edit && (
                                        <td>
                                            <button className="btn btn-primary btn-sm me-2">Editar</button>
                                            <button className="btn btn-danger btn-sm">Eliminar</button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de confirmación - FUERA del contenedor padre */}
            {showConfirmModal && (
                <div className="modal fade show d-block" id="confirmDeleteModal" tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" style={{backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1050}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="confirmDeleteModalLabel">Confirmar eliminación</h5>
                                <button type="button" className="btn-close" onClick={handleCancelDelete} aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <p>¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCancelDelete}>
                                    Cancelar
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-danger" 
                                    onClick={handleConfirmDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Eliminando...
                                        </>
                                    ) : (
                                        'Eliminar'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
