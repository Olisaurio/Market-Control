import { useEffect, useState } from 'react'
import { ListProducts } from './components/ListProducts'
import { NewProduct } from './components/NewProduct'
import './App.css'
import "./Styles/ListProducts.css"
import "./Styles/NewProduct.css"
export const App = () =>{
  return (
    <div className='hero'>
    <NewProduct/>
    <ListProducts/>

    </div>
  )
  /*const [NameProduct, SetNameProduct] = useState("")
  const [PriceProduct, SetPriceProduct] = useState(0)
  const [DateProduct, SetDateProduct] = useState("")
  const [products, SetProducts] = useState([])
  const [total, setTotal] = useState(0)


  const handleProduct = (e) => {
    e.preventDefault()
    const newProduct = {
      name:NameProduct,
      price:PriceProduct,
      date:DateProduct
    }

    SetProducts([...products,newProduct])
    SetNameProduct("")
    SetPriceProduct(0)
    SetDateProduct("")


    products.map((product) => {
      setTotal( PriceProduct + product.price)})

  }


  
  return (

    
    <hero>

    <form className="container"  onSubmit={handleProduct}>

      <h2>Agregar producto</h2>

      <input type="text" placeholder='Producto'  
      
      onChange={(event) => SetNameProduct(event.target.value)}
      value={NameProduct}
      />

      <input type="num" placeholder='Precio'
      
      onChange={(event) => SetPriceProduct(Number(event.target.value))}
      value={PriceProduct}/>

      <input type="date"
      
      onChange={(event) => SetDateProduct(event.target.value)}
      value={DateProduct}/>

      <button>Agregar al carrito</button>
    </form>

    <div className="aside">
    <h2>lista de productos</h2>

    <ul>
    
{products.map((product, index)=>(
  <li key={product + index}>
    <p>{product.name}<br/>${product.price}</p>
  </li>
)

)}

    </ul>
    <h2>Total</h2>
    <h3>${total}</h3>
    </div>

    </hero>
  )*/
}

export default App
