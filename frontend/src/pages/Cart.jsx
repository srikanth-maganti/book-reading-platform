import React, { useState, useEffect,useContext } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { AuthContext } from '../utils/AuthContext.jsx';
import CartItem from "../components/CartItem.jsx";
import axios from 'axios';

import "../assets/Cart.css"
function Cart() {
    const navigate=useNavigate();
    const [items,setItems]=useState([]);
  
    // const { isauthenticated } = useContext(AuthContext);
    const token=localStorage.getItem("token");
    
    // useEffect(() => {
    //     if (!isauthenticated) {
    //         navigate("/login");
    //     }
    // }, [isauthenticated]);

    useEffect(()=>{
        const fetchdata=async()=>{
            const response=await fetch("http://localhost:3000/cart",{
                method:'GET',
                 headers: {
               
                Authorization: `Bearer ${token}`
            }
            });
            if(!response.ok)
            {
              console.log("unable to get cart");
            }
            
            const result=await response.json();
            console.log(result.items)
            setItems(result.items);
        }
        fetchdata();
    },[])


const handleincrement = async (itemId,bookId) => {
    try {
      const updated = items.map((item) => {
        if (item._id === itemId) {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });
      setItems(updated);

      await axios.patch(`http://localhost:3000/cart/${bookId}`, {
        action: "increment",
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Error incrementing count", err);
    }
  };

  const handledecrement = async (itemId,bookId) => {
    try {
      const updated = books.map((item) => {
        if (item._id === itemId && item.count > 1) {
          return { ...item,count: item.count - 1 };
        }
        return item;
      });
      setItems(updated);

      await axios.patch(`http://localhost:3000/cart/${bookId}`, {
        action: "decrement",
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err) {
      console.error("Error decrementing count", err);
    }
  };

    const handledelete= async (itemId,bookId) => {
  try {
    // Optimistically update UI
    setItems(items.filter(item => item._id !== itemId));

    // Send DELETE request to backend
    await axios.delete(`http://localhost:3000/cart/${bookId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  } catch (err) {
    console.error("Error removing item:", err);
  }
};
if(items.length==0)
{  
        return (
            <div className="empty-cart">
                <i className="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added any books to your cart yet.</p>
                <span>
                  <img src="/images/OIP.jpeg" alt="empty cart" className="empty-cart-image" />
                </span>
                

                <Link to="/books" className="btn btn-primary mt-3">
                    Start Shopping
                </Link>
            </div>
        )

}
if(items.length>0)
    {    let total=items.reduce((a,b)=>a+b.book.Price*b.count,0);
         return ( 
       
        <div className="cart-content w-100">
        
            <h1 className="cart-title">
                
                <i className="fas fa-shopping-cart"></i>
                Shopping Cart Items  
            </h1>
            
            <div className="row">
                <div className="col-lg-8">
                    
                    {
                        items.map((data)=><CartItem key={data._id} onDecrement={handledecrement} onIncrement={handleincrement}  onRemove={handledelete} item={data}/>)
                    }
                    
                    <Link href="/books" className="continue-shopping mb-4">
                        <i class="fa-solid fa-arrow-left"></i> Continue Shopping
                    </Link>
                </div>

                {/* Cart Summary  */}
                
                <div class="col-lg-4">
                    <div class="cart-summary">
                        <h2 class="summary-title">Order Summary</h2>
                        <div class="summary-item">
                            <span>Subtotal items</span>
                            <span>{total}</span>
                        </div>
                        <div class="summary-item">
                            <span>Shipping</span>
                            <span>₹24</span>
                        </div>
                        <div class="summary-item">
                            <span>Tax</span>
                            <span>₹12</span>
                        </div>
                        <div class="summary-total">
                            <span>Total</span>
                            <span>₹ {total+24+12}</span>
                        </div>
                        <form action="/cart/payment">
                        <button class="checkout-btn">
                            Proceed to Checkout
                        </button>
                       </form>
                    </div>
               </div>
        </div>
        </div>
        )
    }
}

export default Cart;