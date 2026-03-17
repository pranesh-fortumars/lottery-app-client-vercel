import React, { useState } from 'react';
import { 
  Play, 
  Square, 
  Settings2, 
  RefreshCcw, 
  AlertCircle,
  Clock,
  Zap,
  ShieldCheck
} from 'lucide-react';

const AdminControl = () => {
  const [activeLotteries, setActiveLotteries] = useState([
    { id: 1, name: 'Dear Lottery (01:00 PM)', status: 'Running', entries: 1245 },
    { id: 2, name: 'Dear Lottery (06:00 PM)', status: 'Scheduled', entries: 0 },
    { id: 3, name: 'Kerala State (03:00 PM)', status: 'Paused', entries: 450 },
  ]);

  return (
    <div className="space-y-10 pb-20">
      {/* Global Status Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-3xl bg-[#f42464] flex items-center justify-center shadow-[0_0_30px_rgba(244,36,100,0.4)] animate-pulse">
                  <Zap size={32} fill="white" />
               </div>
               <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight font-condensed">System Engine State</h2>
                  <p className="text-sm font-bold opacity-60 uppercase tracking-widest text-[#f42464]">Active & Processing Live Slots</p>
               </div>
            </div>
            
            <div className="flex gap-4">
               <button className="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
                  <RefreshCcw size={16} /> Restart Engine
               </button>
               <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-lg transition-all">
                  <Square size={16} fill="white" /> Emergency Stop
               </button>
            </div>
         </div>
         {/* Decorative background elements */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#f42464] opacity-10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* Slot Controls */}
        <div className="space-y-6">
           <h3 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tight flex items-center gap-2">
              <Settings2 className="text-[#f42464]" size={24} /> Live Slot Management
           </h3>
           
           <div className="space-y-4">
              {activeLotteries.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center justify-between group">
                   <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        item.status === 'Running' ? 'bg-emerald-500 animate-ping' : 
                        item.status === 'Paused' ? 'bg-orange-500' : 'bg-blue-500'
                      }`} />
                      <div>
                         <h4 className="font-black text-gray-800 text-lg tracking-tight">{item.name}</h4>
                         <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{item.status} • {item.entries} Entries</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-2 opacity-100 xl:opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status !== 'Running' && (
                        <button className="p-3 rounded-xl bg-emerald-50 text-emerald-600 shadow-sm hover:bg-emerald-600 hover:text-white transition-all">
                           <Play size={20} fill="currentColor" />
                        </button>
                      )}
                      {item.status === 'Running' && (
                        <button className="p-3 rounded-xl bg-orange-50 text-orange-600 shadow-sm hover:bg-orange-600 hover:text-white transition-all">
                           <Square size={20} fill="currentColor" />
                        </button>
                      )}
                      <button className="p-3 rounded-xl bg-gray-50 text-gray-400 shadow-sm hover:bg-[#f42464] hover:text-white transition-all">
                         <RefreshCcw size={20} />
                      </button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Global Parameters */}
        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm space-y-8">
           <h3 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tight flex items-center gap-2">
              <ShieldCheck className="text-[#f42464]" size={24} /> Game Parameters
           </h3>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Ticket Price Unit</label>
                 <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 h-14">
                    <span className="font-black text-gray-400 mr-2">₹</span>
                    <input type="number" defaultValue="11" className="bg-transparent border-none outline-none font-black text-gray-800 w-full" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Max Tickets Per Slot</label>
                 <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 h-14">
                    <input type="number" defaultValue="5000" className="bg-transparent border-none outline-none font-black text-gray-800 w-full" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Booking Deadline (Mins)</label>
                 <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 h-14">
                    <Clock size={18} className="text-gray-400 mr-2" />
                    <input type="number" defaultValue="15" className="bg-transparent border-none outline-none font-black text-gray-800 w-full" />
                 </div>
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Win Multiplier</label>
                 <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 h-14">
                    <span className="font-black text-gray-400 mr-2">x</span>
                    <input type="number" defaultValue="9" className="bg-transparent border-none outline-none font-black text-gray-800 w-full" />
                 </div>
              </div>
           </div>

           <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-orange-500 shrink-0" size={20} />
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wide leading-relaxed">
                 Updating these parameters will affect all future lotteries and calculations. Ensure you have confirmed the financial impact.
              </p>
           </div>

           <button className="w-full bg-[#f42464] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
              Save Global Changes
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminControl;
