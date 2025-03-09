import { createContext, useState } from "react";

export const ContextMarket = createContext();

export const ProviderMarket = ({children}) => {
    // Estados existentes
    const [NameProduct, SetNameProduct] = useState("")
    const [PriceProduct, SetPriceProduct] = useState("")
    const [DateProduct, SetDateProduct] = useState("")
    const [products, SetProducts] = useState([])
    const [total, setTotal] = useState(0)
    
    // Estados para tiendas
    const [stores, setStores] = useState([
        { id: 1, name: "ARA" },
        { id: 2, name: "Exito" },
        { id: 3, name: "D1" }// estos datos se muestran un la seleccion de tendas cuanto se re-cargue la aplicacion
    ])
    const [selectedStore, setSelectedStore] = useState(null)
    
    // Función para agregar una nueva tienda
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
    
    return(
        <ContextMarket.Provider value={{
            // Valores existentes
            NameProduct,
            SetNameProduct,
            PriceProduct,
            SetPriceProduct,
            DateProduct,
            SetDateProduct,
            products,
            SetProducts,
            total,
            setTotal,
            // Valores y funciones para tiendas
            stores,
            setStores,
            selectedStore,
            setSelectedStore,
            addStore,
            deleteStore
        }}>
            {children}
        </ContextMarket.Provider>
    )
}