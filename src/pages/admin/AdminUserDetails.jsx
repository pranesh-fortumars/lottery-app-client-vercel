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
  MoreVertical,
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
      { id: 1, type: 'Purchase', amount: '-₹440', date: 'Today, 10:30 AM', desc: 'Bought 40 units for 01:00 PM Draw' },
      { id: 2, type: 'Win', amount: '+₹1,000', date: 'Yesterday', desc: 'Won Double Digit Prize (Board A)' },
      { id: 3, type: 'Deposit', amount: '+₹5,000', date: 'Mar 15, 2024', desc: 'Wallet Top-up via GPay' },
    ]
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Navigation & Actions */}
      <div className="flex justify-between items-center">
         <button 
           onClick={() => navigate('/admin/users')}
           className="p-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500 hover:text-[#f42464] hover:border-[#f42464]/20 transition-all flex items-center gap-2 group"
         >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest pr-2">Back to Users</span>
         </button>
         
         <div className="flex gap-4">
            <button className="h-12 px-6 bg-white border border-gray-100 rounded-[1.5rem] font-black text-[10px] text-red-500 uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-red-50 transition-all">
               <ShieldAlert size={16} /> Restrict User
            </button>
            <button className="h-12 px-6 bg-gray-900 text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg hover:bg-black transition-all">
               <Edit size={16} /> Edit Profile
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
         {/* Profile Information */}
         <div className="xl:col-span-1 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col items-center text-center">
               <div className="w-32 h-32 rounded-[2.5rem] bg-[#fce4ec] text-[#f42464] flex items-center justify-center font-black text-4xl shadow-xl border-4 border-white mb-6">
                  {user.name.charAt(0)}
               </div>
               <h2 className="text-2xl font-black text-gray-800 tracking-tight">{user.name}</h2>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mt-1">User ID: #{user.id}</p>
               
               <div className="flex gap-2 mt-6">
                  <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ring-1 ring-emerald-100">
                     {user.status} Member
                  </span>
               </div>

               <div className="w-full mt-10 space-y-4 pt-8 border-t border-gray-50">
                  <div className="flex items-center gap-4 text-left">
                     <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400"><Mail size={18} /></div>
                     <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p><p className="text-sm font-black text-gray-800">{user.email}</p></div>
                  </div>
                  <div className="items-center gap-4 text-left flex">
                     <div className="p-2.5 rounded-xl bg-gray-50 text-gray-400"><Phone size={18} /></div>
                     <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p><p className="text-sm font-black text-gray-800">{user.phone}</p></div>
                  </div>
               </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-br from-[#f42464] to-[#ff004d] rounded-[2.5rem] p-10 text-white shadow-xl shadow-[#f42464]/20">
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-white/20 rounded-2xl"><Wallet size={24} /></div>
                  <div><p className="text-xs font-bold opacity-70 uppercase tracking-widest">Current Balance</p><h3 className="text-3xl font-black ">₹{user.balance.toLocaleString()}</h3></div>
               </div>
               <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                  <div><p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Total Tickets</p><p className="text-xl font-black">{user.tickets}</p></div>
                  <div><p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1">Total Won</p><p className="text-xl font-black text-yellow-400">{user.won}</p></div>
               </div>
            </div>
         </div>

         {/* Detailed Activity & Performance */}
         <div className="xl:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
               <div className="flex justify-between items-center mb-10">
                  <h3 className="text-xl font-black text-gray-800 font-condensed uppercase tracking-tighter flex items-center gap-3">
                     <History className="text-[#f42464]" size={24} /> Transaction History
                  </h3>
                  <button className="p-3 bg-gray-50 rounded-xl text-gray-400"><MoreVertical size={20} /></button>
               </div>

               <div className="space-y-8">
                  {user.recentActivity.map((act) => (
                    <div key={act.id} className="flex gap-6 items-start relative group">
                       <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center shadow-md ${
                         act.type === 'Purchase' ? 'bg-red-50 text-[#f42464]' :
                         act.type === 'Win' ? 'bg-emerald-50 text-emerald-600' :
                         'bg-blue-50 text-blue-600'
                       }`}>
                          {act.type === 'Purchase' ? <Ticket size={24} /> :
                           act.type === 'Win' ? <Activity size={24} /> :
                           <Wallet size={24} />}
                       </div>
                       
                       <div className="flex-grow space-y-1">
                          <div className="flex justify-between items-start">
                             <h4 className="font-black text-gray-800 tracking-tight">{act.desc}</h4>
                             <span className={`text-base font-black ${act.amount.startsWith('-') ? 'text-red-500' : 'text-emerald-500'}`}>
                                {act.amount}
                             </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-bold uppercase tracking-tight">
                             <span>{act.type}</span>
                             <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                             <span>{act.date}</span>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>

               <button className="w-full mt-10 py-5 bg-gray-50 rounded-2xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-100 transition-all">
                  Load Full Statement
               </button>
            </div>

            {/* Account Logs / Verification */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
               <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-inner">
                     <ShieldAlert size={32} />
                  </div>
                  <div>
                     <h4 className="text-lg font-black text-gray-800 tracking-tight">KYC & Identity Verification</h4>
                     <p className="text-xs text-gray-400 font-bold mt-1">Verified on Mar 11, 2024 via Aadhar OTP</p>
                  </div>
               </div>
               <button className="w-full md:w-auto px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-gray-100 shadow-sm">
                  Review Documents
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminUserDetails;
