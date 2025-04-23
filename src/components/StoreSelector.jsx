import React, { useContext, useState } from 'react';
import { ContextMarket } from '../Context/Context';
import "../Styles/StoreSelector.css"; // Asegúrate que la ruta sea correcta

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
    const [showStoreModal, setShowStoreModal] = useState(false); // Añadido para el modal de agregar

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
        const result = addStore(newStoreName.trim());

        // Limpiar el formulario y mostrar mensaje de éxito
        setNewStoreName('');
        setErrorMessage('');
        setSuccessMessage(result.message); // Asumiendo que addStore devuelve un objeto con message
        setShowStoreModal(false); // Cerrar modal al agregar

        // Ocultar el mensaje de éxito después de 3 segundos
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };

    // Manejar eliminar tienda
    const handleDeleteStore = () => {
         if (!selectedStore) {
            setErrorMessage('Por favor, selecciona una tienda para eliminar.');

            // Ocultar el mensaje de error después de 3 segundos
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }

        const result = deleteStore(selectedStore.id); // Usar el id de la tienda seleccionada

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

    // Manejar cambio de tienda seleccionada
    const handleStoreChange = (e) => {
        const storeId = parseInt(e.target.value);
        const store = stores.find(sto => sto.id === storeId);
        setSelectedStore(store || null);
    };

    return (
        <div className="store-selector">
            <h3>Selecciona una tienda</h3>

            <div className="store-controls"> {/* Contenedor similar al de categorías */}
                {/* Select para elegir tienda */}
                <div className="store-select-container">
                    <select
                        className="store-select"
                        value={selectedStore?.id || ''}
                        onChange={handleStoreChange}
                    >
                        <option value="">-- Seleccionar tienda --</option>
                        {stores.map(store => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>

                    {/* Botón para eliminar tienda seleccionada */}
                    <button
                        className="delete-store-button"
                        onClick={handleDeleteStore}
                        disabled={!selectedStore} // Deshabilitar si no hay tienda seleccionada
                        title="Eliminar tienda seleccionada"
                    >
                        Eliminar
                    </button>
                </div>

                 {/* Botón para mostrar modal de agregar */}
                <button
                    className="add-store-modal-button"
                    onClick={() => setShowStoreModal(true)}
                >
                    Agregar tienda
                </button>
            </div>

             {/* Modal para agregar tienda */}
            {showStoreModal && (
                <div className="modal-background">
                    <div className="modal-content">
                        <h4>Agregar nueva tienda</h4>
                        <form onSubmit={handleAddStore} className="add-store-form">
                            <input
                                type="text"
                                value={newStoreName}
                                onChange={(e) => setNewStoreName(e.target.value)}
                                placeholder="Nombre de la nueva tienda"
                                className="store-input"
                                autoFocus
                            />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowStoreModal(false)}>
                                    Cancelar
                                </button>
                                <button type="submit">
                                    Agregar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            {/* Mensajes de error o éxito */}
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}

            {/* Tienda seleccionada */}
            {selectedStore && (
                <p className="selected-store-info">
                    Tienda seleccionada: <strong>{selectedStore.name}</strong>
                </p>
            )}
        </div>
    );
};
