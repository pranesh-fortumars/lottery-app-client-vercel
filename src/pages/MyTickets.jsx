import React from 'react';
import PageWrapper from '../components/PageWrapper';
import { Ticket, Clock, Calendar, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const MyTickets = () => {
  const { purchasedTickets } = useCart();
  const navigate = useNavigate();

  return (
    <PageWrapper title="MY TICKETS">
      <div className="bg-white min-h-screen p-4 pb-24">
        {purchasedTickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-200 border border-gray-100 shadow-inner">
              <ShoppingBag size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-300 uppercase tracking-tighter italic">No Active Tickets</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-10">You haven't purchased any tickets yet in the current session.</p>
            </div>
            <button 
              onClick={() => navigate('/home')}
              className="bg-[#ff0033] text-white px-8 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-[#ff0033]/20 active:scale-95 transition-all flex items-center gap-2"
            >
              Start Buying <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {purchasedTickets.map((t, idx) => (
              <div key={idx} className="border-[1.5px] border-[#ff0033] rounded-2xl p-4 bg-white shadow-lg relative overflow-hidden group">
                 <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-3">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 bg-[#ff0033] rounded-xl flex items-center justify-center text-white shadow-md">
                          <Ticket size={24} />
                       </div>
                       <div>
                          <h3 className="text-gray-900 font-black text-[10px] uppercase tracking-tight line-clamp-1 w-40">{t.title}</h3>
                          <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest italic">{t.purchaseId}</p>
                       </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                      t.status === 'Won' ? 'bg-emerald-50 text-emerald-500' :
                      t.status === 'Active' ? 'bg-blue-50 text-blue-500' :
                      'bg-gray-50 text-gray-400'
                    }`}>
                      {t.status}
                    </div>
                 </div>

                 <div className="flex justify-between items-end">
                    <div className="flex gap-2">
                       {String(t.num).split('').map((n, i) => (
                          <div key={i} className="w-9 h-9 border-[1.5px] border-gray-950 rounded-lg flex items-center justify-center font-black text-lg bg-gray-50 group-hover:bg-[#ff0033] group-hover:text-white transition-colors duration-300 shadow-sm">
                             {n}
                          </div>
                       ))}
                    </div>
                    <div className="text-right">
                       <div className="flex items-center gap-1.5 justify-end mb-1 opacity-50">
                          <Calendar size={10} className="text-[#ff0033]" />
                          <span className="text-[8px] font-black text-gray-500">{t.purchaseTime.split(',')[0]}</span>
                       </div>
                       <div className="flex items-center gap-1.5 justify-end opacity-50">
                          <Clock size={10} className="text-[#ff0033]" />
                          <span className="text-[8px] font-black text-gray-500">{t.purchaseTime.split(',')[1]}</span>
                       </div>
                       <p className="text-[#ff0033] font-black text-[9px] mt-2 italic shadow-inner bg-red-50 px-2 py-0.5 rounded leading-none uppercase">Qty: {t.qty}</p>
                    </div>
                 </div>

                 {t.status === 'Won' && t.prize && (
                   <div className="absolute top-0 right-0 p-2 bg-emerald-500 text-white rounded-bl-xl flex items-center gap-1 shadow-md">
                      <CheckCircle2 size={12} />
                      <span className="text-[10px] font-black italic">{t.prize}</span>
                   </div>
                 )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center opacity-30">
           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-serif italic">*** All Winning tickets verified by Board ***</p>
        </div>
      </div>
    </PageWrapper>
  );
};

export default MyTickets;
