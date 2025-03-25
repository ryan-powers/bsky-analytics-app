import { NextRequest } from 'next/server';
import { fetchUserData } from '@/lib/atproto';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const handleRaw = searchParams.get('handle');
  if (!handleRaw) {
    return new Response(JSON.stringify({ error: 'Missing handle' }), { status: 400 });
  }

  const handle = handleRaw.trim().replace(/^@/, '');

  try {
    const { profile, posts } = await fetchUserData(handle);
    return new Response(JSON.stringify({ profile, posts }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to fetch data from Bluesky' }), { status: 500 });
  }
}

