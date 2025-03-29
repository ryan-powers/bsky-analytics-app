'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface Props {
  data: { date: string; count: number }[];
}

const CustomLabel = ({ viewBox, value }: any) => {
    const { y, width } = viewBox;
    return (
      <text x={width + 65} y={y} fill="gray" fontSize={15} fontWeight="bold" alignmentBaseline="middle">
        {value}
      </text>
    );
};

export default function PostFrequencyChart({ data }: Props) {
  // Calculate average posts per day
  const averagePosts = data.reduce((sum, item) => sum + item.count, 0) / data.length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📅 Post Frequency
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ right: 45 }}>
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) =>
              new Date(dateStr).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => (
              <span style={{ fontWeight: "bold" }}>
                {new Date(label).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="count"
            name="Posts"
            stroke="#6366f1"
            strokeWidth={3}
            clipPath="url(#clip)"
          />
          <ReferenceLine
            y={averagePosts}
            stroke="gray"
            strokeDasharray="3 3"
            label={<CustomLabel value="Avg" />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
