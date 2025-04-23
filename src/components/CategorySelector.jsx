import React, { useContext, useState } from 'react';
import { ContextMarket } from '../Context/Context';

export const CategorySelector = () => {
    const { 
        categories, 
        selectedCategory, 
        setSelectedCategory, 
        addCategory, 
        deleteCategory,
        showCategoryModal,
        setShowCategoryModal
    } = useContext(ContextMarket);
    
    const [newCategoryName, setNewCategoryName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleAddCategory = (e) => {
        e.preventDefault();
        
        if (!newCategoryName.trim()) {
            setErrorMessage('Por favor, introduce un nombre para la categoría.');
            return;
        }
        
        const categoryExists = categories.some(
            category => category.name.toLowerCase() === newCategoryName.trim().toLowerCase()
        );
        
        if (categoryExists) {
            setErrorMessage('Ya existe una categoría con este nombre.');
            return;
        }
        
        const result = addCategory(newCategoryName.trim());
        
        setNewCategoryName('');
        setErrorMessage('');
        setSuccessMessage(result.message);
        setShowCategoryModal(false);
        
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };
    
    const handleDeleteCategory = () => {
        if (!selectedCategory) {
            setErrorMessage('Por favor, selecciona una categoría para eliminar.');
            
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }
        
        const result = deleteCategory(selectedCategory.id);
        
        if (!result.success) {
            setErrorMessage(result.message);
            
            setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return;
        }
        
        setSuccessMessage(result.message);
        
        setTimeout(() => {
            setSuccessMessage('');
        }, 3000);
    };
    
    const handleCategoryChange = (e) => {
        const categoryId = parseInt(e.target.value);
        const category = categories.find(cat => cat.id === categoryId);
        setSelectedCategory(category || null);
    };
    
    return (
        <div className="category-selector">
            <h3>Selecciona una categoría</h3>
            
            <div className="category-controls">
                <div className="category-select-container">
                    <select 
                        className="category-select"
                        value={selectedCategory?.id || ''}
                        onChange={handleCategoryChange}
                    >
                        <option value="">-- Seleccionar categoría --</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    
                    <button 
                        className="delete-category-button"
                        onClick={handleDeleteCategory}
                        disabled={!selectedCategory}
                        title="Eliminar categoría seleccionada"
                    >
                        Eliminar
                    </button>
                </div>
                
                <button 
                    className="add-category-modal-button"
                    onClick={() => setShowCategoryModal(true)}
                >
                    Agregar categoría
                </button>
            </div>
            
            {showCategoryModal && (
                <div className="modal-background">
                    <div className="modal-content">
                        <h4>Agregar nueva categoría</h4>
                        <form onSubmit={handleAddCategory} className="add-category-form">
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                placeholder="Nombre de la nueva categoría"
                                className="category-input"
                                autoFocus
                            />
                            <div className="modal-buttons">
                                <button type="button" onClick={() => setShowCategoryModal(false)}>
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
            
            {errorMessage && (
                <div className="error-message">{errorMessage}</div>
            )}
            {successMessage && (
                <div className="success-message">{successMessage}</div>
            )}
            
            {selectedCategory && (
                <p className="selected-category-info">
                    Categoría seleccionada: <strong>{selectedCategory.name}</strong>
                </p>
            )}
        </div>
    );
};