"use client";
import PostCard from "./PostCard";
import type { Post } from "../types";

interface TopPostsProps {
  posts: Post[];
}

export default function TopPosts({ posts }: TopPostsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Top Posts</h2>
      <div className="relative">
        <div className="overflow-x-auto pb-4 hide-scrollbar">
          <div className="flex gap-4">
            {posts
              .sort(
                (a, b) =>
                  b.likes +
                  b.reposts +
                  b.replies -
                  (a.likes + a.reposts + a.replies)
              )
              .slice(0, 10)
              .map((post) => (
                <div
                  key={post.createdAt}
                  className="w-[400px] flex-shrink-0"
                >
                  <PostCard {...post} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}