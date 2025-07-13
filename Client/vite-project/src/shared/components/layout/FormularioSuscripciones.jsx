import { useRef, useEffect } from "react";
import { fechaActual } from "../../helpers/FechaActual";
import { FetchPostDatos } from "../../helpers/FetchPostDatos";
import { ModalShow } from "./ModalShow";

export const FormularioSuscripciones = () => {
    const formRef = useRef(null);
    const focusRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData)

        
        
        //console.log('datos a enviar', data);
        const response = await FetchPostDatos('/api/guardar-suscripciones', data);
        //console.log(response);

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
        <h1>Formulario de suscripciones</h1>

        <form ref={formRef} onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="pagina" className="form-label">Pagina</label>
                <input type="text" className="form-control" id="pagina" name="pagina" ref={focusRef}/>
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
