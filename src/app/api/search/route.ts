import { NextRequest, NextResponse } from 'next/server';
import BskyAgent from '@atproto/api';

const agent = new BskyAgent({
  service: 'https://bsky.social',
});

export async function GET(req: NextRequest) {
    const query = req.nextUrl.searchParams.get('q');
    if (!query) {
      return new Response(JSON.stringify({ error: 'Missing query' }), { status: 400 });
    }
  
    try {
      await agent.login({
        identifier: process.env.BSKY_HANDLE!,
        password: process.env.BSKY_APP_PASSWORD!,
      });
  
      const result = await agent.app.bsky.actor.searchActors({ term: query });
  
      return new Response(JSON.stringify(result.data), { status: 200 });
    } catch (err) {
      console.error('Search error:', err);
      return new Response(JSON.stringify({ error: 'Search failed' }), { status: 500 });
    }
  }
