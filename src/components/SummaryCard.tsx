// SummaryCard.tsx
'use client';

import { MiniTrendChart } from './MiniTrendChart';

type SummaryCardProps = {
    icon: string;
    label: string;
    value: number | string;
    chartData?: { date: string; value: number }[];
    color?: string;
  };
  
export const SummaryCard = ({ icon, label, value, chartData, color = "blue" }: SummaryCardProps) => (
    <div className="bg-white rounded-xl shadow p-4 w-full">
      <div className="flex items-center gap-2 text-gray-700 mb-2">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold tabular-nums text-gray-900">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
  
      {chartData && (
        <MiniTrendChart data={chartData} color={color} />
      )}
    </div>
);
  