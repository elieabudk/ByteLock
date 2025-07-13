import React from 'react';

export const TableComponent2 = ({ dataTable = [], title, edit = false, columns = [] }) => {
    // Validación temprana para evitar errores
    if (!Array.isArray(dataTable)) {
        return (
            <div className="container-fluid py-4">
                <h1 className="mb-4">{title}</h1>
                <div className="alert alert-warning">
                    No hay datos disponibles para mostrar.
                </div>
            </div>
        );
    }

    // Si no hay columnas definidas, usar las claves del primer elemento de dataTable
    const tableColumns = columns.length > 0 ? columns : 
        (dataTable.length > 0 ? Object.keys(dataTable[0]) : []);

    return (
        <div className="container-fluid py-4">
            <h1 className="mb-4">{title}</h1>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-light">
                        <tr>
                            {tableColumns.map((column) => (
                                <th key={column} scope="col">{column}</th>
                            ))}
                            {edit && (
                                <th scope="col">Acciones</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable.length === 0 ? (
                            <tr>
                                <td colSpan={tableColumns.length + (edit ? 1 : 0)} className="text-center">
                                    No hay datos disponibles
                                </td>
                            </tr>
                        ) : (
                            dataTable.map((item, index) => (
                                <tr key={item.id || `row-${index}`}>
                                    {tableColumns.map((column) => (
                                        <td key={column}>
                                            {item[column] || '-'}
                                        </td>
                                    ))}
                                    {edit && (
                                        <td>
                                            <button className="btn btn-primary btn-sm me-2">Editar</button>
                                            <button className="btn btn-danger btn-sm">Eliminar</button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                
            </div>
        </div>
    );
};

