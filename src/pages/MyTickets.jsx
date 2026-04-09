import React, { useMemo } from 'react';
import PageWrapper from '../components/PageWrapper';
import { Ticket, Clock, Calendar, CheckCircle2, ChevronRight, ShoppingBag, Receipt, Printer, FileText, Trophy, Coins, Sparkles, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const MyTickets = () => {
  const { purchasedTickets, refreshTickets, loading } = useCart();
  const navigate = useNavigate();

  // Group tickets by purchaseId (Transaction ID)
  const groupedTransactions = useMemo(() => {
    const groups = {};
    if (!purchasedTickets) return [];
    
    purchasedTickets.forEach(ticket => {
      // Use purchaseId as group key, fallback to ticket id if missing
      const id = ticket.purchaseId || `T-${ticket.id}`;
      if (!groups[id]) {
        groups[id] = {
          id: id,
          status: ticket.status || 'Active',
          date: ticket.purchaseDate || 'Today',
          time: ticket.purchaseTime || 'Just Now',
          market: ticket.title?.includes('DEAR') ? 'Dear' : 'Kerala',
          slot: ticket.title?.split('-')[1]?.split('(')[0]?.trim() || 'General',
          tickets: []
        };
      }
      groups[id].tickets.push(ticket);
    });
    return Object.values(groups);
  }, [purchasedTickets]);

  return (
    <PageWrapper title="PURCHASE HISTORY">
      <div className="bg-[#f8fbff] min-h-screen p-4 pb-24 space-y-8">
        
        <div className="flex justify-between items-center px-4">
           <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Live Ticket Archive</h2>
           <button 
            onClick={refreshTickets}
            disabled={loading}
            className="flex items-center gap-2 text-[#ff0000] font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all disabled:opacity-30"
           >
              {loading ? 'Updating...' : 'Refresh List'} <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
           </button>
        </div>

        {groupedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-20 h-20 bg-white rounded-[2.5rem] flex items-center justify-center text-gray-200 border-2 border-gray-100 shadow-xl">
              <Receipt size={40} />
            </div>
            <div>
              <h3 className="text-xl font-black text-gray-400 uppercase tracking-tighter italic">No History Found</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 px-10">Your purchase archive is currently empty.</p>
            </div>
            <button 
              onClick={() => navigate('/home')}
              className="bg-[#ff0000] text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-100 active:scale-95 transition-all"
            >
              Explore Markets
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedTransactions.map((group) => {
              const totalItems = group.tickets.length;
              const grandQty = group.tickets.reduce((sum, t) => sum + t.qty, 0);
              const totalAmount = group.tickets.reduce((sum, t) => sum + (t.qty * t.price), 0);
              
              const winningTickets = group.tickets.filter(t => t.status === 'Won');
              const isWinner = winningTickets.length > 0;
              const totalWinningPrize = winningTickets.reduce((sum, t) => {
                 const prizeMatch = t.prize.replace(/[^\d]/g, '');
                 return sum + (parseInt(prizeMatch) || 0);
              }, 0);

              const isAllClosed = group.tickets.every(t => t.status === 'Closed' || t.status === 'Won');

              return (
                <div key={group.id} className={`bg-white rounded-[2rem] shadow-2xl border-2 overflow-hidden animate-in slide-in-from-bottom-4 duration-500 transition-all ${isWinner ? 'border-amber-400' : 'border-red-50'}`}>
                  
                  {/* --- WINNER BANNER (Dynamic Reveal) --- */}
                  {isWinner && (
                    <div className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 px-6 py-4 flex items-center justify-between text-white shadow-lg overflow-hidden relative">
                       <div className="absolute top-0 right-[-20px] opacity-20"><Trophy size={80} /></div>
                       <div className="flex items-center gap-4 z-10">
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse"><Sparkles size={20} /></div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-80 italic">Congratulations!</p>
                            <h4 className="text-xl font-black font-condensed italic tracking-tighter uppercase leading-none">Jackpot Winning Ticket</h4>
                          </div>
                       </div>
                       <div className="text-right z-10">
                          <p className="text-[9px] font-black uppercase italic mb-1">Draw Prize</p>
                          <p className="text-2xl font-black font-condensed italic tracking-tighter">₹ {totalWinningPrize.toLocaleString()}</p>
                       </div>
                    </div>
                  )}

                  {/* --- Header Match to Image --- */}
                  <div className="bg-white p-5 border-b-[1.5px] border-red-100 flex justify-between items-center bg-gradient-to-r from-red-50/20 to-white">
                     <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase text-red-500 tracking-widest opacity-60 italic mb-1">Transaction ID: {group.id}</span>
                        <div className="flex items-center gap-2">
                           <h3 className="text-xl font-black font-condensed italic uppercase leading-none">{group.market} | {group.slot}</h3>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[10px] font-black text-gray-900 border-b border-gray-100 pb-1">{group.date}</div>
                        <div className="text-[9px] font-bold text-gray-400 mt-1">{group.time}</div>
                     </div>
                  </div>

                  {/* --- Table Component (Matching Hand-Drawn Image) --- */}
                  <div className="p-0">
                    <table className="w-full text-left border-collapse">
                       <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100">
                             <th className="px-5 py-3 text-[9px] font-black uppercase text-gray-400 tracking-widest">Item / No</th>
                             <th className="px-3 py-3 text-[9px] font-black uppercase text-gray-400 tracking-widest text-center">Qty</th>
                             <th className="px-3 py-3 text-[9px] font-black uppercase text-gray-400 tracking-widest text-center">Rate</th>
                             <th className="px-5 py-3 text-[9px] font-black uppercase text-gray-400 tracking-widest text-right">Amount</th>
                          </tr>
                       </thead>
                       <tbody>
                          {group.tickets.map((t, tIdx) => (
                            <tr key={tIdx} className="border-b border-gray-50 last:border-0 group hover:bg-red-50/30 transition-colors">
                               <td className="px-5 py-4">
                                  <div className="flex flex-col">
                                     <span className="text-[10px] font-black text-red-600 uppercase italic tracking-tighter">
                                        {t.type === '1D' ? `${t.pos} (1D)` : t.type === '3D' ? `3D RS ${t.price} ${t.pos}` : `${t.pos} (${t.type})`}
                                     </span>
                                     <span className="text-lg font-black font-condensed tracking-widest text-gray-900 mt-0.5">{t.num}</span>
                                  </div>
                               </td>
                               <td className="px-3 py-4 text-center font-black text-gray-700 text-sm">{t.qty}</td>
                               <td className="px-3 py-4 text-center text-[10px] whitespace-nowrap">
                                  <span className="text-gray-300 font-bold mr-1">x</span>
                                  <span className="font-black text-gray-900">₹ {t.price}</span>
                                </td>
                               <td className="px-5 py-4 text-right">
                                  <div className="flex flex-col items-end">
                                     <span className="text-sm font-black text-gray-900">₹ {(t.qty * t.price).toLocaleString()}</span>
                                     <span className={`text-[7px] font-black uppercase px-2 py-0.5 rounded-full mt-1 ${
                                        t.status === 'Won' ? 'bg-emerald-500 text-white' : 
                                        t.status === 'Active' ? 'bg-blue-500 text-white' : 
                                        'bg-gray-400 text-white'
                                     }`}>{t.status}</span>
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                       {/* --- Table Footer Match to Image --- */}
                       <tfoot>
                          <tr className="bg-gray-900 text-white border-t-4 border-red-600">
                             <td className="px-5 py-5">
                                <div className="flex flex-col">
                                   <span className="text-[7px] font-black uppercase opacity-60 tracking-widest mb-1 italic">Total Items</span>
                                   <span className="text-xl font-black font-condensed italic">{totalItems}</span>
                                </div>
                             </td>
                             <td className="px-3 py-5 text-center">
                                <div className="flex flex-col">
                                   <span className="text-[7px] font-black uppercase opacity-60 tracking-widest mb-1 italic">Grand Qty</span>
                                   <span className="text-xl font-black font-condensed italic">{grandQty}</span>
                                </div>
                             </td>
                             {(isWinner || isAllClosed) ? (
                                <td colSpan="2" className="px-5 py-5 text-right">
                                   <div className="flex justify-between items-end gap-10">
                                      <div className="flex flex-col items-end">
                                         <span className="text-[7px] font-black uppercase opacity-60 tracking-widest mb-1 italic">Total Paid</span>
                                         <span className="text-lg font-black font-condensed italic text-gray-400 line-through">₹ {totalAmount.toLocaleString()}</span>
                                      </div>
                                      <div className="flex flex-col items-end">
                                         <span className="text-[8px] font-black uppercase text-amber-400 tracking-widest mb-1 italic underline decoration-amber-400 underline-offset-4">WINNING PRIZE</span>
                                         <span className="text-3xl font-black font-condensed italic text-amber-400 tracking-widest leading-none">₹ {totalWinningPrize.toLocaleString()}</span>
                                      </div>
                                   </div>
                                </td>
                             ) : (
                                <>
                                 <td className="px-3 py-5"></td>
                                 <td className="px-5 py-5 text-right text-red-600">
                                    <div className="flex flex-col">
                                       <span className="text-[7px] font-black uppercase opacity-60 tracking-widest mb-1 italic underline decoration-[#ff0000] underline-offset-4">Total Amount</span>
                                       <span className="text-2xl font-black font-condensed italic text-white tracking-widest">₹ {totalAmount.toLocaleString()}</span>
                                    </div>
                                 </td>
                                </>
                             )}
                          </tr>
                       </tfoot>
                    </table>
                  </div>
                  
                  {/* --- Official Seals --- */}
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center opacity-30 select-none">
                     <div className="flex items-center gap-2">
                        <ShieldCheck size={12} className="text-gray-900" />
                        <span className="text-[8px] font-black uppercase tracking-[.2em] font-serif italic">Verified Transaction</span>
                     </div>
                     <div className="text-[8px] font-bold uppercase tracking-widest">Diamond Hub Official Record</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex flex-col items-center gap-5 mt-10">
           <div className="flex gap-4">
              <button className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-xl mb-1"><Printer size={18} /></div>
                 <span className="text-[8px] font-black uppercase">Print</span>
              </button>
              <button className="flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity">
                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-900 shadow-xl mb-1"><FileText size={18} /></div>
                 <span className="text-[8px] font-black uppercase">PDF</span>
              </button>
           </div>
           <div className="text-center opacity-20">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-[0.5em] font-serif italic">Board Certified Digital Receipt</p>
           </div>
        </div>
      </div>
    </PageWrapper>
  );
};

// Simple icon component to ensure visibility
const ShieldCheck = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 .52-.88l7-4a1 1 0 0 1 .96 0l7 4A1 1 0 0 1 20 6z"/><path d="m9 12 2 2 4-4"/></svg>
);

export default MyTickets;
