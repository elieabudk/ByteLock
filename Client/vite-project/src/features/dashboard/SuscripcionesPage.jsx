import { FormularioSuscripciones } from "../../shared/components/layout/FormularioSuscripciones";
import { NavBarComponent } from "../../shared/components/layout/NavBarComponent";
import { LogoComponent } from "../../shared/components/layout/LogoComponent";
import { PasswordGeneratorSeguro } from "../../shared/components/passwordgenerator/PasswordGenerator";

export const SuscripcionesPage = () => {

    return (
        <>
        <NavBarComponent />
        <LogoComponent />
        <FormularioSuscripciones />
        <PasswordGeneratorSeguro />
        </>
    )
}
