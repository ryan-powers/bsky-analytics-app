import type { Post } from "../types";
import { calculateChange } from "./utils";

export const getFilteredPosts = (posts: Post[], daysBack: number) => {
  if (daysBack === 0) return posts;
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysBack);
  return posts.filter((post) => new Date(post.createdAt) >= cutoffDate);
};

export const calculateStats = (filteredPosts: Post[]) => {
  const totalLikes = filteredPosts.reduce((sum, p) => sum + p.likes, 0);
  const totalReposts = filteredPosts.reduce((sum, p) => sum + p.reposts, 0);
  const totalReplies = filteredPosts.reduce((sum, p) => sum + p.replies, 0);

  const formatAverage = (total: number) =>
    filteredPosts.length > 0
      ? (total / filteredPosts.length).toLocaleString("en-US", {
          maximumFractionDigits: 1,
        })
      : "0";

  return {
    totalLikes,
    totalReposts,
    totalReplies,
    avgEngagement: formatAverage(totalLikes + totalReposts + totalReplies),
    avgLikes: formatAverage(totalLikes),
    avgReposts: formatAverage(totalReposts),
    avgReplies: formatAverage(totalReplies),
  };
};

export const getChangePercentages = (posts: Post[], filteredPosts: Post[], daysBack: number) => {
  if (daysBack === 0) return { engagement: null, likes: null, reposts: null };

  const now = new Date();
  const currentPeriodEnd = now;
  const currentPeriodStart = new Date(now);
  currentPeriodStart.setDate(now.getDate() - daysBack);

  const previousPeriodEnd = new Date(currentPeriodStart);
  const previousPeriodStart = new Date(previousPeriodEnd);
  previousPeriodStart.setDate(previousPeriodEnd.getDate() - daysBack);

  const currentPosts = filteredPosts.filter((p) => {
    const date = new Date(p.createdAt);
    return date >= currentPeriodStart && date <= currentPeriodEnd;
  });

  const previousPosts = posts.filter((p) => {
    const date = new Date(p.createdAt);
    return date >= previousPeriodStart && date < currentPeriodStart;
  });

  const currentEngagement = currentPosts.map(
    (p) => p.likes + p.reposts + p.replies
  );
  const previousEngagement = previousPosts.map(
    (p) => p.likes + p.reposts + p.replies
  );

  return {
    engagement: calculateChange(currentEngagement, previousEngagement),
    likes: calculateChange(
      currentPosts.map((p) => p.likes),
      previousPosts.map((p) => p.likes)
    ),
    reposts: calculateChange(
      currentPosts.map((p) => p.reposts),
      previousPosts.map((p) => p.reposts)
    ),
  };
}; 