import React, { useContext, useState } from 'react';
import { ContextMarket } from '../Context/Context';

export const StoreSelector = () => {
    const { 
        stores, 
        selectedStore, 
        setSelectedStore, 
        addStore, 
        deleteStore 
    } = useContext(ContextMarket);
    
    const [newStoreName, setNewStoreName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    // Manejar agregar nueva tienda
    const handleAddStore = (e) => {
        e.preventDefault();
        
        if (!newStoreName.trim()) {
            setErrorMessage('Por favor, introduce un nombre para la tienda.');
            return;
        }
        
        // Verificar si ya existe una tienda con ese nombre
        const storeExists = stores.some(
            store => store.name.toLowerCase() === newStoreName.trim().toLowerCase()
        );
        
        if (storeExists) {
            setErrorMessage('Ya existe una tienda con este nombre.');
            return;
        }
        
        // Agregar la nueva tienda
        addStore(newStoreName.trim());
        
        // Limpiar el formulario y mostrar mensaje de éxito
        setNewStoreName('');
        setErrorMessage('');
        setSuccessMessage('Tienda agregada correctamente.');
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };
    
    // Manejar eliminar tienda
    const handleDeleteStore = (storeId) => {
        const result = deleteStore(storeId);
        
        if (!result.success) {
            setErrorMessage(result.message);
            
            // Ocultar el mensaje de error después de 3 segundos
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }
        
        setSuccessMessage(result.message);
        
        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };
    
    return (
        <div className="store-selector">
            <h3>Selecciona una tienda</h3>
            
            {/* Formulario para agregar tienda */}
            <form onSubmit={handleAddStore} className="add-store-form">
                <input
                    type="text"
                    value={newStoreName}
                    onChange={(e) => setNewStoreName(e.target.value)}
                    placeholder="Nombre de la nueva tienda"
                    className="store-input"
                />
                <button type="submit" className="add-store-button">
                    Agregar tienda
                </button>
            </form>
            
            {/* Mensajes de error o éxito */}
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            
            {/* Lista de tiendas */}
            <div className="stores-container">
                {stores.length > 0 ? (
                    stores.map(store => (
                        <div 
                            key={store.id}
                            className={`store-item ${selectedStore?.id === store.id ? 'selected' : ''}`}
                        >
                            <div 
                                className="store-name"
                                onClick={() => setSelectedStore(store)}
                            >
                                {store.name}
                            </div>
                            <button 
                                className="delete-store-button"
                                onClick={() => handleDeleteStore(store.id)}
                                title="Eliminar tienda"
                            >
                                ×
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="no-stores-message">No hay tiendas disponibles. Agrega una nueva tienda.</p>
                )}
            </div>
            
            {/* Tienda seleccionada */}
            {selectedStore && (
                <p className="selected-store-info">
                    Tienda seleccionada: <strong>{selectedStore.name}</strong>
                </p>
            )}
        </div>
    );
};