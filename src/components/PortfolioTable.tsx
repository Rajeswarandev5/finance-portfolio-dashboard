import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { Stock, SectorSummary } from '@/types/portfolio';
import { formatCurrency, formatPercentage, cn } from '@/lib/utils';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

export default function PortfolioTable({ stocks, sectorSummary, totalPortfolioValue }: { stocks: Stock[], sectorSummary: SectorSummary[], totalPortfolioValue: number }) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Stock>[]>(() => [
    {
      accessorKey: 'symbol',
      header: 'Particulars',
      cell: (info) => <span className="font-semibold text-slate-200">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'sector',
      header: 'Sector',
      cell: (info) => (
        <span className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'exchange',
      header: 'NSE/BSE',
      cell: (info) => (
        <span className="text-xs font-mono text-slate-400">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: 'avgPrice',
      header: 'Purchase Price',
      cell: (info) => formatCurrency(info.getValue() as number),
    },
    {
      accessorKey: 'quantity',
      header: 'Qty',
      cell: (info) => <div className="text-right w-full">{info.getValue() as number}</div>,
    },
    {
      accessorKey: 'investment',
      header: 'Investment',
      cell: (info) => formatCurrency(info.getValue() as number),
    },
    {
      accessorKey: 'portfolioPercentage',
      header: 'Portfolio (%)',
      cell: (info) => <span className="font-medium text-slate-400">{info.getValue() as string}</span>,
    },
    {
      accessorKey: 'cmp',
      header: 'CMP',
      cell: (info) => <span className="font-medium text-slate-100">{formatCurrency(info.getValue() as number)}</span>,
    },
    {
      accessorKey: 'presentValue',
      header: 'Present Value',
      cell: (info) => <span className="font-semibold text-slate-100">{formatCurrency(info.getValue() as number)}</span>,
    },
    {
      accessorKey: 'gainLoss',
      header: 'Gain/Loss',
      cell: (info) => {
        const value = info.getValue() as number;
        const isPositive = value >= 0;
        return (
          <span className={cn("font-bold flex items-center gap-1", isPositive ? "text-emerald-400" : "text-rose-400")}>
            {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            {formatCurrency(Math.abs(value))}
          </span>
        );
      },
    },
    {
      id: 'gainLossPercent',
      header: 'Gain/Loss (%)',
      accessorFn: (row) => {
        return row.investment > 0 ? row.gainLoss / row.investment : 0;
      },
      cell: (info) => {
        const value = info.getValue() as number;
        const isPositive = value >= 0;
        return (
          <span className={cn("font-medium", isPositive ? "text-emerald-400" : "text-rose-400")}>
            {isPositive ? '+' : ''}{formatPercentage(value)}
          </span>
        );
      },
    },
    {
      accessorKey: 'peRatio',
      header: 'P/E (TTM)',
      cell: (info) => <span className="text-slate-400">{info.getValue() as number}</span>,
    },
    {
      accessorKey: 'earnings',
      header: 'Latest Earnings',
      cell: (info) => <span className="text-xs text-slate-400 whitespace-nowrap">{info.getValue() as number}</span>,
    },
  ], [totalPortfolioValue]);

  const table = useReactTable({
    data: stocks,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-xl border border-slate-700/50 overflow-hidden bg-slate-800/40 backdrop-blur-sm shadow-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700/50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id} 
                    className="px-4 py-3 cursor-pointer hover:bg-slate-700/50 transition-colors whitespace-nowrap"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1 cursor-pointer select-none">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {{
                        asc: <ArrowUp size={14} className="text-indigo-400" />,
                        desc: <ArrowDown size={14} className="text-indigo-400" />,
                      }[header.column.getIsSorted() as string] ?? (
                        header.column.getCanSort() ? <ArrowUpDown size={14} className="text-slate-600" /> : null
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {sectorSummary.map(sector => {
               const sectorRows = table.getRowModel().rows.filter(r => r.original.sector === sector.sector);
               const isPos = sector.gainLoss >= 0;
               const glClass = isPos ? "text-emerald-500" : "text-rose-500";
               
               return (
                 <React.Fragment key={sector.sector}>
                   {/* Sector Aggregation Row mimicking Excel */}
                   <tr className="bg-[#dcfce7]/10 border-y border-emerald-900/50 hover:bg-[#dcfce7]/15 transition-colors">
                     <td colSpan={3} className="px-4 py-3 font-bold text-emerald-300">
                       {sector.sector}
                     </td>
                     <td colSpan={2}></td>
                     <td className="px-4 py-3 font-bold text-emerald-100 whitespace-nowrap">
                        {formatCurrency(sector.investment)}
                     </td>
                     <td className="px-4 py-3 font-bold text-emerald-100 whitespace-nowrap">
                        {sector.portfolioPercentage}
                     </td>
                     <td></td>
                     <td className="px-4 py-3 font-bold text-emerald-100 whitespace-nowrap">
                        {formatCurrency(sector.presentValue)}
                     </td>
                     <td className={cn("px-4 py-3 font-bold whitespace-nowrap text-right", glClass)}>
                        {formatCurrency(sector.gainLoss)}
                     </td>
                     <td className={cn("px-4 py-3 font-bold whitespace-nowrap", glClass)}>
                        {sector.investment > 0 ? formatPercentage(sector.gainLoss / sector.investment) : ''}
                     </td>
                     <td colSpan={2}></td>
                   </tr>

                   {/* Leaf Rows for the Sector */}
                   {sectorRows.map(row => {
                     // Adding a full red background for heavily negative rows like in the image
                     const rowGainLoss = row.original.gainLoss;
                     const isHeavyLoss = rowGainLoss < -10000; // threshold for highlighting
                     
                     return (
                       <tr 
                         key={row.id} 
                         className={cn(
                           "border-b transition-colors",
                           isHeavyLoss 
                             ? "bg-rose-600/20 hover:bg-rose-600/30 border-rose-500/30" 
                             : "border-slate-700/30 hover:bg-slate-700/30"
                         )}
                       >
                         {row.getVisibleCells().map(cell => (
                           <td 
                             key={cell.id} 
                             className={cn("px-4 py-3 whitespace-nowrap", isHeavyLoss && "text-rose-100")}
                           >
                             {flexRender(cell.column.columnDef.cell, cell.getContext())}
                           </td>
                         ))}
                       </tr>
                     );
                   })}
                 </React.Fragment>
               );
            })}
            
            {/* Fallback for stocks mapping without a matched sector... just in case */}
            {table.getRowModel().rows.filter(r => !sectorSummary.find(s => s.sector === r.original.sector)).map(row => (
               <tr key={row.id} className="border-b border-slate-700/30 hover:bg-slate-700/30 transition-colors">
                 {row.getVisibleCells().map(cell => (
                   <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                   </td>
                 ))}
               </tr>
            ))}
          </tbody>
        </table>
        {stocks.length === 0 && (
          <div className="p-8 text-center text-slate-400">
            No portfolio data available.
          </div>
        )}
      </div>
    </div>
  );
}
