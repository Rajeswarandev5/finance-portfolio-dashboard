export interface Stock {
  symbol: string;         
  exchange: string;       
  sector: string;         
  quantity: number;       
  avgPrice: number;       
  cmp: number;            
  peRatio: number;        
  earnings: number;       
  investment: number;     
  presentValue: number;   
  gainLoss: number;
  portfolioPercentage: string; 
}

export interface SectorSummary {
  sector: string;
  investment: number;
  presentValue: number;
  gainLoss: number;
  portfolioPercentage: string;
}

export interface PortfolioData {
  totalPortfolioValue: number;
  stocks: Stock[];
  sectorSummary: SectorSummary[];

}

// We will add derived interfaces if we want to adapt it to legacy components seamlessly,
// but it's simpler to just update the components to use the exact backend keys.
