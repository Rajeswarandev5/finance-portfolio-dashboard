import axios from 'axios';
import { PortfolioData } from '@/types/portfolio';

const API_BASE_URL = 'http://localhost:5000';

export const checkHealth = async (): Promise<boolean> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/health`);
    return res.data?.status === 'ok';
  } catch (error) {
    console.error('API Health check failed:', error);
    return false;
  }
};

export const fetchPortfolioData = async (): Promise<PortfolioData> => {
  try {
    const response = await axios.get<PortfolioData>(`${API_BASE_URL}/api/portfolio`);
    return response.data;
  } catch (error) {
    console.error('Error fetching REST portfolio data:', error);
    throw new Error('Failed to fetch portfolio data');
  }
};
