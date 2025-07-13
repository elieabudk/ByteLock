import { useState, useEffect } from "react";

export const useFetchData = (url) => {

    const [state, setState] = useState({
        data: null,
        isLoading: true,
        error: null
    });

    const getFetch = async (url) => {

        try {
            const response = await fetch(url);
            const data = await response.json();
            setState({
                data: data,
                isLoading: false,
                error: null
            });
        } catch (error) {
            setState({
                data: null,
                isLoading: false,
                error: error
            });
            console.error(error) //info para nosotros
        }    
    }
    
    useEffect(() => {
        if(!url) return;
        getFetch(url);
    }, [url]);

    return {
        data: state.data,
        isLoading: state.isLoading,
        error: state.error
    }
}
