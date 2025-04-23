// src/Context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../firebaseConfig'; // Asegúrate que la ruta sea correcta
import { onAuthStateChanged } from 'firebase/auth';

// 1. Crear el Contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
    return useContext(AuthContext);
};

// 2. Crear el Proveedor del Contexto
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true); // Para saber si ya se verificó el estado inicial

    useEffect(() => {
        // onAuthStateChanged devuelve una función para desuscribirse (unsubscribe)
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user); // user será null si no hay sesión, o el objeto usuario si sí la hay
            setLoading(false); // Marca que la carga inicial ha terminado
            console.log("AuthProvider: Estado de Auth cambiado, usuario:", user);
        });

        // Limpieza: Se ejecuta cuando el componente se desmonta
        // Esto evita fugas de memoria al desuscribirse del listener
        return unsubscribe;
    }, []); // El array vacío asegura que el efecto se ejecute solo una vez (al montar)

    // Valores que serán expuestos por el contexto
    const value = {
        currentUser,
        loading // Exponemos loading también por si algún componente lo necesita
    };

    // Renderiza los componentes hijos solo cuando no esté cargando (opcional, pero útil)
    // O simplemente renderiza siempre y deja que los hijos decidan qué mostrar
    return (
        <AuthContext.Provider value={value}>
            {/* Puedes mostrar un loader global aquí si prefieres */}
            {/* {loading ? <div>Cargando aplicación...</div> : children} */}
            {children}
        </AuthContext.Provider>
    );
};
