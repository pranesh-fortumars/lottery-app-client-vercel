import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, 
  Trash2, 
  Edit3, 
  Trophy, 
  Clock, 
  Ticket,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Eye,
  ShieldCheck,
  Zap,
  LayoutGrid,
  ListFilter,
  Plus,
  Layers,
  Search,
  Activity,
  Calendar,
  DollarSign,
  Gamepad2,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  Filter,
  History,
  Layout
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const AdminAnnouncements = () => {
  const { purchasedTickets, addResult, declaredResults } = useCart();
  const [activeTab, setActiveTab] = useState('dispatch'); 
  
  // Workflow Navigation State
  const [workflowStep, setWorkflowStep] = useState('root'); // 'root', 'market', 'slot', 'declare'
  const [marketSelection, setMarketSelection] = useState(null); 
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Result History Date Filter
  const [historyDate, setHistoryDate] = useState(new Date().toISOString().split('T')[0]);

  // 4-Column Result Entry
  const [resultDigits, setResultDigits] = useState({ X: '', A: '', B: '', C: '' });

  // Prize Rewards Configuration
  const [prizeConfigs, setPrizeConfigs] = useState({
    '1D': { A: '100', B: '100', C: '100' },
    '2D': { AB: '500', BC: '500', AC: '500' },
    '3D': { ABC: '2000' },
    '4D': { XABC: '10000' }
  });

  const drawAssignments = {
    'DEAR': ['01:00 PM', '06:00 PM', '08:00 PM'],
    'KERALA': ['03:00 PM']
  };

  // --- Aggregate Market Analytics ---
  const marketSummary = useMemo(() => {
    const summary = {};
    Object.values(drawAssignments).flat().forEach(d => {
      const filtered = purchasedTickets.filter(t => t.title.includes(d));
      summary[d] = {
        totalQty: filtered.reduce((sum, t) => sum + t.qty, 0),
        totalValue: filtered.reduce((sum, t) => sum + (t.qty * t.price), 0)
      };
    });
    return summary;
  }, [purchasedTickets]);

  const filteredHistory = useMemo(() => {
    return declaredResults.filter(r => r.date === new Date(historyDate).toLocaleDateString());
  }, [declaredResults, historyDate]);

  const handleDigitChange = (col, val) => {
    if (val.length <= 1) {
       setResultDigits({ ...resultDigits, [col]: val });
    }
  };

  const handleDeclareResult = () => {
    const { X, A, B, C } = resultDigits;
    if (!X || !A || !B || !C) return alert("Please enter all 4 result digits.");

    const resultData = {
      draw: selectedSlot,
      brand: marketSelection,
      digits: resultDigits,
      prizes: prizeConfigs,
      timestamp: new Date().toISOString()
    };

    addResult(resultData);
    alert(`RESULT ANNOUNCED: ${X}${A}${B}${C} for ${marketSelection} ${selectedSlot}`);
    
    // Reset to Root
    setWorkflowStep('root');
    setResultDigits({ X: '', A: '', B: '', C: '' });
  };

  const exportToPDF = () => {
    alert("System preparing PDF Export... (Simulation: PDF Generated and Downloaded)");
  };

  return (
    <div className="space-y-8 p-4 pb-24 h-full bg-[#f8fbff] overflow-y-auto scrollbar-hide">
      
      {/* Tab Switcher */}
      <div className="flex bg-white rounded-2xl p-2 shadow-sm border border-gray-100 sticky top-0 z-[100]">
        {[
          { id: 'dispatch', label: 'Dispatch', icon: Zap },
          { id: 'history', label: 'History', icon: History },
          { id: 'analysis', label: 'Monitor', icon: TrendingUp },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
              activeTab === tab.id ? 'bg-[#ff004d] text-white shadow-xl shadow-[#ff004d]/20' : 'text-gray-400 hover:bg-gray-50'
            }`}
          >
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'dispatch' && (
        <div className="space-y-6">
          {workflowStep === 'root' && (
            <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-300 h-[300px]">
               <button onClick={() => setWorkflowStep('market')} className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-transparent hover:border-[#ff004d] transition-all flex flex-col items-center justify-center space-y-4 group">
                  <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-[#ff004d] group-hover:scale-110 transition-transform"><Trophy size={32} /></div>
                  <p className="text-xl font-black font-condensed tracking-tighter uppercase italic">Result</p>
               </button>
               <button className="bg-white rounded-[2.5rem] shadow-2xl border-2 border-transparent hover:border-[#ff004d] transition-all flex flex-col items-center justify-center space-y-4 group opacity-50 cursor-not-allowed">
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500"><Layout size={32} /></div>
                  <p className="text-xl font-black font-condensed tracking-tighter uppercase italic">Scheme</p>
               </button>
            </div>
          )}

          {workflowStep === 'market' && (
            <div className="animate-in slide-in-from-right-4 duration-300 space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                  <h3 className="text-lg font-black font-condensed uppercase italic">Select Market Type</h3>
                  <button onClick={() => setWorkflowStep('root')} className="text-[10px] font-black uppercase text-gray-300 hover:text-red-500">Back</button>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  {['DEAR', 'KERALA'].map(m => (
                    <button key={m} onClick={() => { setMarketSelection(m); setWorkflowStep('slot'); }} className="p-8 rounded-[1.5rem] bg-gray-50 border border-gray-100 hover:border-[#ff004d] transition-all text-center">
                       <p className="text-xl font-black font-condensed italic">{m}</p>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {workflowStep === 'slot' && (
            <div className="animate-in slide-in-from-right-4 duration-300 space-y-6 bg-white p-8 rounded-[2.5rem] shadow-2xl">
               <div className="flex justify-between items-center pb-6 border-b border-gray-50">
                  <h3 className="text-lg font-black font-condensed uppercase italic">{marketSelection} - Draw Slots</h3>
                  <button onClick={() => setWorkflowStep('market')} className="text-[10px] font-black uppercase text-gray-300 hover:text-red-500">Back</button>
               </div>
               <div className="grid grid-cols-1 gap-3">
                  {drawAssignments[marketSelection].map(slot => (
                    <button key={slot} onClick={() => { setSelectedSlot(slot); setWorkflowStep('declare'); }} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:border-[#ff004d] transition-all flex justify-between items-center">
                       <p className="text-lg font-black font-condensed italic">{slot}</p>
                       <div className="flex gap-4 opacity-40">
                          <p className="text-[8px] font-black uppercase">Tickets: {marketSummary[slot]?.totalQty || 0}</p>
                          <ChevronRight size={16} />
                       </div>
                    </button>
                  ))}
               </div>
            </div>
          )}

          {workflowStep === 'declare' && (
            <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-6">
               <div className="bg-gray-900 rounded-3xl p-6 text-white flex justify-between items-center shadow-2xl border-l-[10px] border-[#ff004d]">
                  <div>
                    <p className="text-[9px] font-black uppercase opacity-60 tracking-[.2em]">{marketSelection}</p>
                    <h2 className="text-2xl font-black font-condensed italic tracking-tighter">{selectedSlot}</h2>
                  </div>
                  <button onClick={() => setWorkflowStep('slot')} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-colors"><Trash2 size={18} /></button>
               </div>

               <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 space-y-8">
                  {/* 4-Digit Matrix */}
                  <div className="grid grid-cols-4 gap-4">
                    {['X', 'A', 'B', 'C'].map(col => (
                      <div key={col} className="space-y-2 text-center">
                        <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{col === 'X' ? 'X / D' : col}</label>
                        <input type="number" value={resultDigits[col]} onChange={(e) => handleDigitChange(col, e.target.value)} className="w-full h-20 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-4xl font-black focus:border-[#ff004d] focus:bg-white outline-none" />
                      </div>
                    ))}
                  </div>

                  {/* Prize Configuration */}
                  <div className="grid grid-cols-2 gap-4">
                     <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">1D Prizes</p>
                        {['A', 'B', 'C'].map(p => (
                          <div key={p} className="flex items-center justify-between gap-2">
                             <span className="text-[10px] font-black text-gray-400 italic">{p}</span>
                             <input type="number" value={prizeConfigs['1D'][p]} onChange={(e) => setPrizeConfigs({...prizeConfigs, '1D': {...prizeConfigs['1D'], [p]: e.target.value}})} className="w-20 bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs font-black" />
                          </div>
                        ))}
                     </div>
                     <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                        <p className="text-[9px] font-black text-red-500 uppercase tracking-widest">2D Prizes</p>
                        {['AB', 'BC', 'AC'].map(p => (
                          <div key={p} className="flex items-center justify-between gap-2">
                             <span className="text-[10px] font-black text-gray-400 italic">{p}</span>
                             <input type="number" value={prizeConfigs['2D'][p]} onChange={(e) => setPrizeConfigs({...prizeConfigs, '2D': {...prizeConfigs['2D'], [p]: e.target.value}})} className="w-20 bg-white border border-gray-200 rounded-lg py-1 px-2 text-xs font-black" />
                          </div>
                        ))}
                     </div>
                  </div>

                  <button onClick={handleDeclareResult} className="w-full bg-[#ff004d] text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-[#ff004d]/20 active:scale-95 transition-all">DECLARE RESULT</button>
               </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
           {/* Date Filter & Export */}
           <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-red-50 text-[#ff004d] rounded-xl flex items-center justify-center"><Calendar size={20} /></div>
                 <input type="date" value={historyDate} onChange={(e) => setHistoryDate(e.target.value)} className="bg-transparent border-none font-black text-sm outline-none cursor-pointer" />
              </div>
              <button onClick={exportToPDF} className="bg-gray-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-600 transition-colors"><Download size={14} /> Export PDF</button>
           </div>

           {/* Results List */}
           {filteredHistory.length > 0 ? (
             <div className="space-y-4">
                {filteredHistory.map((res, i) => (
                  <div key={i} className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative overflow-hidden group hover:border-[#ff004d] transition-all">
                     <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><FileText size={80} /></div>
                     <div className="flex justify-between items-center mb-6">
                        <div>
                          <p className="text-[10px] font-black text-[#ff004d] uppercase tracking-[.2em]">{res.brand}</p>
                          <h4 className="text-xl font-black font-condensed italic">{res.draw}</h4>
                        </div>
                        <div className="text-right">
                           <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 italic">Winning Number</p>
                           <div className="flex gap-2">
                              {res.number.split('').map((n, idx) => (
                                <span key={idx} className="w-8 h-8 bg-gray-900 text-white rounded-lg flex items-center justify-center font-black text-lg shadow-lg border-b-2 border-red-600">{n}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                     <div className="bg-gray-50 rounded-2xl p-4 grid grid-cols-4 gap-2">
                        <div className="text-center border-r border-gray-200">
                           <p className="text-[7px] font-black text-gray-400 uppercase mb-1">1D Win</p>
                           <p className="text-sm font-black text-gray-900">₹ {res.prizes['1D'].A}</p>
                        </div>
                        <div className="text-center border-r border-gray-200">
                           <p className="text-[7px] font-black text-gray-400 uppercase mb-1">2D Win</p>
                           <p className="text-sm font-black text-gray-900">₹ {res.prizes['2D'].AB}</p>
                        </div>
                        <div className="text-center border-r border-gray-200">
                           <p className="text-[7px] font-black text-gray-400 uppercase mb-1">3D Win</p>
                           <p className="text-sm font-black text-gray-900">₹ {res.prizes['3D'].ABC}</p>
                        </div>
                        <div className="text-center">
                           <p className="text-[7px] font-black text-gray-400 uppercase mb-1">4D Win</p>
                           <p className="text-sm font-black text-gray-900">₹ {res.prizes['4D'].XABC}</p>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="bg-white rounded-[2.5rem] p-20 text-center space-y-4 shadow-xl border border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200"><Search size={40} /></div>
                <h4 className="text-lg font-black font-condensed tracking-tighter uppercase italic text-gray-400">No results found for this date</h4>
             </div>
           )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="space-y-6">
           <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-gray-50">
             <div className="flex items-center gap-3 mb-8">
                <Activity className="text-[#ff004d]" size={20} />
                <h3 className="font-condensed font-black text-xl italic uppercase tracking-tighter">Market Pulse</h3>
             </div>
             <div className="grid grid-cols-2 gap-4">
                {Object.keys(marketSummary).map(d => (
                  <div key={d} className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 text-left">
                     <p className="text-[8px] font-black text-[#ff004d] uppercase tracking-[.2em] mb-1">{marketSelection ? marketSelection : 'ACTIVE SLOT'}</p>
                     <p className="text-xl font-black font-condensed italic leading-none">{d}</p>
                     <div className="mt-4 flex justify-between items-end opacity-40">
                        <p className="text-[7px] font-black uppercase">Qty: {marketSummary[d].totalQty}</p>
                        <p className="text-xs font-black">₹ {marketSummary[d].totalValue}</p>
                     </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
