import React, { useState } from 'react';
import { 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Eye,
  MoreVertical
} from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Mega Jackpot Result Out!', content: 'The results for today\'s 01:00 PM draw are now available...', date: '2024-03-17 14:30', status: 'Active', priority: 'High' },
    { id: 2, title: 'System Maintenance', content: 'Application will be down for 30 minutes tonight at 11 PM...', date: '2024-03-16 10:00', status: 'Draft', priority: 'Medium' },
    { id: 3, title: 'New Kerala Lottery Schedule', content: 'Check out the updated timings for Kerala State lotteries...', date: '2024-03-15 09:00', status: 'Active', priority: 'Low' },
  ]);

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Broadcast Management</p>
           <h2 className="text-2xl font-black text-gray-800 font-condensed uppercase tracking-tighter">Announcements & Alerts</h2>
        </div>
        <button className="bg-gradient-to-r from-[#f42464] to-[#ff004d] text-white px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wide flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all">
          <Plus size={20} /> Create New
        </button>
      </div>

      {/* Grid of Announcements */}
      <div className="grid grid-cols-1 gap-6">
        {announcements.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 relative group">
            <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center shadow-lg ${
              item.status === 'Active' ? 'bg-[#f42464] text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              <Megaphone size={28} />
            </div>

            <div className="flex-grow space-y-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-black text-gray-800 tracking-tight">{item.title}</h3>
                <span className={`px-2.5 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                  item.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'
                }`}>
                  {item.priority} Priority
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-3xl">
                {item.content}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                   <Clock size={14} /> {item.date}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-black uppercase tracking-tight">
                   <CheckCircle2 size={14} /> {item.status}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 border-l border-gray-50 pl-6 shrink-0">
               <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#f42464] hover:bg-red-50 transition-all shadow-sm">
                  <Edit3 size={18} />
               </button>
               <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#f42464] hover:bg-red-50 transition-all shadow-sm">
                  <Eye size={18} />
               </button>
               <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm">
                  <Trash2 size={18} />
               </button>
            </div>
            
            <button className="absolute top-6 right-6 lg:hidden">
              <MoreVertical size={20} className="text-gray-300" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAnnouncements;
