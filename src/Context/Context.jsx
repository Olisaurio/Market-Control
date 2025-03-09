import { createContext } from "react";
import { useState } from "react";

export const ContextMarket = createContext();

export const ProviderMarket = ({children}) => {
    //nombre de los productos
    const [NameProduct, SetNameProduct] = useState("")
    //precio de los productos
    const [PriceProduct, SetPriceProduct] = useState("")
    //fecha de los productos
    const [DateProduct, SetDateProduct] = useState("")
    //array de productos
    const [products, SetProducts] = useState([])
    // total de los productos
    const [total, setTotal] = useState(0)

    return(
        //crea un componente con mi contexto .provider
        //en value lo que quiero compartir en un objeto
        <ContextMarket.Provider value={{
            NameProduct,
            SetNameProduct,
            PriceProduct,
            SetPriceProduct,
            DateProduct,
            SetDateProduct,
            products,
            SetProducts,
            total,
            setTotal
        }}>
            {children} // importante por que e slo que está dentro del provider y comparto el contexto
        </ContextMarket.Provider>

    )
    
}