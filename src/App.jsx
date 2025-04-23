
import React, { useState } from 'react';
import { useAuth } from './Context/AuthContext';
import { Auth } from './components/Auth';
import { NewProduct } from './components/NewProduct';
import { ListProducts } from './components/ListProducts';
import { StoreSelector } from './components/StoreSelector';
import { CategorySelector } from './components/CategorySelector';
import { PriceComparison } from './components/PriceComparison';
import { MonthlySummary } from './components/MonthlySummary';

// Importa los estilos CSS específicos de los componentes
import "./Styles/ListProducts.css";
import "./Styles/NewProduct.css";
import "./Styles/StoreSelector.css";
import "./Styles/CategorySelector.css";
// Importa los nuevos estilos de App
import './App.css'; // <-- Asegúrate que la ruta sea correcta

// Ya no necesitas los estilos en línea para la navegación aquí

export const App = () => {
  const { currentUser, loading } = useAuth();
  const [activeView, setActiveView] = useState('list'); // 'list', 'add', 'stores', 'categories', 'compare', 'summary'

  if (loading) {
      return <div>Cargando aplicación...</div>;
  }

  return (
      // Usa la clase del contenedor principal definida en App.css
      <div className="app-container">
          <header>
              <h1>Mi Lista de Mercado</h1>
              {/* El componente Auth se mostrará aquí si el usuario está logueado */}
              {currentUser && <Auth />}
          </header>

          {currentUser ? (
              <main>
                  {/* Usa className en lugar de style para la navegación */}
                  <nav className="main-nav">
                      <button
                          className={`nav-button ${activeView === 'list' ? 'active' : ''}`}
                          onClick={() => setActiveView('list')}
                      >
                          Ver Productos
                      </button>
                      <button
                          className={`nav-button ${activeView === 'add' ? 'active' : ''}`}
                          onClick={() => setActiveView('add')}
                      >
                          Añadir Producto
                      </button>
                      <button
                          className={`nav-button ${activeView === 'stores' ? 'active' : ''}`}
                          onClick={() => setActiveView('stores')}
                      >
                          Gestionar Tiendas
                      </button>
                      <button
                          className={`nav-button ${activeView === 'categories' ? 'active' : ''}`}
                          onClick={() => setActiveView('categories')}
                      >
                          Gestionar Categorías
                      </button>
                      <button
                          className={`nav-button ${activeView === 'compare' ? 'active' : ''}`}
                          onClick={() => setActiveView('compare')}
                      >
                          Comparar Precios
                      </button>
                      <button
                          className={`nav-button ${activeView === 'summary' ? 'active' : ''}`}
                          onClick={() => setActiveView('summary')}
                      >
                          Resumen Mensual
                      </button>
                  </nav>

                  <div className="main-content">
                      {activeView === 'list' && <ListProducts />}
                      {activeView === 'add' && <NewProduct />}
                      {activeView === 'stores' && <StoreSelector />}
                      {activeView === 'categories' && <CategorySelector />}
                      {activeView === 'compare' && <PriceComparison />}
                      {activeView === 'summary' && <MonthlySummary />}
                  </div>
              </main>
          ) : (
              // --- Usuario NO LOGUEADO ---
              // Muestra solo el componente Auth si no hay usuario
              // Puedes envolverlo en un div con clase si necesitas estilos específicos
              <div className="auth-container"> {/* Ejemplo de clase */}
                  <Auth />
              </div>
          )}
          <footer>
              {/* El enlace de ayuda que agregaste */}
              <a href="mailto:soporte@tuapp.com?subject=Solicitud de Soporte App">¿Necesitas Ayuda?</a>
          </footer>
      </div>
  );
};
