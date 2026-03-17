import React from 'react';
import { 
  Users, 
  Ticket, 
  TrendingUp, 
  Wallet,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '12,845', icon: Users, change: '+12%', color: 'from-blue-500 to-blue-600' },
    { label: 'Today Tickets', value: '4,210', icon: Ticket, change: '+25%', color: 'from-[#f42464] to-[#ff004d]' },
    { label: 'Revenue (Today)', value: '₹145,200', icon: Wallet, change: '+8.4%', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Active Sessions', value: '842', icon: TrendingUp, change: '-4%', color: 'from-orange-500 to-orange-600' },
  ];

  const recentDraws = [
    { time: '01:00 PM', game: 'DEAR', entries: 1245, revenue: '₹42,500', status: 'Completed' },
    { time: '06:00 PM', game: 'DEAR', entries: 1890, revenue: '₹68,200', status: 'Completed' },
    { time: '08:00 PM', game: 'DEAR', entries: 450, revenue: '₹12,400', status: 'Ongoing' },
    { time: '03:00 PM', game: 'KERALA', entries: 870, revenue: '₹31,000', status: 'Completed' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                {stat.change}
                {stat.change.startsWith('+') ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              </div>
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-black text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts / Data Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Results Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tight">Recent Lottery Performance</h2>
              <button className="text-[#f42464] text-xs font-black uppercase tracking-widest hover:underline">View All</button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b pb-4">
                    <th className="pb-4">Game Time</th>
                    <th className="pb-4">Category</th>
                    <th className="pb-4">Entries</th>
                    <th className="pb-4">Revenue</th>
                    <th className="pb-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {recentDraws.map((draw, idx) => (
                     <tr key={idx} className="group hover:bg-gray-50/50 transition-colors">
                        <td className="py-5">
                           <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-500">
                                 <Clock size={16} />
                              </div>
                              <span className="font-black text-gray-800 text-sm">{draw.time}</span>
                           </div>
                        </td>
                        <td className="py-5 font-bold text-gray-500 text-sm">{draw.game}</td>
                        <td className="py-5 font-black text-gray-800 text-sm">{draw.entries}</td>
                        <td className="py-5 font-black text-emerald-600 text-sm">{draw.revenue}</td>
                        <td className="py-5 text-right">
                           <span className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-tight ${
                             draw.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600 animate-pulse'
                           }`}>
                             {draw.status}
                           </span>
                        </td>
                     </tr>
                   ))}
                </tbody>
              </table>
           </div>
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
           <h2 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tight mb-6">Live Activity</h2>
           <div className="space-y-6 flex-grow">
              {[
                { user: 'User #458', action: 'Purchased Jackpot Ticket', time: '2m ago', icon: Ticket, color: 'bg-red-50 text-[#f42464]' },
                { user: 'Rajesh K.', action: 'New Registration', time: '5m ago', icon: Users, color: 'bg-blue-50 text-blue-500' },
                { user: 'Amit S.', action: 'Won 3 Digit Prize', time: '12m ago', icon: TrendingUp, color: 'bg-emerald-50 text-emerald-500' },
                { user: 'User #921', action: 'Updated Wallet', time: '15m ago', icon: Wallet, color: 'bg-orange-50 text-orange-500' },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-4 items-start">
                   <div className={`p-2.5 rounded-xl ${activity.color} shrink-0`}>
                      <activity.icon size={18} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-sm font-black text-gray-800 leading-tight">{activity.user}</p>
                      <p className="text-xs text-gray-400 font-bold">{activity.action}</p>
                   </div>
                   <span className="text-[10px] font-bold text-gray-300 uppercase whitespace-nowrap">{activity.time}</span>
                </div>
              ))}
           </div>
           <button className="mt-8 w-full py-3.5 bg-gray-50 rounded-2xl text-xs font-black text-gray-500 uppercase tracking-widest hover:bg-gray-100 transition-all">
              Full Activity Log
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
