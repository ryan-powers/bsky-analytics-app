import { BskyAgent } from '@atproto/api';

const agent = new BskyAgent({ service: 'https://bsky.social' });

export async function fetchUserData(handle: string) {
    const identifier = process.env.BSKY_HANDLE;
    const password = process.env.BSKY_APP_PASSWORD;
  
    if (!identifier || !password) {
      throw new Error('Missing BSKY_HANDLE or BSKY_APP_PASSWORD in environment');
    }
  
    await agent.login({ identifier, password });
  
    const profile = await agent.getProfile({ actor: handle });
  
    let allPosts = [];
    let cursor: string | undefined = undefined;
  
    while (true) {
      const res = await agent.getAuthorFeed({
        actor: handle,
        limit: 100,
        cursor,
      });
  
      const posts = res.data.feed.filter((item) => {
        const isRepost = item.reason?.$type === 'app.bsky.feed.defs#reasonRepost';
        const isTextPost = item.post && typeof item.post.record.text === 'string';
        return !isRepost && isTextPost;
      });
  
      allPosts.push(...posts);
      if (!res.data.cursor || res.data.feed.length === 0 || allPosts.length > 1000) break;
      cursor = res.data.cursor;
    }
  
    const postData = allPosts.map((item) => ({
      id: item.post.uri.split('/').pop(),
      text: item.post.record.text,
      likes: item.post.likeCount || 0,
      reposts: item.post.repostCount || 0,
      replies: item.post.replyCount || 0,
      createdAt: item.post.record.createdAt || item.post.indexedAt,
      author: {
        name: item.post.author.displayName || item.post.author.handle,
        handle: item.post.author.handle,
        avatar: item.post.author.avatar || null,
      },
    }));
  
    return {
      profile: {
        name: profile.data.displayName,
        handle: profile.data.handle,
        avatar: profile.data.avatar,
        description: profile.data.description,
        followersCount: profile.data.followersCount,
      },
      posts: postData,
    };
  }
  

