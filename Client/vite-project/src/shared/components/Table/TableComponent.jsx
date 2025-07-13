import React, { useState } from 'react';

export const TableComponent = ({ dataTable, title, edit = false, columns = [] }) => {
    const [visibleRows, setVisibleRows] = useState({});

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
    )
}
