// src/components/Auth.jsx
import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import { auth } from '../firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    FacebookAuthProvider,
    signOut
} from "firebase/auth";


const styles = {
    container: {
        border: '1px solid #ccc',
        padding: '20px',
        margin: '20px 0',
        borderRadius: '8px',
        maxWidth: '400px',
    },
    input: {
        display: 'block',
        width: 'calc(100% - 22px)',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
    },
    button: {
        padding: '10px 15px',
        marginRight: '10px',
        marginBottom: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: '#007bff',
        color: 'white',
    },
    socialButton: {
        padding: '10px 15px',
        marginRight: '10px',
        marginBottom: '10px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    googleButton: { backgroundColor: '#db4437', color: 'white' },
    githubButton: { backgroundColor: '#333', color: 'white' },
    facebookButton: { backgroundColor: '#3b5998', color: 'white' },
    logoutButton: { backgroundColor: '#dc3545', color: 'white' },
    error: { color: 'red', marginBottom: '10px' },
    userInfo: { marginBottom: '10px' },
    avatar: { borderRadius: '50%', marginRight: '10px', verticalAlign: 'middle' }
};


export const Auth = () => {
    const { currentUser, loading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');
        if (!email || !password) {
            setError("Por favor, ingresa correo y contraseña.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Usuario registrado exitosamente.", user);
            localStorage.setItem('userId', user.uid);
            // ------------------------------------------
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(`Error al registrar: ${err.message}`);
            console.error("Error al registrar:", err);
        }
    };

    const handleLogin = async () => {
        setError('');
        if (!email || !password) {
            setError("Por favor, ingresa correo y contraseña.");
            return;
        }
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("Inicio de sesión exitoso.", user);

            localStorage.setItem('userId', user.uid);
            // -----------------------------------------------
            setEmail('');
            setPassword('');
        } catch (err) {
            setError(`Error al iniciar sesión: ${err.message}`);
            console.error("Error al iniciar sesión:", err);
        }
    };

    const handleProviderLogin = async (provider) => {
        setError('');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(`Inicio de sesión con ${provider.providerId} exitoso.`, user);

            localStorage.setItem('userId', user.uid);
            // -----------------------------------------------------------
        } catch (err) {
            setError(`Error con ${provider.providerId}: ${err.message}`);
            console.error(`Error con ${provider.providerId}:`, err);
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Ventana de inicio de sesión cerrada.');
            } else if (err.code === 'auth/account-exists-with-different-credential') {
                setError('Ya existe una cuenta con este correo usando otro método.');
            }
        }
    };

    const handleGoogleLogin = () => handleProviderLogin(new GoogleAuthProvider());
    const handleGithubLogin = () => handleProviderLogin(new GithubAuthProvider());
    const handleFacebookLogin = () => handleProviderLogin(new FacebookAuthProvider());

    const handleLogout = async () => {
        setError('');
        try {
            await signOut(auth);
            console.log("Usuario cerró sesión");
            localStorage.removeItem('userId');
            // ----------------------------------------------
        } catch (err) {
            setError(`Error al cerrar sesión: ${err.message}`);
            console.error("Error al cerrar sesión:", err);
        }
    };

    if (loading) {
        return <div>Verificando autenticación...</div>;
    }

    return (
        <div style={styles.container}>
            <h2>Autenticación</h2>

            {currentUser ? (
                <div>
                    <div style={styles.userInfo}>
                        {currentUser.photoURL && (
                            <img
                                src={currentUser.photoURL}
                                alt="Avatar"
                                width="40"
                                style={styles.avatar}
                            />
                        )}
                        <span>Bienvenido: {currentUser.displayName || currentUser.email}</span>
                    </div>
                     {error && <p style={styles.error}>{error}</p>}
                    <button onClick={handleLogout} style={{...styles.button, ...styles.logoutButton}}>
                        Cerrar Sesión
                    </button>
                </div>
            ) : (
                <div>
                    <h3>Iniciar Sesión / Registrarse</h3>
                    {error && <p style={styles.error}>{error}</p>}\
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        aria-label="Correo electrónico"
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        aria-label="Contraseña"
                    />
                    <div>
                        <button onClick={handleLogin} style={styles.button}>Iniciar Sesión</button>
                        <button onClick={handleRegister} style={styles.button}>Registrarse</button>
                    </div>

                    <hr style={{ margin: '20px 0' }} />
                    <p>O inicia sesión con:</p>
                    <div>
                        <button onClick={handleGoogleLogin} style={{...styles.socialButton, ...styles.googleButton}}>
                            Google
                        </button>
                        <button onClick={handleGithubLogin} style={{...styles.socialButton, ...styles.githubButton}}>\
                            GitHub
                        </button>
                        <button onClick={handleFacebookLogin} style={{...styles.socialButton, ...styles.facebookButton}}>
                            Facebook
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
