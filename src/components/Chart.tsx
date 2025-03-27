"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { EngagementBucket } from "../types";

interface ChartProps {
  chartData: EngagementBucket[];
  showTotal: boolean;
  showLikes: boolean;
  showReposts: boolean;
  showReplies: boolean;
  setShowTotal: (show: boolean) => void;
  setShowLikes: (show: boolean) => void;
  setShowReposts: (show: boolean) => void;
  setShowReplies: (show: boolean) => void;
}

export default function Chart({
  chartData,
  showTotal,
  showLikes,
  showReposts,
  showReplies,
  setShowTotal,
  setShowLikes,
  setShowReposts,
  setShowReplies,
}: ChartProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2">
        📈 Daily Engagement
      </h2>

      {/* Chart Controls */}
      <div className="mb-4 flex flex-wrap gap-2 text-sm">
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showTotal}
            onChange={() => setShowTotal(!showTotal)}
          />
          ⭐ Total
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showLikes}
            onChange={() => setShowLikes(!showLikes)}
          />
          ❤️ Likes
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showReposts}
            onChange={() => setShowReposts(!showReposts)}
          />
          🔁 Reposts
        </label>
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={showReplies}
            onChange={() => setShowReplies(!showReplies)}
          />
          💬 Replies
        </label>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={(dateStr) => {
              const date = new Date(dateStr);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <YAxis
            tickFormatter={(value) => {
              if (value >= 1_000_000)
                return `${(value / 1_000_000).toFixed(1)}M`;
              if (value >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
              return value;
            }}
          />
          <Tooltip />
          <Legend />
          {showTotal && (
            <Line
              type="monotone"
              dataKey="total"
              stroke="#6366f1"
              name="Total"
              strokeWidth={2}
            />
          )}
          {showLikes && (
            <Line
              type="monotone"
              dataKey="likes"
              stroke="#ef4444"
              name="Likes"
              strokeWidth={2}
            />
          )}
          {showReposts && (
            <Line
              type="monotone"
              dataKey="reposts"
              stroke="#3b82f6"
              name="Reposts"
              strokeWidth={2}
            />
          )}
          {showReplies && (
            <Line
              type="monotone"
              dataKey="replies"
              stroke="#10b981"
              name="Replies"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 