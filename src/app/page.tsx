'use client';

import { useState } from 'react';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { groupPostsByDay } from '../lib/stats';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';


export default function Home() {
  const [handle, setHandle] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [daysBack, setDaysBack] = useState(30);
  const chartData = groupPostsByDay(posts, daysBack);
  const [profile, setProfile] = useState<{
    name: string;
    handle: string;
    avatar: string;
    description?: string;
  } | null>(null);

  //Toggle Visibility of chart elements
  const [showTotal, setShowTotal] = useState(true);
  const [showLikes, setShowLikes] = useState(true);
  const [showReposts, setShowReposts] = useState(true);
  const [showReplies, setShowReplies] = useState(true);

  const timeOptions = [
    { label: 'Last 30 days', value: 30 },
    { label: 'Last 60 days', value: 60 },
    { label: 'Last 90 days', value: 90 },
    { label: 'Last 180 days', value: 180 },
    { label: 'Last 365 days', value: 365 },
    { label: 'All Time', value: 0 },
  ];

  const normalizeHandle = (input: string): string => {
    let handle = input.trim().replace(/^@/, '').toLowerCase();
  
    if (!handle.includes('.')) {
      handle += '.bsky.social';
    }
  
    return handle;
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
  
    try {
      const rawInput = handle.trim();
      const normalizedHandle = normalizeHandle(rawInput);
      setHandle(normalizedHandle); // optional: reflect it in the input box
  
      const res = await fetch(`/api/analyze?handle=${encodeURIComponent(normalizedHandle)}`);
      const json = await res.json();
  
      if (json.error) {
        setError(json.error);
        setPosts([]);
        setProfile(null);
      } else {
        setPosts(json.posts);
        setProfile(json.profile);
      }
    } catch {
      setError('Something went wrong.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const getTop = (key: keyof Post) =>
    posts.reduce((top, post) => (post[key] > top[key] ? post : top), posts[0]);

  const totalLikes = posts.reduce((sum, p) => sum + p.likes, 0);
  const totalReposts = posts.reduce((sum, p) => sum + p.reposts, 0);
  const totalReplies = posts.reduce((sum, p) => sum + p.replies, 0);

  const avgEngagement = posts.length > 0
    ? ((totalLikes + totalReposts + totalReplies) / posts.length).toFixed(1)
    : '0';

  const avgLikes = posts.length > 0 ? (totalLikes / posts.length).toFixed(1) : '0';
  const avgReposts = posts.length > 0 ? (totalReposts / posts.length).toFixed(1) : '0';
  const avgReplies = posts.length > 0 ? (totalReplies / posts.length).toFixed(1) : '0';

  //Check if data is loaded
  const dataLoaded = profile && posts.length > 0;


  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <h1 className="text-2xl font-bold text-center">
          🦋 Bluesky Post Analytics
        </h1>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Input section */}
        <p className="text-gray-600 mb-2">
          Enter any Bluesky handle. Username only is fine, the site will auto-complete the rest.
        </p>
        <div className="flex gap-2 items-center mb-6">
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. 'mcuban'"
            className="flex-grow border p-2 rounded"
          />
          <button
            onClick={fetchAnalytics}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Analytics"}
          </button>
        </div>

        {/* Error message */}
        {error && <p className="text-red-600">{error}</p>}

            
        {profile && (
          <div className="flex items-start gap-4 mb-6">
            {profile.avatar && (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-xl font-bold">{profile.name}</h2>
              <p className="text-gray-500">@{profile.handle}</p>
              {profile.description && (
                <p className="mt-1 text-gray-700 whitespace-pre-line">
                  {profile.description}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Post Stats Summary */}
        {posts.length > 0 && (
          <div className="mb-6 bg-white p-6 rounded shadow-sm border">
            <h2 className="text-lg font-bold mb-4">📊 Post Stats</h2>

            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-800">
              {/* Totals */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Total Engagement
                </h3>
                <ul className="space-y-1">
                  <li>
                    📦 Posts analyzed: <strong>{posts.length}</strong>
                  </li>
                  <li>
                    ❤️ Total likes:{" "}
                    <strong>{totalLikes.toLocaleString()}</strong>
                  </li>
                  <li>
                    🔁 Total reposts:{" "}
                    <strong>{totalReposts.toLocaleString()}</strong>
                  </li>
                  <li>
                    💬 Total replies:{" "}
                    <strong>{totalReplies.toLocaleString()}</strong>
                  </li>
                </ul>
              </div>

              {/* Averages */}
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Average Per Post
                </h3>
                <ul className="space-y-1">
                  <li>
                    ⭐ All Engagement: <strong>{avgEngagement}</strong>
                  </li>
                  <li>
                    ❤️ Likes: <strong>{avgLikes}</strong>
                  </li>
                  <li>
                    🔁 Reposts: <strong>{avgReposts}</strong>
                  </li>
                  <li>
                    💬 Replies: <strong>{avgReplies}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/*Timeframe Selector goes here */}
        {dataLoaded && (
          <div className="space-y-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {timeOptions.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setDaysBack(value)}
                  className={`px-3 py-1 rounded border ${
                    daysBack === value ? "bg-blue-500 text-white" : "bg-white"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

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

            {/* Top posts */}
            {posts.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Top Posts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <PostCard {...getTop("likes")} label="Most Liked" />
                  <PostCard {...getTop("reposts")} label="Most Reposted" />
                  <PostCard {...getTop("replies")} label="Most Replied" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


