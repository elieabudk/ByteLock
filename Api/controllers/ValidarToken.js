// Controlador para validar tokens
export const validarToken = (req, res) => {
    try {
        // Si llegamos aquí, el token es válido (el middleware ya lo verificó)
        return res.status(200).json({ 
            valid: true, 
            message: 'Token válido',
            userId: req.userId 
        });
    } catch (error) {
        return res.status(401).json({ 
            valid: false, 
            message: 'Token inválido' 
        });
    }
}; 