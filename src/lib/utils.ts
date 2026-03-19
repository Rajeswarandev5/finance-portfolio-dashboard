import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merges Tailwind classes safely

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Formats a number as INR Currency

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(value);
}

// Formats a number as a Percentage

export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
}
//  Formats a large number to compact notation (e.g. 1.2K, 5M)

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1,
  }).format(value);
}
