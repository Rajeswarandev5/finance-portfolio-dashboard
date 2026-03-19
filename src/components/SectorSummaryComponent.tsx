import React from 'react';
import { SectorSummary } from '@/types/portfolio';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Layers } from 'lucide-react';

export default function SectorSummaryComponent({ sectors }: { sectors: SectorSummary[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="text-indigo-400" size={20} />
        <h3 className="text-lg font-semibold text-slate-200">Sector Performance</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectors.map((sector) => {
          const isPositive = sector.gainLoss >= 0;
          const sectorGainLossPercentage = sector.investment > 0 ? (sector.gainLoss / sector.investment) : 0;
          return (
            <div key={sector.sector} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 shadow-md hover:bg-slate-800/60 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-slate-300 font-medium">{sector.sector}</h4>
                <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded">{sector.portfolioPercentage}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Inv</span>
                  <span className="text-slate-200">{formatCurrency(sector.investment)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Val</span>
                  <span className="text-slate-200">{formatCurrency(sector.presentValue)}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-700/50 flex justify-between items-center">
                  <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive ? "text-emerald-400" : "text-rose-400")}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{isPositive ? '+' : ''}{formatPercentage(sectorGainLossPercentage)}</span>
                  </div>
                  <span className={cn("text-sm font-semibold", isPositive ? "text-emerald-400" : "text-rose-400")}>
                    {formatCurrency(sector.gainLoss)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
