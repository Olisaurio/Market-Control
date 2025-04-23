// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { App } from './App';
import { ProviderMarket } from './Context/Context';
import { AuthProvider } from './Context/AuthContext'; // 1. Importa AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProviderMarket>
        <App />
      </ProviderMarket>
    </AuthProvider>
  </StrictMode>
);
