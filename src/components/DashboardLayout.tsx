import React from 'react';
import { LayoutDashboard, Settings, UserCircle, PieChart } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-900 text-slate-50">
      {/* Sidebar */}
      <aside className="w-64 hidden md:flex flex-col bg-slate-800/50 backdrop-blur-md border-r border-slate-700/50">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent flex justify-start items-center gap-2">
            <PieChart className="text-teal-400" />
            Portfolio
          </h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-100 bg-indigo-500/10 rounded-xl border border-indigo-500/20 transition-all">
            <LayoutDashboard size={20} className="text-indigo-400" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 rounded-xl transition-all">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </a>
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-3 px-4 py-2 text-slate-300">
            <UserCircle size={24} />
            <div className="flex flex-col">
              <span className="text-sm font-medium">Investor</span>
              <span className="text-xs text-slate-500">Pro Account</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto w-full">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-slate-800/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
          <h1 className="text-xl font-bold bg-gradient-to-r from-teal-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
             <PieChart className="text-teal-400" size={20} />
             Portfolio
          </h1>
          <UserCircle size={24} className="text-slate-300" />
        </header>
        
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
}
