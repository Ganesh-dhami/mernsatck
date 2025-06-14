import React, { useContext } from 'react'
import './CartItems.css'
import cart_cross_icon from '../../Assets/cart_cross_icon.png'
import { ShopContext } from '../../Context/ShopContext'
function CartItems() {
    const {getTotalCartAmount,all_product,cartItems,addToCart,removeFromCart}=useContext(ShopContext);

  return (
    <div className='cartitems'>
        <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
          </div>
        <hr/>
        {all_product.map((e)=>{
            if(cartItems[e.id]>0){
                return  <div className="cartitems-format">
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>{e.name}</p>
                <p>${e.new_price}</p>
                <button className="cartitems-quantity">{cartItems[e.id]}</button>
                <p>${e.new_price*cartItems[e.id]}</p>
                <img src={cart_cross_icon} onClick={()=>{removeFromCart(e.id)}} alt="" />
            </div> 
            }
            return null;
        })}
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Totals</h1>
            <div>
            <div className="cartitems-total-item">
              <h3>Sub Total</h3>
             <h3>${getTotalCartAmount()}</h3>
            </div>

              <div className="cartitems-total-item"></div>
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <div className="cartitems-total-item">
              <h3>Total</h3>
             <h3>${getTotalCartAmount()}</h3>
            </div>

          </div>
          <button>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode"></div>
        <p>Promo Code, Enter Here</p>
        <div className="cartitems-promobox">
          <input type='text' placeholder='Promocode'/>
          <button>Submit</button>
        </div>
    </div>
  )
}

export default CartItems
