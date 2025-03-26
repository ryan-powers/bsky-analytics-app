'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

type MiniTrendChartProps = {
  data: { date: string; value: number }[];
  color?: string;
};

export const MiniTrendChart = ({ data, color = 'blue' }: MiniTrendChartProps) => {
  return (
    <div className="h-16 mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={colorMap[color]}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const colorMap: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#8b5cf6',
  gray: '#6b7280',
  orange: '#f97316',
};
