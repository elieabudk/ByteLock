
import { NavBarComponent } from "../../shared/components/layout/NavBarComponent";
import { LogoComponent } from "../../shared/components/layout/LogoComponent";
import { TableComponent } from "../../shared/components/Table/TableComponent";


export const BuscarPage = () => {

    const functionBuscar = () => {
        console.log("Buscar");
    }


    return (

        <>
        <NavBarComponent />
        <LogoComponent />
        <div className="container-fluid">
            <h1>Buscar</h1>
            <input type="text" placeholder="Buscar" className="form-control mb-3" />
            <div className="d-flex gap-2">
             
            
            </div>

            
        </div>
            <div className="row">
                <div className="col-md-12">
                    <TableComponent dataTable={[]} tittle="Tabla de bancos" />
                </div>
            </div>
        </>
    )
}
