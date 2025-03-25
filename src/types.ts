export type Post = {
    text: string;
    likes: number;
    reposts: number;
    replies: number;
    createdAt: string;
    author: {
      name: string;
      handle: string;
      avatar?: string | null;
    };
  };

  export type EngagementBucket = {
    date: string; // YYYY-MM-DD
    likes: number;
    reposts: number;
    replies: number;
    total: number;
  };
  