'use client';

import { useState } from 'react';
import PostCard from '../components/PostCard';
import type { Post } from '../types';
import { groupPostsByDay } from '../lib/stats';
import StatRow from '../components/StatRow';
import { GroupedPostData } from '../types';

import {
  getDailyEngagementData,
  getDailyLikesData,
  getDailyRepostsData,
} from '@/lib/stats';
import { SummaryCard } from '../components/SummaryCard';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const calculateChange = (current: number[], previous: number[]) => {
  const currentAvg = current.length ? current.reduce((a, b) => a + b, 0) / current.length : 0;
  const previousAvg = previous.length ? previous.reduce((a, b) => a + b, 0) / previous.length : 0;
  
  if (!previousAvg) return null;
  return ((currentAvg - previousAvg) / previousAvg) * 100;
};

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

  const groupedData = groupPostsByDay(posts, daysBack);
  const dailyLikesData = getDailyLikesData(groupedData);
  const dailyRepostsData = getDailyRepostsData(groupedData);
  const dailyEngagementData = getDailyEngagementData(groupedData);

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
      setHandle(normalizedHandle);
  
      const res = await fetch(`/api/analyze?handle=${encodeURIComponent(normalizedHandle)}`);
      const json = await res.json();
  
      if (!res.ok) {
        // For invalid handles and not found users
        if (res.status === 400 && json.error?.includes('not found')) {
          setError("Couldn't find that user. Please try again.");
        }
        // For malformed handles
        else if (res.status === 400 && json.error?.includes('invalid handle')) {
          setError("That doesn't look like a valid handle. Please try again.");
        }
        // For other 400 errors
        else if (res.status === 400) {
          setError("Something's wrong with that handle. Please try again.");
        }
        // For all other errors
        else {
          setError('Something went wrong. Please try again.');
        }
        setPosts([]);
        setProfile(null);
        return;
      }
  
      setPosts(json.posts);
      setProfile(json.profile);
    } catch (err) {
      setError('Something went wrong.');
      setPosts([]);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on selected timeframe
  const filteredPosts = posts.filter(post => {
    if (daysBack === 0) return true; // "All Time"
    const postDate = new Date(post.createdAt);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysBack);
    return postDate >= cutoffDate;
  });

  // Update stats calculations to use filteredPosts
  const totalLikes = filteredPosts.reduce((sum, p) => sum + p.likes, 0);
  const totalReposts = filteredPosts.reduce((sum, p) => sum + p.reposts, 0);
  const totalReplies = filteredPosts.reduce((sum, p) => sum + p.replies, 0);

  const avgEngagement = filteredPosts.length > 0
    ? ((totalLikes + totalReposts + totalReplies) / filteredPosts.length).toFixed(1)
    : '0';

  const avgLikes = filteredPosts.length > 0 ? (totalLikes / filteredPosts.length).toFixed(1) : '0';
  const avgReposts = filteredPosts.length > 0 ? (totalReposts / filteredPosts.length).toFixed(1) : '0';
  const avgReplies = filteredPosts.length > 0 ? (totalReplies / filteredPosts.length).toFixed(1) : '0';

  // Update getTop to use filteredPosts
  const getTop = (key: keyof Post) =>
    filteredPosts.reduce((top, post) => (post[key] > top[key] ? post : top), filteredPosts[0]);

  //Check if data is loaded
  const dataLoaded = profile && posts.length > 0;

  const getChangePercentages = () => {
    if (daysBack === 0) return { engagement: null, likes: null, reposts: null };

    const now = new Date();
    const cutoff = new Date();
    cutoff.setDate(now.getDate() - daysBack);
    const midpoint = new Date(cutoff.getTime() + (now.getTime() - cutoff.getTime()) / 2);

    const recentPosts = filteredPosts.filter(p => new Date(p.createdAt) >= midpoint);
    const olderPosts = filteredPosts.filter(p => new Date(p.createdAt) < midpoint && new Date(p.createdAt) >= cutoff);

    return {
      engagement: calculateChange(
        recentPosts.map(p => p.likes + p.reposts + p.replies),
        olderPosts.map(p => p.likes + p.reposts + p.replies)
      ),
      likes: calculateChange(
        recentPosts.map(p => p.likes),
        olderPosts.map(p => p.likes)
      ),
      reposts: calculateChange(
        recentPosts.map(p => p.reposts),
        olderPosts.map(p => p.reposts)
      )
    };
  };

  const changes = getChangePercentages();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow p-4">
        <div className="flex justify-center">
          <img 
            src="/logo_transparent.png" 
            alt="Bluesky Post Analytics" 
            className="h-15"
          />
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Input section */}
        <p className="text-gray-600 mb-2">
          Enter any Bluesky handle to view engagement metrics. Username only is fine, the site will
          auto-complete the handle.
        </p>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            fetchAnalytics();
          }}
          className="flex gap-2 items-center mb-6"
        >
          <input
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="e.g. 'mcuban'"
            className="flex-grow border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Get Analytics"}
          </button>
        </form>

        {/* Error message */}
        {error && <p className="text-gray-900 font-semibold">{error}</p>}

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
          <div>
            {/* Timeframe Selector */}
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
              <SummaryCard
                icon="⭐"
                label="Total Engagement"
                value={totalLikes + totalReposts + totalReplies}
                chartData={dailyEngagementData}
                color="purple"
                change={changes.engagement}
              />
              <SummaryCard
                icon="❤️"
                label="Avg Likes / Post"
                value={avgLikes}
                chartData={dailyLikesData}
                color="red"
                change={changes.likes}
              />
              <SummaryCard
                icon="🔁"
                label="Avg Reposts / Post"
                value={avgReposts}
                chartData={dailyRepostsData}
                color="blue"
                change={changes.reposts}
              />
            </div>

            {/* Stats Block */}
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
                      value={posts.length}
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
          </div>
        )}

        {/* Chart Section */}
        {dataLoaded && (
          <div className="space-y-4">
            {/* Chart Controls */}
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

            {/* Top Posts Section */}
            {posts.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Top Posts</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <PostCard {...getTop("likes")} label="Most Liked" />
                  <PostCard {...getTop("reposts")} label="Most Reposted" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}


