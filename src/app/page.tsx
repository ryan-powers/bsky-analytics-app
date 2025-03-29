"use client";

import { useState, useEffect } from "react";
import type { Post } from "../types";
import { groupPostsByDay } from "../lib/stats";
import { suggestedAccounts, timeOptions } from "../lib/utils";
import {
  getDailyEngagementData,
  getDailyLikesData,
  getDailyRepostsData,
  getDailyPostCounts,
} from "@/lib/stats";
import { SummaryCard } from "../components/SummaryCard";
import TopPosts from "../components/TopPosts";
import Footer from "../components/Footer";
import Chart from "../components/Chart";
import StatsBlock from "../components/StatsBlock";
import TimeFrameSelector from "../components/TimeFrameSelector";
import ProfileSection from "../components/ProfileSection";
import TestAccounts from "../components/TestAccounts";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import {
  INITIAL_DAYS_BACK,
  INITIAL_CHART_STATE,
} from "../lib/constants";
import {
  getFilteredPosts,
  calculateStats,
  getChangePercentages,
} from "../lib/analytics";
import { fetchAnalytics } from "../lib/api";
import WelcomeSection from "../components/WelcomeSection";
import PostFrequencyChart from "../components/PostFrequencyChart";


export default function Home() {
  const [handle, setHandle] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [daysBack, setDaysBack] = useState(INITIAL_DAYS_BACK);
  const [showTotal, setShowTotal] = useState(INITIAL_CHART_STATE.showTotal);
  const [showLikes, setShowLikes] = useState(INITIAL_CHART_STATE.showLikes);
  const [showReposts, setShowReposts] = useState(INITIAL_CHART_STATE.showReposts);
  const [showReplies, setShowReplies] = useState(INITIAL_CHART_STATE.showReplies);
  const chartData = groupPostsByDay(posts, daysBack);
  const [profile, setProfile] = useState<{
    name: string;
    handle: string;
    avatar: string;
    description?: string;
    followersCount: number;
  } | null>(null);

  const groupedData = groupPostsByDay(posts, daysBack);
  const dailyLikesData = getDailyLikesData(groupedData);
  const dailyRepostsData = getDailyRepostsData(groupedData);
  const dailyEngagementData = getDailyEngagementData(groupedData);
  const postFrequencyData = getDailyPostCounts(posts, daysBack);

  const handleFetchAnalytics = (customHandle?: string) => {
    fetchAnalytics(customHandle || handle, {
      setLoading,
      setError,
      setPosts,
      setProfile,
      setHandle,
    });
  };

  const filteredPosts = getFilteredPosts(posts, daysBack);
  const stats = calculateStats(filteredPosts);
  const changes = getChangePercentages(posts, filteredPosts, daysBack);

  //Check if data is loaded
  const dataLoaded = profile && posts.length > 0;

  // Add this useEffect to clear the search bar after successful data load
  useEffect(() => {
    // Check if data was successfully loaded
    if (profile && posts.length > 0 && !loading && !error) {
      // Clear the search bar with a small delay to ensure UI updates properly
      const timer = setTimeout(() => {
        setHandle("");
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [profile, posts.length, loading, error]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      {/* Main Content */}
      <div className="flex-grow">
      <div className="max-w-5xl mx-auto px-6 py-4">
          <WelcomeSection hasProfile={!!profile}>
            {/* Input section with form */}
            <SearchBar
              handle={handle}
              setHandle={setHandle}
              onSearch={handleFetchAnalytics}
              loading={loading}
              error={error}
              placeholder={dataLoaded ? "@" : "@user.bsky.social"}
            />

            {/* Suggested accounts - only visible when no profile is loaded */}
            {!profile && (
              <TestAccounts
                accounts={suggestedAccounts}
                onSelect={handleFetchAnalytics}
              />
            )}
          </WelcomeSection>

          {/* Profile section */}
          {profile && (
            <ProfileSection
              name={profile.name}
              handle={profile.handle}
              avatar={profile.avatar}
              description={profile.description}
              followersCount={profile.followersCount}
            />
          )}

          {/* Stats Summary Section */}
          {posts.length > 0 && (
            <div>
              {/* Timeframe Selector */}
              <TimeFrameSelector
                timeOptions={timeOptions}
                daysBack={daysBack}
                setDaysBack={setDaysBack}
              />

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
                <SummaryCard
                  icon="⭐"
                  label="Total Engagement"
                  value={stats.totalLikes + stats.totalReposts + stats.totalReplies}
                  chartData={dailyEngagementData}
                  color="purple"
                  change={changes.engagement}
                />
                <SummaryCard
                  icon="❤️"
                  label="Avg Likes / Post"
                  value={stats.avgLikes}
                  chartData={dailyLikesData}
                  color="red"
                  change={changes.likes}
                />
                <SummaryCard
                  icon="🔁"
                  label="Avg Reposts / Post"
                  value={stats.avgReposts}
                  chartData={dailyRepostsData}
                  color="blue"
                  change={changes.reposts}
                />
              </div>

              {/* Stats Block */}
              <StatsBlock
                posts={posts}
                filteredPosts={filteredPosts}
                totalLikes={stats.totalLikes}
                totalReposts={stats.totalReposts}
                totalReplies={stats.totalReplies}
                avgEngagement={stats.avgEngagement}
                avgLikes={stats.avgLikes}
                avgReposts={stats.avgReposts}
                avgReplies={stats.avgReplies}
              />
            </div>
          )}

          {/* Chart Section */}
          {dataLoaded && (
            <Chart
              chartData={chartData}
              showTotal={showTotal}
              showLikes={showLikes}
              showReposts={showReposts}
              showReplies={showReplies}
              setShowTotal={setShowTotal}
              setShowLikes={setShowLikes}
              setShowReposts={setShowReposts}
              setShowReplies={setShowReplies}
            />
          )}

          {/* Post Frequency Chart */}
          {dataLoaded && (
            <PostFrequencyChart data={postFrequencyData} />
          )}

          <br style={{ marginTop: '20px' }} />

          {/* Top Posts */}
          {posts.length > 0 && (
            <TopPosts posts={filteredPosts} />
          )}
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
