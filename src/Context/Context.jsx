import { createContext, useState } from "react";

export const ContextMarket = createContext();

export const ProviderMarket = ({children}) => {
    // Estados existentes
    const [NameProduct, SetNameProduct] = useState("")
    const [BrandProduct, SetBrandProduct] = useState("")
    const [PriceProduct, SetPriceProduct] = useState("")
    const [UnitProduct, SetUnitProduct] = useState("")
    const [DateProduct, SetDateProduct] = useState("")
    const [products, SetProducts] = useState([])
    const [total, setTotal] = useState(0)
    const [editingProduct, setEditingProduct] = useState(null)
    
    const [stores, setStores] = useState([
        { id: 1, name: "ARA" },
        { id: 2, name: "Exito" },
        { id: 3, name: "D1" }
    ])
    const [selectedStore, setSelectedStore] = useState(null)
    
    const [categories, setCategories] = useState([
        { id: 1, name: "Frutas y Verduras" },
        { id: 2, name: "Lácteos" },
        { id: 3, name: "Carnes" },
        { id: 4, name: "Limpieza" }
    ])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    
    const addStore = (storeName) => {
        // Generar un ID único
        const maxId = stores.length > 0 ? Math.max(...stores.map(store => store.id)) : 0;
        const newStore = {
            id: maxId + 1,
            name: storeName
        };
        setStores([...stores, newStore]);
    };
    
    // Función para eliminar una tienda
    const deleteStore = (storeId) => {
        // Verificar si hay productos asociados a esta tienda
        const hasProducts = products.some(product => product.storeId === storeId);
        
        if (hasProducts) {
            return { success: false, message: "No se puede eliminar la tienda porque tiene productos asociados." };
        }
        
        // Si no hay productos, eliminar la tienda
        const updatedStores = stores.filter(store => store.id !== storeId);
        setStores(updatedStores);
        
        // Si la tienda eliminada era la seleccionada, deseleccionarla
        if (selectedStore && selectedStore.id === storeId) {
            setSelectedStore(null);
        }
        
        return { success: true, message: "Tienda eliminada correctamente." };
    };
    
    const addCategory = (categoryName) => {
        // Generar un ID único
        const maxId = categories.length > 0 ? Math.max(...categories.map(category => category.id)) : 0;
        const newCategory = {
            id: maxId + 1,
            name: categoryName
        };
        setCategories([...categories, newCategory]);
        return { success: true, message: "Categoría agregada correctamente." };
    };
    
    // Función para eliminar una categoría
    const deleteCategory = (categoryId) => {
        // Verificar si hay productos asociados a esta categoría
        const hasProducts = products.some(product => product.categoryId === categoryId);
        
        if (hasProducts) {
            return { success: false, message: "No se puede eliminar la categoría porque tiene productos asociados." };
        }
        
        // Si no hay productos, eliminar la categoría
        const updatedCategories = categories.filter(category => category.id !== categoryId);
        setCategories(updatedCategories);
        
        // Si la categoría eliminada era la seleccionada, deseleccionarla
        if (selectedCategory && selectedCategory.id === categoryId) {
            setSelectedCategory(null);
        }
        
        return { success: true, message: "Categoría eliminada correctamente." };
    };
    
    return(
        <ContextMarket.Provider value={{
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
            total,
            setTotal,
            editingProduct,
            setEditingProduct,
            // Valores y funciones para tiendas
            stores,
            setStores,
            selectedStore,
            setSelectedStore,
            addStore,
            deleteStore,
            // Valores y funciones para categorías
            categories,
            setCategories,
            selectedCategory,
            setSelectedCategory,
            addCategory,
            deleteCategory,
            showCategoryModal,
            setShowCategoryModal
        }}>
            {children}
        </ContextMarket.Provider>
    )
}