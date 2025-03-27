"use client";

interface WelcomeSectionProps {
  hasProfile: boolean;
  children: React.ReactNode;
}

export default function WelcomeSection({ hasProfile, children }: WelcomeSectionProps) {
  return (
    <div className={`${!hasProfile ? 'h-[80vh] flex flex-col justify-center' : ''}`}>
      {!hasProfile && (
        <h1 className="text-center mb-8 text-xl text-gray-700 max-w-2xl mx-auto">
          Welcome to <span className="font-bold">bskyStats.me</span>
          <br />
          A free tool for analyzing Bluesky posts and engagement for public accounts.
        </h1>
      )}
      {children}
    </div>
  );
} 