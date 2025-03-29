import type { Post } from '../types';
import type { EngagementBucket } from '../types';

// Get daily engagement data
export function groupPostsByDay(posts: Post[], daysBack: number): EngagementBucket[] {
    const now = new Date();
    const startDate = new Date();
    startDate.setDate(now.getDate() - daysBack);
  
    const buckets: Record<string, EngagementBucket> = {};
  
    posts.forEach((post) => {
      // Make sure createdAt exists and is a valid date
      if (!post.createdAt) return;
  
      const createdAt = new Date(post.createdAt);
      if (isNaN(createdAt.getTime())) return;
      if (daysBack > 0 && createdAt < startDate) return;
  
      const dateKey = createdAt.toISOString().split('T')[0]; // e.g. "2025-03-24"
  
      if (!buckets[dateKey]) {
        buckets[dateKey] = {
          date: dateKey,
          likes: 0,
          reposts: 0,
          replies: 0,
          total: 0,
        };
      }
  
      buckets[dateKey].likes += post.likes;
      buckets[dateKey].reposts += post.reposts;
      buckets[dateKey].replies += post.replies;
      buckets[dateKey].total += post.likes + post.reposts + post.replies;
    });
  
    return Object.values(buckets).sort((a, b) => a.date.localeCompare(b.date));
  }



export const getDailyEngagementData = (buckets: EngagementBucket[]) => 
    buckets.map(b => ({ date: b.date, value: b.total }));
  
export const getDailyLikesData = (buckets: EngagementBucket[]) => 
    buckets.map(b => ({ date: b.date, value: b.likes }));
  
export const getDailyRepostsData = (buckets: EngagementBucket[]) => 
    buckets.map(b => ({ date: b.date, value: b.reposts }));


// Get daily post counts
export function getDailyPostCounts(posts: Post[], daysBack: number) {
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - daysBack);

  const dateMap: Record<string, number> = {};

  posts.forEach((post) => {
    const date = new Date(post.createdAt);
    if (daysBack > 0 && date < startDate) return;

    const key = date.toISOString().split('T')[0]; // "YYYY-MM-DD"
    if (!dateMap[key]) {
      dateMap[key] = 0;
    }
    dateMap[key]++;
  });

  return Object.entries(dateMap)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
  