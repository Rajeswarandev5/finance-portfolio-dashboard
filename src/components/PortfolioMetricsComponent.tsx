import React from 'react';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Wallet, PieChart } from 'lucide-react';

export default function PortfolioMetricsComponent({ totalInvestment, totalPresentValue, totalGainLoss, totalGainLossPercentage }: { totalInvestment: number, totalPresentValue: number, totalGainLoss: number, totalGainLossPercentage: number }) {
  const isPositive = totalGainLoss >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start">
          <p className="text-slate-400 text-sm font-medium">Total Investment</p>
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Wallet size={20} className="text-indigo-400" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">
          {formatCurrency(totalInvestment)}
        </h2>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start">
          <p className="text-slate-400 text-sm font-medium">Present Value</p>
          <div className="p-2 bg-teal-500/10 rounded-lg">
            <PieChart size={20} className="text-teal-400" />
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-2">
          {formatCurrency(totalPresentValue)}
        </h2>
      </div>

      <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02]">
        <div className="flex justify-between items-start">
           <p className="text-slate-400 text-sm font-medium">Total Gain / Loss</p>
           <div className={cn("p-2 rounded-lg", isPositive ? "bg-emerald-500/10" : "bg-rose-500/10")}>
             {isPositive ? <TrendingUp size={20} className="text-emerald-400" /> : <TrendingDown size={20} className="text-rose-400" />}
           </div>
        </div>
        <div className="flex items-end gap-3 mt-2">
          <h2 className={cn("text-2xl md:text-3xl font-bold", isPositive ? "text-emerald-400" : "text-rose-400")}>
            {formatCurrency(totalGainLoss)}
          </h2>
          <span className={cn("text-sm font-medium mb-1", isPositive ? "text-emerald-400/80" : "text-rose-400/80")}>
            {isPositive ? '+' : ''}{formatPercentage(totalGainLossPercentage)}
          </span>
        </div>
      </div>
    </div>
  );
}
