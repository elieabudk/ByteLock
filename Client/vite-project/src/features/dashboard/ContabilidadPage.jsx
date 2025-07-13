import { useState, useEffect } from "react";
import { FormularioContabilidad } from "../../shared/components/layout/FormularioContabilidad"
import { FormIngresos } from "../../shared/Form/FormIngresos"
import { NavBarComponent } from "../../shared/components/layout/NavBarComponent"
import { LogoComponent } from "../../shared/components/layout/LogoComponent"
import { FetchGetDatos } from "../../shared/helpers/FetchGetDatos"
import { FetchPostDatos } from "../../shared/helpers/FetchPostDatos"
import { TableComponent2 } from "../../shared/components/Table/TableComponent2"
import { BtnUniversal } from "../../shared/components/btn/BtnUniversal"
import { fechaActual } from "../../shared/helpers/FechaActual";
import "../../assets/styles/ContabilidadPage.css";

export const ContabilidadPage = () => {

    const [datos, setDatos] = useState([]);
    const [datosFiltrados, setDatosFiltrados] = useState([]);
    const [fecha, setFecha] = useState(fechaActual());
    const [montoDisponible, setMontoDisponible] = useState(0);
    const [totalIngresos, setTotalIngresos] = useState(0);
    const [totalEgresos, setTotalEgresos] = useState(0);

    const peticion = async () => {
        const datos = await FetchPostDatos("/api/obtener-egresos", { fecha: fecha });
        console.log("datos egresos: ", datos);
        const datosFiltrados = datos.map(dato => ({
            descripcion: dato.descripcion,
            fecha: dato.fecha.split("T")[0],
            monto: dato.monto.toFixed(2),
            
        }));
        const totalEgresosCalculado = datosFiltrados.reduce((acc, dato) => acc + parseFloat(dato.monto), 0);
        setTotalEgresos(totalEgresosCalculado);
        setDatos(datos);
        setDatosFiltrados(datosFiltrados);
    }

    const peticion2 = async () => {
        const datos = await FetchPostDatos("/api/obtener-ingresos", { fecha: fecha });
        console.log("datos ingresos: ", datos);
        const datosFiltrados = datos.map(dato => ({
            descripcion: dato.descripcion,
            fecha: dato.fecha.split("T")[0],
            monto: dato.monto.toFixed(2),
            
        }));
        const totalIngresosCalculado = datosFiltrados.reduce((acc, dato) => acc + parseFloat(dato.monto), 0);
        setTotalIngresos(totalIngresosCalculado);
    }

    // useEffect para calcular monto disponible cuando cambien los totales
    useEffect(() => {
        const disponible = totalIngresos - totalEgresos;
        setMontoDisponible(disponible.toFixed(2));
    }, [totalIngresos, totalEgresos]);

    // useEffect para cargar datos iniciales
    useEffect(() => {
        peticion2();
        peticion();
    }, []);

    // Función para manejar el filtrado por fecha
    const handleFiltrarPorFecha = async () => {
        await peticion2();
        await peticion();
    };

    return (
        <>
            <NavBarComponent />
            <LogoComponent />
            <div className="container">
                <div className="container-fluid">
                    <div className="row">
                        {/* Formularios */}
                        <div className="col-md-6">
                            <div className="card">
                                <div className="cardHeader">
                                    📈 Registro de Ingresos
                                </div>
                                <FormIngresos label1="Ingresos" />
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="card">
                                <div className="cardHeader">
                                    📊 Registro de Gastos
                                </div>
                                <FormularioContabilidad />
                            </div>
                        </div>

                        {/* Tabla */}
                        <div className="col-md-12">
                            <div className="tableContainer">
                                <TableComponent2 dataTable={datosFiltrados} title="📋 Tabla de Gastos" />
                            </div>
                        </div>

                        {/* Filtro por fecha */}
                        <div className="col-md-12">
                            <div className="dateSection">
                                <div className="row align-items-end">
                                    <div className="col-md-3">
                                        <label className="dateLabel">🗓️ Búsqueda por Mes</label>
                                        <input 
                                            type="date" 
                                            className="dateInput"
                                            value={fecha} 
                                            onChange={(e) => setFecha(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-3">
                                        <button 
                                            className="filterButton"
                                            onClick={handleFiltrarPorFecha}
                                        >
                                            🔍 Filtrar por Fecha
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Resumen financiero */}
                        <div className="col-md-12">
                            <div className="summaryContainer">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="summaryCard incomeCard">
                                            <div className="summaryTitle">💰 Total Ingresos</div>
                                            <h3 className="summaryAmount incomeAmount">
                                                ${totalIngresos.toFixed(2)}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="summaryCard expenseCard">
                                            <div className="summaryTitle">💸 Total Egresos</div>
                                            <h3 className="summaryAmount expenseAmount">
                                                ${totalEgresos.toFixed(2)}
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="summaryCard availableCard">
                                            <div className="summaryTitle">💳 Monto Disponible</div>
                                            <h3 className="summaryAmount availableAmount">
                                                ${montoDisponible}
                                            </h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
