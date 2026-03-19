'use client';

import React, { useEffect, useState, useMemo } from 'react';
import io from 'socket.io-client';
import DashboardLayout from '@/components/DashboardLayout';
import PortfolioMetricsComponent from '@/components/PortfolioMetricsComponent';
import SectorSummaryComponent from '@/components/SectorSummaryComponent';
import PortfolioTable from '@/components/PortfolioTable';
import { PortfolioData } from '@/types/portfolio';
import { fetchPortfolioData, checkHealth } from '@/services/portfolioService';
import { Loader2, RefreshCcw, AlertTriangle, WifiOff } from 'lucide-react';

// const SOCKET_URL = 'http://localhost:5000';
// const SOCKET_URL = 'https://finance-portfolio-server.vercel.app';
const SOCKET_URL = 'https://finance-portfolio-server-production.up.railway.app';

export default function PortfolioDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const isOnline = await checkHealth();
      if (!isOnline) {
        setIsError(true);
        setErrorMessage('Backend server is unreachable.');
        setIsLoading(false);
        return;
      }

      const newData = await fetchPortfolioData();
      setData(newData);
      setLastUpdated(new Date());
      setIsError(false);
      setErrorMessage('');
    } catch (err: any) {
      console.error(err);
      setIsError(true);
      setErrorMessage(err.message || 'Failed to fetch portfolio data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial Load via REST
    loadData();

    // Setup Socket.IO connection
    const socket = io(SOCKET_URL, {
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Listen for live updates
    socket.on('portfolioUpdate', (portfolioData: PortfolioData) => {
      setData(portfolioData);
      setLastUpdated(new Date());
      setIsError(false);
      setErrorMessage('');
    });

    // Listen for errors
    socket.on('portfolioError', (errorData: { error: string }) => {
      console.error('API Error:', errorData.error);
      setIsError(true);
      setErrorMessage(errorData.error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Compute total aggregates for the Metrics Component
  const { totalInvestment, totalGainLoss, totalGainLossPercentage } = useMemo(() => {
    if (!data || !data.stocks) return { totalInvestment: 0, totalGainLoss: 0, totalGainLossPercentage: 0 };
    
    let inv = 0;
    let gl = 0;
    
    data.stocks.forEach(stock => {
      inv += stock.investment;
      gl += stock.gainLoss;
    });

    const percent = inv > 0 ? (gl / inv) * 100 : 0;
    
    return {
      totalInvestment: inv,
      totalGainLoss: gl,
      totalGainLossPercentage: percent
    };
  }, [data]);

  if (isLoading && !data) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
          <p className="text-slate-400 animate-pulse">Connecting to Live Trading Engine...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (isError && !data) {
    return (
      <DashboardLayout>
        <div className="flex h-[60vh] items-center justify-center flex-col gap-4 text-center">
          <AlertTriangle className="text-rose-500" size={48} />
          <h2 className="text-xl font-semibold text-slate-100">Failed to load portfolio</h2>
          <p className="text-slate-400 max-w-md">{errorMessage || 'Ensure the backend server at port 4500 is running.'}</p>
          <button 
            onClick={() => loadData()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) return null;

  return (
    <DashboardLayout>
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
            Portfolio Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time performance tracking and analytics</p>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-slate-400 bg-slate-800/40 px-4 py-2 rounded-lg border border-slate-700/50">
           {isConnected ? (
             <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
           ) : (
             <WifiOff size={16} className="text-rose-500" />
           )}
           <span>{isConnected ? 'Live WebSocket' : 'Disconnected'}</span>
           {lastUpdated && (
             <span className="ml-2 border-l border-slate-600 pl-2">
               {lastUpdated.toLocaleTimeString()}
             </span>
           )}
        </div>
      </div>

      {isError && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center justify-between">
          <span className="text-sm">{errorMessage}</span>
          <button onClick={() => setIsError(false)} className="text-rose-400 hover:text-rose-300">
            Dismiss
          </button>
        </div>
      )}

      {/* Top Level Metrics */}
      <PortfolioMetricsComponent 
        totalInvestment={totalInvestment}
        totalPresentValue={data.totalPortfolioValue}
        totalGainLoss={totalGainLoss}
        totalGainLossPercentage={totalGainLossPercentage}
      />

      {/* Main Grid: Sectors & Table */}
      <div className="space-y-6">
        <section>
          <SectorSummaryComponent sectors={data.sectorSummary || []} />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-slate-200">Asset Holdings</h3>
          </div>
          <PortfolioTable 
            stocks={data.stocks || []} 
            sectorSummary={data.sectorSummary || []}
            totalPortfolioValue={data.totalPortfolioValue} 
          />
        </section>
      </div>

    </DashboardLayout>
  );
}
