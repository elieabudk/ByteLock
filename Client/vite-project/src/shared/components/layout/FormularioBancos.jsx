import { FetchPostDatos } from "../../helpers/FetchPostDatos";
import { useRef, useEffect } from "react";
import { fechaActual } from "../../helpers/FechaActual";
import { ModalShow } from "./ModalShow";

export const FormularioBancos = () => {
    const focusRef = useRef(null);
    const formRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData)
        
        const response = await FetchPostDatos('/api/guardar-datos-bancarios', data);
        
        if (response) {
            // Limpiar el formulario
            formRef.current.reset();
            // Mostrar el modal
            const modal = new bootstrap.Modal(document.getElementById('exampleModal'));
            modal.show();
        }
    }

    useEffect(() => {
        focusRef.current.focus();
    }, []);
    
    return (
        <div className="container-fluid">
            <h1>Formulario de bancos</h1>

            <form ref={formRef} onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="banco" className="form-label">Banco</label>
                    <input type="text" className="form-control" id="banco" name="banco" ref={focusRef}/>
                </div>
                <div className="mb-3">
                    <label htmlFor="usuario" className="form-label">Usuario</label>
                    <input type="text" className="form-control" id="usuario" name="usuario"/>
                </div>

                <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input type="email" className="form-control" id="email" name="email"/>
                </div>


                <div className="mb-3">
                    <label htmlFor="clave" className="form-label">Clave</label>
                    <input type="text" className="form-control" id="clave" name="clave"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="numeroIBAN" className="form-label">Numero IBAN</label>
                    <input type="text" className="form-control" id="numeroIBAN" name="numeroIBAN"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="numeroTarjeta" className="form-label">Numero Tarjeta</label>
                    <input type="text" className="form-control" id="numeroTarjeta" name="numeroTarjeta"/>
                    
                </div>

                <div className="mb-3">  
                    <label htmlFor="claveCajero" className="form-label">Clave Cajero</label>
                    <input type="text" className="form-control" id="claveCajero" name="claveCajero"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="codigoPin" className="form-label">Codigo Pin</label>
                    <input type="text" className="form-control" id="codigoPin" name="codigoPin"/>
                </div>

                <div className="mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <input type="date" className="form-control" id="fecha" name="fecha" defaultValue={fechaActual()}/>
                </div>

                <div className="mb-3">
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
            </form>
            <ModalShow title="Datos guardados" body="Los datos se han guardado correctamente"/>
            
        </div>
    )
}
