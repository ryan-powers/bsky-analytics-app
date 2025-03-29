"use client";
import PostCard from "./PostCard";
import type { Post } from "../types";

interface TopPostsProps {
  id: string;
  posts: Post[];
}

export default function TopPosts({ posts }: TopPostsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">🏆 Top Posts</h2>
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
              .map((post) => {
                if (!post.author.handle || !post.id) {
                  return null; // Skip rendering if data is missing
                }
                return (
                  <a
                    key={post.createdAt}
                    href={`https://bsky.app/profile/${post.author.handle}/post/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-[400px] flex-shrink-0"
                  >
                    <PostCard {...post} />
                  </a>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}