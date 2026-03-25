import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { ShoppingCart, Trash2, CreditCard, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, cartTotal, confirmPurchase } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      confirmPurchase();
      alert("Payment Successful! Your tickets are recorded in our system.");
      setIsProcessing(false);
      navigate('/tickets');
    }, 1500);
  };

  const currentDate = new Date().toLocaleDateString('en-GB');

  return (
    <PageWrapper title="SHOPPING CART">
      <div className="bg-white min-h-screen p-4 pb-24 flex flex-col items-center">
        {/* Header Bar */}
        <div className="w-full max-w-sm bg-[#ff0033] text-white py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg mb-8">
           <ShoppingCart size={24} fill="white" />
           <span className="text-xl font-black uppercase tracking-tight font-serif">Your Cart</span>
        </div>

        {/* Cart Table */}
        <div className="w-full max-w-sm mb-8 overflow-hidden">
          <table className="w-full border-collapse border border-red-600 text-left text-sm font-serif">
            <tbody>
              {/* Row 1: Name and Date */}
              <tr className="border border-red-600">
                <td colSpan={3} className="p-2 border-r border-red-600 font-bold">Name: {user?.name || 'Guest'}</td>
                <td colSpan={2} className="p-2 text-right font-bold italic">Date: {currentDate}</td>
              </tr>
              
              {/* Row 2: Headers */}
              <tr className="border border-red-600 bg-gray-50/50">
                <td className="p-2 border-r border-red-600 font-bold">Lot Details</td>
                <td className="p-2 border-r border-red-600 font-bold text-center">Number</td>
                <td className="p-2 border-r border-red-600 font-bold text-center">Unit</td>
                <td className="p-2 border-r border-red-600 font-bold text-center">₹</td>
                <td className="p-2 font-bold text-right">Amount ₹</td>
              </tr>

              {/* Data Rows */}
              {cart.map((item) => (
                <tr key={item.id} className="border border-red-600">
                  <td className="p-2 border-r border-red-600">
                    <div className="flex flex-col">
                      <span className="font-bold text-[10px] leading-tight uppercase">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-2 border-r border-red-600 text-center font-black">{item.num}</td>
                  <td className="p-2 border-r border-red-600 text-center">{item.qty}</td>
                  <td className="p-2 border-r border-red-600 text-center">{item.price}</td>
                  <td className="p-2 text-right font-black">{(item.price * item.qty).toFixed(2)}</td>
                </tr>
              ))}

              {cart.length === 0 && (
                <tr className="border border-red-600">
                  <td colSpan={5} className="p-10 text-center text-gray-300 italic">No tickets in cart</td>
                </tr>
              )}

              {/* Total Amount Row */}
              <tr className="border border-red-600 bg-gray-50 font-black">
                <td colSpan={4} className="p-2 border-r border-red-600 text-center uppercase tracking-widest">Total Amount:</td>
                <td className="p-2 text-right text-lg">{cartTotal.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          {/* Disclaimer text matching the image image exactly including typo */}
          <div className="border-x border-b border-red-600 p-2 bg-white">
             <p className="text-[10px] font-bold text-gray-800 leading-tight">
               ** Some items are remove automatically if draw time expired.
             </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-sm flex gap-3">
          <button 
            onClick={handlePay}
            disabled={isProcessing || cart.length === 0}
            className="flex-1 bg-[#ff0033] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            <ShoppingCart size={20} fill="white" /> {isProcessing ? 'Waiting...' : 'Confirm Pay'}
          </button>
          
          <button 
            onClick={clearCart}
            className="flex-1 bg-[#ff0033] text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-black text-sm shadow-xl active:scale-95 transition-all"
          >
            <ShoppingCart size={20} fill="white" /> Clear Cart
          </button>
        </div>

        <button 
          onClick={() => navigate('/home')} 
          className="mt-12 flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-colors"
        >
          <ChevronLeft size={14} /> Add more tickets
        </button>
      </div>
    </PageWrapper>
  );
};

export default CartPage;
