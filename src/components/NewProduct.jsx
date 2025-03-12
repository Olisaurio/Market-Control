import React, { useContext, useEffect } from 'react';
import { ContextMarket } from '../Context/Context';
import md5 from 'md5';
import { CategorySelector } from './CategorySelector ';

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
        DateProduct,
        SetDateProduct,
        products,
        SetProducts,
        selectedStore,
        selectedCategory,
        editingProduct,
        setEditingProduct
    } = useContext(ContextMarket);

    // Cargar datos cuando se está editando un producto
    useEffect(() => {
        if (editingProduct) {
            SetNameProduct(editingProduct.name);
            SetBrandProduct(editingProduct.brand || "");
            SetPriceProduct(editingProduct.price.toString());
            SetUnitProduct(editingProduct.unit || "");
        }
    }, [editingProduct]);

    const handleProduct = (e) => {
        e.preventDefault();

        if (!selectedStore) {
            alert("Por favor, selecciona una tienda antes de agregar un producto");
            return;
        }

        if (!selectedCategory) {
            alert("Por favor, selecciona una categoría antes de agregar un producto");
            return;
        }

        // Obtener la fecha actual completa en formato legible
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        if (editingProduct) {
            // Actualizar producto existente
            const updatedProducts = products.map(product => {
                if (product.id === editingProduct.id) {
                    return {
                        ...product,
                        name: NameProduct,
                        brand: BrandProduct,
                        price: Number(PriceProduct),
                        unit: UnitProduct,
                        date: formattedDate,
                        timestamp: currentDate.getTime(),
                        storeId: selectedStore.id,
                        storeName: selectedStore.name,
                        categoryId: selectedCategory.id,
                        categoryName: selectedCategory.name
                    };
                }
                return product;
            });

            SetProducts(updatedProducts);
            setEditingProduct(null); // Salir del modo edición
        } else {
            // Crear nuevo producto
            // Generar ID único con md5
            const timestamp = Date.now();
            const idString = `${NameProduct}-${PriceProduct}-${timestamp}`;
            const id = md5(idString);

            const newProduct = {
                id: id,
                name: NameProduct,
                brand: BrandProduct,
                price: Number(PriceProduct),
                unit: UnitProduct,
                date: formattedDate,
                timestamp: currentDate.getTime(),
                storeId: selectedStore.id,
                storeName: selectedStore.name,
                categoryId: selectedCategory.id,
                categoryName: selectedCategory.name
            };

            SetProducts([...products, newProduct]);
        }

        // Limpiar el formulario
        SetNameProduct("");
        SetBrandProduct("");
        SetPriceProduct("");
        SetUnitProduct("");
        SetDateProduct("");
        e.target.reset();
    };

    const cancelEdit = () => {
        setEditingProduct(null);
        SetNameProduct("");
        SetBrandProduct("");
        SetPriceProduct("");
        SetUnitProduct("");
        SetDateProduct("");
    };

    return (
        <>
            <form className="container" onSubmit={handleProduct}>
                <h2>{editingProduct ? 'Actualizar producto' : 'Agregar producto'}</h2>
                
                <CategorySelector />
                
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    onChange={(event) => SetNameProduct(event.target.value)}
                    value={NameProduct}
                    required
                />
                
                <input
                    type="text"
                    placeholder="Marca del producto"
                    onChange={(event) => SetBrandProduct(event.target.value)}
                    value={BrandProduct}
                    required
                />
                
                <input
                    type="number"
                    placeholder="Precio"
                    onChange={(event) => SetPriceProduct(event.target.value)}
                    value={PriceProduct}
                    min="0"
                    step="0.01"
                    required
                />
                
                <input
                    type="text"
                    placeholder="Unidad de medida (kg, litro, unidad)"
                    onChange={(event) => SetUnitProduct(event.target.value)}
                    value={UnitProduct}
                    required
                />
                
                <div className="form-buttons">
                    {editingProduct && (
                        <button type="button" onClick={cancelEdit} className="cancel-button">
                            Cancelar
                        </button>
                    )}
                    <button type="submit">
                        {editingProduct ? 'Actualizar producto' : 'Agregar al carrito'}
                    </button>
                </div>
            </form>
        </>
    );
};