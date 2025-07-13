import { FormularioBancos } from "../../shared/components/layout/FormularioBancos"
import { NavBarComponent } from "../../shared/components/layout/NavBarComponent"
import { LogoComponent } from "../../shared/components/layout/LogoComponent"

export const BancosPage = () => {
    return (
        <div>
            <NavBarComponent />
            <LogoComponent />
            <h1>Bancos</h1>
            <FormularioBancos />
        </div>
    )
}
