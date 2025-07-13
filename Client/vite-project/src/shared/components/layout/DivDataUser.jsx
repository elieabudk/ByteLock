import { useState, useEffect, useMemo } from 'react';

export const DivDataUser = () => {

    const [dataUser, setDataUser] = useState([]);
    const [show, setShow] = useState();


    const peticionFetch = async () => {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/users');    
            const data = await response.json();
            setDataUser(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    //Estructura de un usememo
//    useMemo(() => 
//    {
        
//    }
//    , [dataUser])

    //Haciendo un pequenio cambio antes de mostrar los datos
    const dataModificada = useMemo(() => {
        console.log('Modificando datos !! soy la función modificadora');
        return dataUser.map((user) => {
            return {...user, nombreCompleto: `${user.name} (${user.username})`};
        })
    }, [dataUser])

//    const dataModificada = dataUser.map((user) => {
//        console.log("modificando datos !! soy la funci'on modificadora");
//            return {...user, nombreCompleto: `${user.name} (${user.username})`};
//})
    

    useEffect(() => {
        peticionFetch();
    }, []);
    return (
        <>
      
        <div>
            <h1>Datos del usuario</h1>
           <div>
            {dataModificada.map((user) => (
                <div key={user.id}>{user.nombreCompleto}</div>
            ))}
           </div>
           <div>    
            <button onClick={() => setShow(!show)}>{show ? 'Ocultar' : 'Mostrar'}</button>
           </div>
           
         
        </div>
        
        </>
    );
}
