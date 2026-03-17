import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  UserPlus, 
  MoreHorizontal,
  Mail,
  Phone,
  Wallet
} from 'lucide-react';

const AdminUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([
    { id: '101', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+91 98765 43210', balance: '₹14,500', status: 'Active', joined: 'Mar 10, 2024' },
    { id: '102', name: 'Amit Singh', email: 'amit@example.com', phone: '+91 87654 32109', balance: '₹2,100', status: 'Active', joined: 'Mar 12, 2024' },
    { id: '103', name: 'Suresh Patil', email: 'suresh@example.com', phone: '+91 76543 21098', balance: '₹0', status: 'Restricted', joined: 'Mar 14, 2024' },
    { id: '104', name: 'Vijay Varma', email: 'vijay@example.com', phone: '+91 65432 10987', balance: '₹42,800', status: 'Active', joined: 'Mar 15, 2024' },
  ]);

  return (
    <div className="space-y-8">
      {/* Search & Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-6">
        <div className="relative flex-grow max-w-2xl">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
           <input 
             type="text" 
             placeholder="Search by name, email, or user ID..." 
             className="w-full h-16 bg-white border border-gray-100 rounded-[2rem] pl-16 pr-6 outline-none font-bold text-gray-800 shadow-sm focus:border-[#f42464] focus:ring-4 focus:ring-[#f42464]/5 transition-all"
           />
        </div>
        
        <div className="flex gap-4 shrink-0">
           <button className="flex-1 sm:flex-none h-16 px-8 bg-white border border-gray-100 rounded-[2rem] font-black text-xs text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:bg-gray-50 transition-all">
              <Filter size={18} /> Filter By
           </button>
           <button className="flex-1 sm:flex-none h-16 px-8 bg-gradient-to-r from-[#f42464] to-[#ff004d] rounded-[2rem] font-black text-xs text-white uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg hover:scale-105 active:scale-95 transition-all">
              <UserPlus size={18} /> New User
           </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-left text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b">
                   <th className="py-6 px-10">Member Name</th>
                   <th className="py-6 px-6">Wallet Balance</th>
                   <th className="py-6 px-6">Status</th>
                   <th className="py-6 px-6">Joined Date</th>
                   <th className="py-6 px-10 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                 {users.map((user) => (
                   <tr 
                     key={user.id} 
                     className="group hover:bg-gray-50/80 transition-all cursor-pointer"
                     onClick={() => navigate(`/admin/users/${user.id}`)}
                   >
                      <td className="py-6 px-10">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#fce4ec] text-[#f42464] flex items-center justify-center font-black text-lg shadow-sm border border-white">
                               {user.name.charAt(0)}
                            </div>
                            <div>
                               <p className="font-black text-gray-800 text-base leading-tight">{user.name}</p>
                               <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mt-1">
                                  <Mail size={12} /> {user.email}
                               </div>
                            </div>
                         </div>
                      </td>
                      <td className="py-6 px-6">
                         <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                               <Wallet size={14} />
                            </div>
                            <span className="font-black text-gray-800">{user.balance}</span>
                         </div>
                      </td>
                      <td className="py-6 px-6">
                         <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight ${
                           user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                         }`}>
                           {user.status}
                         </span>
                      </td>
                      <td className="py-6 px-6 text-sm font-bold text-gray-400 uppercase tracking-tight">
                         {user.joined}
                      </td>
                      <td className="py-6 px-10">
                         <div className="flex items-center justify-end gap-3">
                            <button className="p-2.5 rounded-xl bg-gray-50 text-gray-400 hover:text-[#f42464] transition-colors">
                               <MoreHorizontal size={20} />
                            </button>
                            <div className="p-2 bg-gray-50 rounded-xl text-gray-300 group-hover:bg-[#f42464] group-hover:text-white transition-all shadow-sm">
                               <ChevronRight size={20} />
                            </div>
                         </div>
                      </td>
                   </tr>
                 ))}
              </tbody>
            </table>
         </div>
         
         <div className="p-8 border-t border-gray-50 flex justify-between items-center">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Showing 1 to 4 of 12,845 members</p>
            <div className="flex gap-2">
               <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-xs font-black text-gray-400 hover:bg-gray-50 transition-all">1</button>
               <button className="w-10 h-10 rounded-xl bg-[#f42464] text-white flex items-center justify-center text-xs font-black shadow-lg">2</button>
               <button className="w-10 h-10 rounded-xl border border-gray-100 flex items-center justify-center text-xs font-black text-gray-400 hover:bg-gray-50 transition-all">3</button>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminUsers;
