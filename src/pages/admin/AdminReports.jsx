import React from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  PieChart, 
  Activity,
  ArrowRight,
  Printer
} from 'lucide-react';

const AdminReports = () => {
  const reports = [
    { title: 'Daily Revenue Report', desc: 'Detailed breakdown of sales and prize payouts.', date: 'Daily', icon: Activity, color: 'emerald' },
    { title: 'User Growth Analytics', desc: 'Tracking new registrations and user retention.', date: 'Weekly', icon: PieChart, color: 'blue' },
    { title: 'Lottery Accuracy Audit', desc: 'Verifying random number generation and results.', date: 'Monthly', icon: FileText, color: 'orange' },
    { title: 'Wallet Transaction Log', desc: 'Complete history of all deposits and winnings.', date: 'Real-time', icon: Calendar, color: 'pink' },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Top Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Business Intelligence</p>
            <h2 className="text-2xl font-black text-gray-800 font-condensed uppercase tracking-tighter">System & Financial Reports</h2>
         </div>
         <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none h-14 px-6 bg-white border border-gray-100 rounded-2xl font-black text-xs text-gray-500 uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm">
               <Calendar size={18} /> Select Range
            </button>
            <button className="flex-1 md:flex-none h-14 px-6 bg-[#f42464] text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
               <Download size={18} /> Export All
            </button>
         </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         {reports.map((report, idx) => (
           <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col md:flex-row gap-8">
              <div className={`w-20 h-20 rounded-3xl shrink-0 flex items-center justify-center shadow-lg transition-transform group-hover:rotate-6 ${
                report.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                report.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                report.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                'bg-red-50 text-[#f42464]'
              }`}>
                 <report.icon size={36} />
              </div>
              
              <div className="flex-grow space-y-3">
                 <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-gray-800 tracking-tight">{report.title}</h3>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest border border-gray-100 px-3 py-1 rounded-full">{report.date}</span>
                 </div>
                 <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                    {report.desc}
                 </p>
                 <div className="flex gap-4 pt-4">
                    <button className="bg-gray-50 hover:bg-[#f42464] text-gray-600 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm">
                       <Eye size={14} /> View
                    </button>
                    <button className="bg-gray-50 hover:bg-gray-900 text-gray-600 hover:text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm">
                       <Download size={14} /> CSV
                    </button>
                    <button className="bg-gray-50 hover:bg-gray-900 text-gray-600 hover:text-white px-3 py-2.5 rounded-xl shadow-sm transition-all focus:ring-2 ring-gray-200">
                       <Printer size={14} />
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {/* Featured Big Report / Chart Placeholder */}
      <div className="bg-gray-900 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl">
         <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
               <span className="bg-[#f42464] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Insight</span>
               <h2 className="text-4xl font-black font-condensed tracking-tighter uppercase leading-none">Annual Financial Projection <br/> & Market Trends 2024</h2>
               <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-md">
                 A comprehensive analysis of user spending patterns, jackpot winning ratios across different states, and fiscal health indicators for the next 12 months.
               </p>
               <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl hover:scale-105 transition-all">
                  Access Premium Report <ArrowRight size={20} />
               </button>
            </div>
            
            <div className="hidden lg:flex justify-center -rotate-6">
               <div className="w-80 h-96 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-end gap-10">
                  <div className="space-y-4">
                     <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-[#f42464]"></div></div>
                     <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-blue-500"></div></div>
                     <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-emerald-500"></div></div>
                  </div>
                  <div className="flex justify-between items-end">
                     <div className="w-12 h-32 bg-gradient-to-t from-[#f42464] to-transparent rounded-t-xl opacity-80"></div>
                     <div className="w-12 h-44 bg-gradient-to-t from-blue-500 to-transparent rounded-t-xl opacity-80"></div>
                     <div className="w-12 h-24 bg-gradient-to-t from-emerald-500 to-transparent rounded-t-xl opacity-80"></div>
                     <div className="w-12 h-52 bg-gradient-to-t from-[#f42464] to-transparent rounded-t-xl opacity-80"></div>
                  </div>
               </div>
            </div>
         </div>
         {/* Background blur effects */}
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#f42464] opacity-20 blur-[120px] rounded-full -mr-64 -mb-64"></div>
         <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 opacity-10 blur-[100px] rounded-full -ml-32 -mt-32"></div>
      </div>
    </div>
  );
};

export default AdminReports;
