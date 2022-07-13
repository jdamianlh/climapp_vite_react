import { useState, createContext } from "react";

const ClimaContext = createContext()

const ClimaProvider = ({children}) =>{

    const [busqueda, setBusqueda] = useState({
        ciudad: '',
        pais: ''
    })

    const [resultado, setResultado] = useState({})
    const [cargando, setCargando] = useState(false)
    const [noResultado, setNoResultado] = useState(false)

    const datosBusqueda = e =>{
        setBusqueda({
            ...busqueda,
            [e.target.name] : e.target.value
        })
    }

    const consultarClima = async datos =>{
        setCargando(true)
        setNoResultado(false)
        try{
            const {ciudad, pais} = datos

            const appId = import.meta.env.VITE_API_KEY

            const url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${appId}`

            const respuesta = await fetch(url)

            const resultado = await respuesta.json()

            const {lat, lon} = resultado[0]

            const urlClima = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`

            const fethClima = await fetch(urlClima)

            const clima = await fethClima.json()

             setResultado(clima)
             
        }catch(error){
            setNoResultado('No hay resultados')
        } finally{
            setCargando(false)
        }
        
    }

    return(
        <ClimaContext.Provider
            value={{
                busqueda,
                datosBusqueda,
                consultarClima,
                setResultado,
                resultado,
                cargando,
                noResultado
            }}
        >
            {children}
        </ClimaContext.Provider>
    )
}

export {
    ClimaProvider
}

export default ClimaContext