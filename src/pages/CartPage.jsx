import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { Trash2, CreditCard, ChevronLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (cart.length === 0) return;
    setIsProcessing(true);
    setTimeout(() => {
      alert("Payment Successful! Your tickets are booked.");
      clearCart();
      setIsProcessing(false);
      navigate('/home');
    }, 2000);
  };

  return (
    <PageWrapper title="DIAMOND CART">
      <div className="bg-[#f9f9f9] min-h-screen p-4 pb-24">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 font-black text-xs uppercase tracking-widest mb-6">
           <ChevronLeft size={16} /> Continue Shopping
        </button>

        <h2 className="text-3xl font-black text-gray-900 font-condensed uppercase tracking-tighter mb-8 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between">
           Your List
           <span className="text-[#f42464] text-sm tracking-widest font-bold bg-red-50 px-4 py-1 rounded-full">{cart.length} ITEMS</span>
        </h2>

        <div className="space-y-4">
          <AnimatePresence>
            {cart.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center justify-between group"
              >
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg group-hover:rotate-6 transition-transform">
                      {item.num}
                   </div>
                   <div>
                      <h4 className="font-black text-gray-800 text-base tracking-tight">{item.title}</h4>
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                         <span>Board: {item.board}</span>
                         <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                         <span>Qty: {item.qty}</span>
                      </div>
                   </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <span className="font-black text-lg text-emerald-600">₹{item.price * item.qty}</span>
                   <button onClick={() => removeFromCart(item.id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                      <Trash2 size={18} />
                   </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {cart.length === 0 && (
            <div className="text-center py-20">
               <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 mx-auto mb-6">
                  <CreditCard size={48} />
               </div>
               <p className="text-gray-400 font-black text-sm uppercase tracking-[0.2em]">Your cart is empty</p>
               <button onClick={() => navigate('/home')} className="mt-6 text-[#f42464] font-black text-xs uppercase tracking-widest border-b-2 border-[#f42464]">Add some tickets</button>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-10 bg-gray-900 rounded-[2.5rem] p-10 text-white shadow-2xl space-y-8">
             <div className="flex justify-between items-center text-gray-400 font-black text-xs uppercase tracking-[0.2em]">
                <span>Order Summary</span>
                <span>Subtotal</span>
             </div>
             <div className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                  <p className="text-5xl font-black font-condensed tracking-tighter">₹{cartTotal.toLocaleString()}</p>
                  <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mt-2">Including all GST and platform fees</p>
                </div>
                <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-[10px] font-black uppercase tracking-widest">
                   Clear Cart
                </button>
             </div>
             
             <button 
               onClick={handlePay}
               disabled={isProcessing}
               className="w-full bg-[#f42464] py-5 rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_15px_30px_rgba(244,36,100,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
             >
                {isProcessing ? 'Processing...' : (
                  <>Complete Payment <CreditCard size={24} /></>
                )}
             </button>
          </div>
        )}
      </div>
    </PageWrapper>
  );
};

export default CartPage;
