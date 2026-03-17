import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Wallet, 
  History, 
  ShieldAlert, 
  Mail, 
  Phone,
  Edit,
  Activity,
  Ticket
} from 'lucide-react';

const AdminUserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  // Mock data for specific user
  const user = {
    id: userId,
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 98765 43210',
    balance: 14500,
    status: 'Active',
    joined: 'Mar 10, 2024',
    tickets: 154,
    won: '₹42,500',
    recentActivity: [
      { id: 1, type: 'Purchase', amount: '-₹440', date: 'Today, 10:30 AM', desc: 'Bought 40 units' },
      { id: 2, type: 'Win', amount: '+₹1,000', date: 'Yesterday', desc: 'Won Double Digit' },
      { id: 3, type: 'Deposit', amount: '+₹5,000', date: 'Mar 15, 2024', desc: 'Wallet Top-up' },
    ]
  };

  return (
    <div className="space-y-6 p-4 pb-20">
      {/* Navigation */}
      <button 
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-gray-400 font-black text-[10px] uppercase tracking-widest active:text-[#f42464]"
      >
        <ArrowLeft size={16} /> Back to Users
      </button>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
         <div className="w-20 h-20 rounded-2xl bg-[#fce4ec] text-[#f42464] flex items-center justify-center font-black text-2xl border border-gray-100 shadow-sm mb-4">
            {user.name.charAt(0)}
         </div>
         <h2 className="text-lg font-black text-gray-800 tracking-tight">{user.name}</h2>
         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID: #{user.id}</p>
         
         <div className="flex gap-2 mt-4">
            <span className="bg-emerald-50 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-100">
               {user.status} Member
            </span>
         </div>

         <div className="w-full mt-6 space-y-3 pt-6 border-t border-gray-50">
            <div className="flex items-center gap-3">
               <Mail size={14} className="text-gray-300" />
               <p className="text-xs font-bold text-gray-600">{user.email}</p>
            </div>
            <div className="flex items-center gap-3">
               <Phone size={14} className="text-gray-300" />
               <p className="text-xs font-bold text-gray-600">{user.phone}</p>
            </div>
         </div>
      </div>

      {/* Wallet Summary */}
      <div className="bg-gradient-to-br from-[#f42464] to-[#ff004d] rounded-3xl p-6 text-white shadow-lg">
         <p className="text-[8px] font-bold uppercase tracking-widest opacity-70 mb-1">Wallet Balance</p>
         <h3 className="text-2xl font-black">₹{user.balance.toLocaleString()}</h3>
         
         <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
            <div>
               <p className="text-[8px] font-bold uppercase tracking-widest opacity-70">Tickets</p>
               <p className="text-sm font-black">{user.tickets}</p>
            </div>
            <div>
               <p className="text-[8px] font-bold uppercase tracking-widest opacity-70">Won</p>
               <p className="text-sm font-black text-yellow-400">{user.won}</p>
            </div>
         </div>
      </div>

      {/* Activity History */}
      <div className="space-y-4">
         <h3 className="text-sm font-black text-gray-800 font-condensed uppercase tracking-tight flex items-center gap-2">
            <History className="text-[#f42464]" size={18} /> Recent Activity
         </h3>
         
         <div className="space-y-3">
            {user.recentActivity.map((act) => (
               <div key={act.id} className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        act.type === 'Purchase' ? 'bg-red-50 text-[#f42464]' :
                        act.type === 'Win' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-blue-50 text-blue-600'
                     }`}>
                        {act.type === 'Purchase' ? <Ticket size={16} /> :
                         act.type === 'Win' ? <Activity size={16} /> :
                         <Wallet size={16} />}
                     </div>
                     <div>
                        <h4 className="text-[10px] font-black text-gray-800">{act.desc}</h4>
                        <p className="text-[8px] text-gray-400 font-bold uppercase">{act.date}</p>
                     </div>
                  </div>
                  <span className={`text-xs font-black ${act.amount.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
                     {act.amount}
                  </span>
               </div>
            ))}
         </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
         <button className="flex-1 bg-white border border-gray-100 py-4 rounded-2xl font-black text-[10px] text-red-500 uppercase tracking-widest active:bg-red-50 shadow-sm">
            Restrict
         </button>
         <button className="flex-1 bg-gray-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest active:bg-black shadow-lg">
            Edit Profile
         </button>
      </div>
    </div>
  );
};

export default AdminUserDetails;
