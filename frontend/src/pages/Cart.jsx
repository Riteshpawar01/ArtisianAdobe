import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import useStore from '../store/useStore';
import { Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart } = useStore();
  const [orderStatus, setOrderStatus] = useState(null); // 'loading', 'success', 'error'
  
  const subtotal = cart.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 500;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    setOrderStatus('loading');
    
    // Attempt to get user from local storage
    const storedUser = JSON.parse(localStorage.getItem('user'));
    
    try {
      const response = await fetch('http://localhost:5005/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          subtotal,
          shipping,
          total,
          user: storedUser ? storedUser.id || storedUser._id : null
        })
      });
      const data = await response.json();
      
      if (data.success) {
        setOrderStatus('success');
        // In a real app, you would also clear the cart here
        // useStore.getState().clearCart();
      } else {
        setOrderStatus('error');
      }
    } catch (err) {
      console.error(err);
      setOrderStatus('error');
    }
  };

  if (orderStatus === 'success') {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center text-center">
          <CheckCircle size={64} className="text-green-500 mb-6" />
          <h1 className="text-4xl font-serif text-gray-900 mb-4">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-8 max-w-md">Thank you for your purchase. We have received your order and will begin processing it shortly.</p>
          <Link to="/" className="bg-gray-900 text-white px-8 py-4 text-sm font-semibold tracking-widest hover:bg-gray-800 transition-colors uppercase">
            Continue Shopping
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-10">Shopping Bag</h1>
        
        {cart.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <h2 className="text-xl text-gray-700 mb-2 font-medium">Your bag is empty</h2>
            <p className="text-gray-500 mb-6">Discover unique artisan pieces to add to your collection.</p>
            <Link to="/" className="bg-gray-900 text-white px-8 py-3 text-sm tracking-widest hover:bg-gray-800 transition-colors uppercase">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-6 border-b border-gray-200 pb-6">
                  <div className="w-32 h-40 bg-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-[1rem] font-serif text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-gray-900 font-medium tracking-wide">
                          Rs. {(item.salePrice * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 border border-gray-100 shadow-sm h-fit sticky top-24">
              <h3 className="text-xl font-serif text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4 text-sm text-gray-600 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} items)</span>
                  <span>Rs. {subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `Rs. ${shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-8 flex justify-between items-center text-lg font-medium text-gray-900">
                <span>Total</span>
                <span>Rs. {total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              
              {orderStatus === 'error' && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm text-center font-medium border border-red-200">
                  Checkout failed. Please try again.
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={orderStatus === 'loading'}
                className={`w-full text-white py-4 text-sm font-semibold tracking-widest transition-colors uppercase ${orderStatus === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
              >
                {orderStatus === 'loading' ? 'Processing...' : 'Proceed to Checkout'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;
