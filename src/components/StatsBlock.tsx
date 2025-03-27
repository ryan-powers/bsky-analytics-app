"use client";

import StatRow from "./StatRow";
import type { Post } from "../types";

interface StatsBlockProps {
  posts: Post[];
  filteredPosts: Post[];
  totalLikes: number;
  totalReposts: number;
  totalReplies: number;
  avgEngagement: string;
  avgLikes: string;
  avgReposts: string;
  avgReplies: string;
}

export default function StatsBlock({
  posts,
  filteredPosts,
  totalLikes,
  totalReposts,
  totalReplies,
  avgEngagement,
  avgLikes,
  avgReposts,
  avgReplies,
}: StatsBlockProps) {
  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow border text-gray-800">
      <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
        📊 Post Stats
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
        {/* Total Engagement */}
        <div>
          <h3 className="text-md font-semibold text-gray-600 mb-2">
            Total Engagement
          </h3>
          <div className="space-y-2 text-sm">
            <StatRow
              icon="📦"
              label="Post Count"
              value={filteredPosts.length}
            />
            <StatRow
              icon="❤️"
              label="Likes"
              value={totalLikes.toLocaleString()}
            />
            <StatRow
              icon="🔁"
              label="Reposts"
              value={totalReposts.toLocaleString()}
            />
            <StatRow
              icon="💬"
              label="Replies"
              value={totalReplies.toLocaleString()}
            />
          </div>
        </div>

        {/* Average Per Post */}
        <div>
          <h3 className="text-md font-semibold text-gray-600 mb-2">
            Average Per Post
          </h3>
          <div className="space-y-2 text-sm">
            <StatRow
              icon="⭐"
              label="All Types"
              value={avgEngagement}
            />
            <StatRow icon="❤️" label="Likes" value={avgLikes} />
            <StatRow icon="🔁" label="Reposts" value={avgReposts} />
            <StatRow icon="💬" label="Replies" value={avgReplies} />
          </div>
        </div>
      </div>
    </div>
  );
} 