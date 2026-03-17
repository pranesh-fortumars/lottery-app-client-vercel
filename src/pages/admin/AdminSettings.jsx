import React, { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Bell, 
  Globe, 
  CreditCard,
  User,
  Database,
  Lock,
  ChevronRight
} from 'lucide-react';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('General');

  const tabs = [
    { id: 'General', icon: Settings, label: 'General Info' },
    { id: 'Security', icon: Shield, label: 'Security & Access' },
    { id: 'Notifications', icon: Bell, label: 'System Alerts' },
    { id: 'Financial', icon: CreditCard, label: 'Payment Gateway' },
    { id: 'Integration', icon: Globe, label: 'API & External' },
  ];

  const SettingRow = ({ label, desc, children }) => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center py-8 gap-6 first:pt-0 last:pb-0">
      <div className="space-y-1 max-w-lg">
         <h4 className="text-base font-black text-gray-800 tracking-tight">{label}</h4>
         <p className="text-xs text-gray-500 font-medium leading-relaxed">{desc}</p>
      </div>
      <div className="w-full md:w-auto shrink-0">
         {children}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 pb-20">
      {/* Sidebar Tabs */}
      <div className="xl:col-span-1 space-y-4">
         {tabs.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`w-full flex items-center justify-between p-5 rounded-3xl transition-all ${
               activeTab === tab.id 
                 ? 'bg-[#f42464] text-white shadow-xl shadow-[#f42464]/20 scale-[1.05]' 
                 : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'
             }`}
           >
              <div className="flex items-center gap-4">
                 <tab.icon size={20} />
                 <span className="text-xs font-black uppercase tracking-widest">{tab.label}</span>
              </div>
              <ChevronRight size={16} className={activeTab === tab.id ? 'opacity-100' : 'opacity-0'} />
           </button>
         ))}
      </div>

      {/* Settings Content Area */}
      <div className="xl:col-span-3 bg-white rounded-[3rem] p-12 border border-gray-100 shadow-sm">
         <div className="border-b border-gray-50 pb-8 mb-8 flex justify-between items-center text-gray-800">
            <div>
               <h2 className="text-3xl font-black font-condensed uppercase tracking-tighter">System {activeTab}</h2>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your lottery application core behavior</p>
            </div>
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300">
               <Database size={24} />
            </div>
         </div>

         <div className="divide-y divide-gray-50">
            <SettingRow label="Maintenance Mode" desc="Temporarily disable all user-facing features while performing system updates.">
               <div className="relative inline-flex items-center cursor-pointer group">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#f42464]"></div>
               </div>
            </SettingRow>

            <SettingRow label="Platform Brand Name" desc="Used in emails, headers, and SMS communications.">
               <input type="text" defaultValue="Diamond Jackpot Lottery" className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 font-bold text-gray-800 outline-none w-full md:w-72 focus:border-[#f42464]/30" />
            </SettingRow>

            <SettingRow label="Admin Force Logout" desc="Requirement for all admins to re-authenticate after a period of inactivity.">
               <select className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 font-bold text-gray-800 outline-none w-full md:w-72 appearance-none">
                  <option>After 1 hour</option>
                  <option>After 8 hours</option>
                  <option>Never</option>
               </select>
            </SettingRow>

            <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security to the administrator accounts.">
               <button className="flex items-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest bg-emerald-50 px-5 py-2.5 rounded-xl">
                  <Lock size={14} /> Enabled
               </button>
            </SettingRow>

            <SettingRow label="Primary Currency Locale" desc="Define the regional currency format and symbol used platform-wide.">
               <div className="flex bg-gray-50 rounded-xl border border-gray-100 p-1">
                  <button className="px-6 py-2 bg-white rounded-lg shadow-sm text-[10px] font-black uppercase text-gray-800">INR (₹)</button>
                  <button className="px-6 py-2 text-[10px] font-black uppercase text-gray-400">USD ($)</button>
               </div>
            </SettingRow>
         </div>

         <div className="mt-12 pt-8 border-t border-gray-50 flex gap-4">
            <button className="px-10 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:scale-[1.02] transition-all">Save All Changes</button>
            <button className="px-10 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Restore Defaults</button>
         </div>
      </div>
    </div>
  );
};

export default AdminSettings;
