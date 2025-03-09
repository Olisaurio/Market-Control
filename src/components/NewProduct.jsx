import React from 'react';
import { useContext } from 'react';
import { ContextMarket } from '../Context/Context';
import md5 from 'md5'; // importante instalar la dependencia md5 para la creacion el id: npm install md5
import { CategorySelector } from './CategorySelector ';

export const NewProduct = () => {
    const {
        NameProduct,
        SetNameProduct,
        PriceProduct,
        SetPriceProduct,
        DateProduct,
        SetDateProduct,
        products,
        SetProducts,
        selectedStore,
        selectedCategory
    } = useContext(ContextMarket);
   
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
       
        // Generar ID único con md5
        const timestamp = Date.now();
        const idString = `${NameProduct}-${PriceProduct}-${timestamp}`;
        const id = md5(idString);
       
        // Obtener la fecha actual completa en formato legible
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
       
        const newProduct = {
            id: id,
            name: NameProduct,
            price: Number(PriceProduct),
            date: formattedDate,
            timestamp: currentDate.getTime(),
            storeId: selectedStore.id, // asociamos la tienda al producto
            storeName: selectedStore.name, // guardamos el nombre de la tienda para facilitar la visualización
            categoryId: selectedCategory.id, // asociamos la categoría al producto
            categoryName: selectedCategory.name // guardamos el nombre de la categoría
        };
       
        SetProducts([...products, newProduct]);
       
        // Limpiar el formulario
        SetNameProduct("");
        SetPriceProduct("");
        SetDateProduct("");
        e.target.reset();
    };
   
    return (
        <>
            <form className="container" onSubmit={handleProduct}>
                <h2>Agregar producto</h2>


<CategorySelector/>
                
                <input
                    type="text"
                    placeholder="Nombre del producto"
                    onChange={(event) => SetNameProduct(event.target.value)}
                    value={NameProduct}
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
                <button>Agregar al carrito</button>
            </form>
        </>
    );
};