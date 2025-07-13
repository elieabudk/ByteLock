   // middlewares/auth.js
   import jwt from 'jsonwebtoken';

   export const authMiddleware = (req, res, next) => {
     try {
       // Obtener el token del header de Authorization
       const authHeader = req.headers.authorization;
       
       if (!authHeader || !authHeader.startsWith('Bearer ')) {
         return res.status(401).json({ message: 'Token no proporcionado' });
       }
       
       // Extraer el token (quitar "Bearer ")
       const token = authHeader.split(' ')[1];
       
       // Verificar el token
       const decoded = jwt.verify(token, process.env.JWT_SECRET);
       
       // Añadir usuario al objeto request
       req.userId = decoded.id;
       
       next();
     } catch (error) {
       return res.status(401).json({ message: 'Token inválido' });
     }
   };