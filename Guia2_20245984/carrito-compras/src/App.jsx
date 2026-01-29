import { useState, useEffect } from "react"
import { Footer } from "./components/Footer"
import { Guitar } from "./components/Guitar"
import { Header } from "./components/Header"
import { db } from "./data/db"


export const App = () => {

  function initialCart(){
    const localStorageCart=localStorage.getItem('cart')
    return localStorageCart? JSON.parse(localStorageCart):[]
  }


  const [data, setData] = useState(db)
  const [cart, setCart] = useState(initialCart  )
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])


  function addToCart(guitar) {
    const itemIndex = cart.findIndex((item) => guitar.id === item.id)
    console.log(itemIndex);
    if (itemIndex === -1) {//Este artículo aun no esta en el carrito
      guitar.quantity = 1;
      setCart([...cart, guitar])
    }
    else {//Si la guitarra ya se habia añadido al carrito
      const updatedCart = [...cart]//Creando copia de la variable de estado
      updatedCart[itemIndex].quantity++;
      setCart(updatedCart);
    } 
  }

  function calculateTotal() {
    let total = 0;
    for (const guitar of cart) {
      total += guitar.price * guitar.quantity;
    }
    return total;
  }

  function clearCart(){
    setCart([])
    
  }

  function removeProduct(id){
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
  }

  function increaseProduct(id){
    const updatedCart = cart.map(item =>{ 
      if (item.id===id){
        return{
          ...item, quantity: item.quantity + 1
        }
      }
      return item
    })
    setCart(updatedCart)
  }

    function decreaseProduct(id){
    const updatedCart = cart.map(item =>{ 
      if (item.id===id){
        const newProduct = item.quantity -1 
        if(newProduct === 0){
          return null
        }
        return{
          ...item, quantity: newProduct
        }
      }
      return item  
    }).filter(item=> item!== null)
    setCart(updatedCart)
  }



  return (
    <>
      <Header cart={cart} total={calculateTotal()} clearCart={clearCart} removeProduct={removeProduct} increaseProduct={increaseProduct} decreaseProduct={decreaseProduct}/>
      <main class="container-xl mt-5">
        <h2 class="text-center">Nuestra Colección</h2>

        <div class="row mt-5">
          {data.map((guitar) => (
            <Guitar guitar={guitar} key={guitar.id} addToCart={addToCart} />

          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
