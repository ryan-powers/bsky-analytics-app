// SummaryCard.tsx
'use client';

import { MiniTrendChart } from './MiniTrendChart';

interface SummaryCardProps {
  icon: string;
  label: string;
  value: number | string;
  chartData: { date: string; value: number }[];
  color: string;
  change?: number | null;
}

export function SummaryCard({ icon, label, value, chartData, color, change }: SummaryCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="font-medium">{label}</span>
        </div>
        {change !== null && change !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${
            change > 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change > 0 ? '↑' : '↓'}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold mb-4">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
  
      {chartData && (
        <MiniTrendChart data={chartData} color={color} />
      )}
    </div>
  );
}
  