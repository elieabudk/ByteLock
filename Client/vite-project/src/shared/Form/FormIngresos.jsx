import { useRef, useEffect } from "react";
import { fechaActual } from "../helpers/FechaActual";
import { FetchPostDatos } from "../helpers/FetchPostDatos";

export const FormIngresos = ({ label1 }) => {

    const formRef = useRef(null);
    const focusRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData)

        console.log('datos a enviar', data);
        const response = await FetchPostDatos('/api/guardar-ingresos', data);
        if (response) {
            // Limpiar el formulario
            formRef.current.reset();
            
            // Resetear manualmente el campo de fecha al valor actual
            const fechaInput = document.getElementById('fecha');
            if (fechaInput) {
                fechaInput.value = fechaActual();
            }
            
            // Devolver el foco al primer campo
            setTimeout(() => {
                focusRef.current.focus();
            }, 100);
            
          
        }
    }

    useEffect(() => {
        focusRef.current.focus();
        
    }, []);

    return (
        <div>
            <form ref={formRef} onSubmit={handleSubmit}>

                <div className="container-fluid mb-3 mt-4">
                    <h1>Ingresos</h1>
                    <label htmlFor="monto" className="form-label">Monto (€)</label>
                    <div className="input-group">
                        <span className="input-group-text">€</span>
                        <input 
                            ref={focusRef}
                            type="number" 
                            className="form-control" 
                            id="monto" 
                            name="monto" 
                            placeholder="0.00" 
                        />
                    </div>
                </div>

                <div className="container-fluid mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripcion</label>
                    <textarea
                        className="form-control"
                        id="descripcion"
                        name="descripcion"
                        rows="3"
                        placeholder="Ingrese una descripción detallada..."
                    ></textarea>
                </div>

                <div className="container-fluid mb-3">
                    <label htmlFor="fecha" className="form-label">Fecha</label>
                    <input type="date" className="form-control" id="fecha" name="fecha" defaultValue={fechaActual()} />
                </div>
                
                <div className="container-fluid mb-3 mt-4">
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </div>
            </form>
        </div>
    )
}
