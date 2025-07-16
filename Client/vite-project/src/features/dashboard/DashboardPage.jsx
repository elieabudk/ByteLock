import { NavBarComponent } from "../../shared/components/layout/NavBarComponent";
import { LogoComponent } from "../../shared/components/layout/LogoComponent";
import { TableComponent } from "../../shared/components/Table/TableComponent";
import { FetchGetDatos } from "../../shared/helpers/FetchGetDatos";
import "../../assets/styles/DasboardPage.css";
import { useEffect, useState } from "react";

export const DashboardPage = () => {

    const [datos, setDatos] = useState([]);
    const [refresh, setRefresh] = useState(false);


    const peticion = async () => {
        const datos = await FetchGetDatos("/api/obtener-datos-bancarios");
        console.log(datos);
        setDatos(datos);
    }

    const [datosSuscripciones, setDatosSuscripciones] = useState([]);
    const peticionSuscripciones = async () => {
        const datos = await FetchGetDatos("/api/obtener-suscripciones");
        console.log(datos);
        setDatosSuscripciones(datos);
    }

    const actualizarDatos = () => {
        setRefresh(prev => !prev);
    }



    useEffect(() => {
        peticion();
        peticionSuscripciones();
    }, [refresh]);
    
    return (
        <>
        <NavBarComponent />
        <LogoComponent />
        
        <h1>Dashboard</h1>
        <div className="container-fluid py-3">
            <div className="table-container">
                <h2>Bancos</h2>
                <TableComponent dataTable={datos} tittle="Bancos"
                columns={["banco", "usuario", "email", "clave", "numeroIBAN","numeroTarjeta","claveCajero","codigoPin"]}
                onActualizar={actualizarDatos}
                />
            </div>
        </div>
        <div className="container-fluid py-3">
            <div className="table-container">
                <h2>Suscripciones</h2>
                <TableComponent dataTable={datosSuscripciones} tittle="Suscripciones"
                columns={["pagina", "usuario", "email", "clave", "_id"]}
                onActualizar={actualizarDatos}
                />
            </div>
        </div>
        </>
    )
}
