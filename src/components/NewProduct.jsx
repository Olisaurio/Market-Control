// src/components/NewProduct.jsx
import React, { useContext, useEffect } from 'react';
import { ContextMarket } from '../Context/Context';
import { useAuth } from '../Context/AuthContext'; // Importar useAuth
import md5 from 'md5';
// Importa los estilos CSS para este componente
import '../Styles/NewProduct.css';
import { StoreSelector } from './StoreSelector';
import { CategorySelector } from './CategorySelector';

export const NewProduct = () => {
    const {
        NameProduct,
        SetNameProduct,
        BrandProduct,
        SetBrandProduct,
        PriceProduct,
        SetPriceProduct,
        UnitProduct,
        SetUnitProduct,
        products,
        SetProducts,
        selectedStore,
        setSelectedStore, // <-- Añadir setSelectedStore
        selectedCategory,
        setSelectedCategory, // <-- Añadir setSelectedCategory
        editingProduct,
        setEditingProduct
    } = useContext(ContextMarket);

    const { currentUser } = useAuth(); // Obtener el usuario actual

    // Cargar datos cuando se está editando un producto
    useEffect(() => {
        if (editingProduct) {
            SetNameProduct(editingProduct.name);
            SetBrandProduct(editingProduct.brand || "");
            SetPriceProduct(editingProduct.price.toString());
            SetUnitProduct(editingProduct.unit || "");
            // Al editar, también podrías querer seleccionar la tienda y categoría del producto
            // Esto requeriría buscar la tienda/categoría por ID en tus listas 'stores'/'categories'
            // y llamar a setSelectedStore/setSelectedCategory. Por ahora, solo limpiamos si no hay edición.
        } else {
             clearForm();
        }
    }, [editingProduct]); // Dependencia en editingProduct

    const clearForm = () => {
        SetNameProduct("");
        SetBrandProduct("");
        SetPriceProduct("");
        SetUnitProduct("");
        setSelectedStore(null); // <-- Limpiar tienda seleccionada en el contexto
        setSelectedCategory(null); // <-- Limpiar categoría seleccionada en el contexto
    };

    const handleProduct = (e) => {
        e.preventDefault();

        // Validaciones
        if (!currentUser) { // Asegurarse de que haya un usuario logueado
             alert("Debes iniciar sesión para agregar o actualizar productos.");
             return;
        }
        if (!selectedStore) {
            alert("Por favor, selecciona una tienda desde la sección 'Gestionar Tiendas' antes de agregar un producto.");
            return;
        }
        if (!selectedCategory) {
            alert("Por favor, selecciona una categoría desde la sección 'Gestionar Categorías' antes de agregar un producto.");
            return;
        }
        if (!NameProduct || !PriceProduct || !UnitProduct) {
             alert("Por favor, completa todos los campos requeridos (Nombre, Precio, Unidad).");
             return;
        }

        const currentDate = new Date();
        // Asegúrate de que formattedDate se genere correctamente si lo usas
        const formattedDate = currentDate.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }); // Ejemplo de formato
        const currentTimestamp = currentDate.getTime();

        if (editingProduct) {
            // Actualizar producto existente
            const updatedProducts = products.map(product =>
                product.id === editingProduct.id
                    ? {
                        ...product,
                        name: NameProduct,
                        brand: BrandProduct,
                        price: Number(PriceProduct),
                        unit: UnitProduct,
                        date: formattedDate,
                        timestamp: currentTimestamp,
                        storeId: selectedStore.id,
                        storeName: selectedStore.name,
                        categoryId: selectedCategory.id,
                        categoryName: selectedCategory.name,
                        // userId se mantiene como estaba en el producto original
                      }
                    : product
                );
                SetProducts(updatedProducts);
                setEditingProduct(null);
            } else {
                // Crear nuevo producto
                // Incluir userId en el ID para mayor unicidad si es necesario
                const idString = `${NameProduct}-${PriceProduct}-${currentTimestamp}-${currentUser.uid}`;
                const id = md5(idString);

                const newProduct = {
                    id: id,
                    name: NameProduct,
                    brand: BrandProduct,
                    price: Number(PriceProduct),
                    unit: UnitProduct,
                    date: formattedDate,
                    timestamp: currentTimestamp,
                    storeId: selectedStore.id,
                    storeName: selectedStore.name,
                    categoryId: selectedCategory.id,
                    categoryName: selectedCategory.name,
                    isActive: true,
                    userId: currentUser.uid // <--- Añadir el ID del usuario logueado
                };
                SetProducts([...products, newProduct]);
            }
            clearForm(); // <-- Llamar a clearForm después de agregar/actualizar
        };

    const cancelEdit = () => {
        setEditingProduct(null);
        clearForm();
    };

    return (
        <form className="new-product-container" onSubmit={handleProduct}>
            <h2>{editingProduct ? 'Actualizar Producto' : 'Agregar Nuevo Producto'}</h2>

            {/* Mostrar selectores de tienda y categoría */}
            {/* Estos componentes usan selectedStore y selectedCategory del contexto */}
            <StoreSelector />
            <CategorySelector />

            <div className="input-row">
                <label htmlFor="productName">Nombre:</label>
                <input
                    id="productName"
                    type="text"
                    placeholder="Ej: Leche Entera"
                    onChange={(event) => SetNameProduct(event.target.value)}
                    value={NameProduct}
                    required
                />
            </div>

            <div className="input-row">
                <label htmlFor="productBrand">Marca:</label>
                <input
                    id="productBrand"
                    type="text"
                    placeholder="Ej: Colanta (Opcional)"
                    onChange={(event) => SetBrandProduct(event.target.value)}
                    value={BrandProduct}
                />
            </div>

            <div className="input-row">
                <label htmlFor="productPrice">Precio:</label>
                <input
                    id="productPrice"
                    type="number"
                    placeholder="Ej: 3500.50"
                    onChange={(event) => SetPriceProduct(event.target.value)}
                    value={PriceProduct}
                    min="0"
                    step="0.01"
                    required
                />
            </div>

            <div className="input-row">
                <label htmlFor="productUnit">Unidad:</label>
                <input
                    id="productUnit"
                    type="text"
                    placeholder="Ej: Litro, Kg, Unidad, Paquete 500g"
                    onChange={(event) => SetUnitProduct(event.target.value)}
                    value={UnitProduct}
                    required
                />
            </div>

            <div className="button-container">
                {editingProduct && (
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="cancel-button"
                        style={{ marginRight: '10px', backgroundColor: '#6c757d' }}
                    >
                        Cancelar
                    </button>
                )}
                <button type="submit" className="add-button">
                    {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
                </button>
            </div>
        </form>
    );
};
