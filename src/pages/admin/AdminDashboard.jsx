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
    <div className="space-y-6 pb-6 p-4">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 group">
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                <stat.icon size={18} />
              </div>
            </div>
            <h3 className="text-gray-400 text-[8px] font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-sm font-black text-gray-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Charts / Data Section */}
      <div className="space-y-6">
        {/* Recent Results Table */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 overflow-hidden">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-black text-gray-800 font-condensed uppercase tracking-tight">Recent Results</h2>
              <button className="text-[#f42464] text-[8px] font-black uppercase tracking-widest">View All</button>
           </div>
           
           <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-400 text-[8px] font-black uppercase tracking-widest border-b">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Entries</th>
                    <th className="pb-2">Revenue</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                   {recentDraws.map((draw, idx) => (
                     <tr key={idx}>
                        <td className="py-3 text-[10px] font-black text-gray-800">{draw.time}</td>
                        <td className="py-3 text-[10px] font-bold text-gray-500">{draw.entries}</td>
                        <td className="py-3 text-[10px] font-black text-emerald-600">{draw.revenue}</td>
                        <td className="py-3 text-right">
                           <span className="text-[8px] font-black uppercase text-[#f42464]">
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
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
           <h2 className="text-sm font-black text-gray-800 font-condensed uppercase tracking-tight mb-4">Live Activity</h2>
           <div className="space-y-4 flex-grow">
              {[
                { user: 'User #458', action: 'Purchased Jackpot', time: '2m', color: 'bg-red-50 text-[#f42464]', icon: Ticket },
                { user: 'Rajesh K.', action: 'New Registration', time: '5m', color: 'bg-blue-50 text-blue-500', icon: Users },
                { user: 'Amit S.', action: 'Won Prize', time: '12m', color: 'bg-emerald-50 text-emerald-500', icon: TrendingUp },
              ].map((activity, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                   <div className={`p-2 rounded-lg ${activity.color} shrink-0`}>
                      <activity.icon size={14} />
                   </div>
                   <div className="flex-grow">
                      <p className="text-[10px] font-black text-gray-800 leading-tight">{activity.user}</p>
                      <p className="text-[8px] text-gray-400 font-bold uppercase">{activity.action}</p>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
