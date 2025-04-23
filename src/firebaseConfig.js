// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics"; // Opcional: si quieres usar Analytics

// Configuración de Firebase leída desde las variables de entorno
const firebaseConfig = {
  // Asegúrate de que los nombres coincidan con los de tu archivo .env
  // Si usas Create React App, cambia 'import.meta.env.VITE_' por 'process.env.REACT_APP_'
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Opcional
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios que necesitarás
const auth = getAuth(app); // Servicio de Autenticación
// const analytics = getAnalytics(app); // Opcional: si quieres usar Analytics

// Exportar los servicios para usarlos en otros lugares de la app
export { app, auth }; // Exporta 'analytics' también si lo descomentas
