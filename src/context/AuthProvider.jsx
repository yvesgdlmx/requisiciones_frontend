import { useState, useEffect, createContext } from 'react'
import clienteAxios from './../config/clienteAxios'

const AuthContext = createContext();

const AuthProvider = ({children}) => {

    const [auth, setAuth] = useState({})
    const [cargando, setCargando] = useState(true)

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            if(!token){
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }

            try {
                const { data } = await clienteAxios.get('/usuarios/perfil', config)
                setAuth(data)
                console.log('Usuario autenticado:', data)
            } catch (error) {
                // Si falla la verificación, limpiamos token y auth
                console.error('Error al autenticar usuario:', error?.response?.data || error.message)
                localStorage.removeItem('token')
                setAuth({})
            } finally {
                setCargando(false)
            }            
        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        localStorage.removeItem('token')
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export { AuthProvider }
export default AuthContext;
