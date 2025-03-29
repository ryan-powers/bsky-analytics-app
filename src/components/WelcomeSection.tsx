"use client";

interface WelcomeSectionProps {
  hasProfile: boolean;
  children: React.ReactNode;
}

export default function WelcomeSection({ hasProfile, children }: WelcomeSectionProps) {
  return (
    <div className={`${!hasProfile ? 'h-[80vh] flex flex-col justify-center' : ''}`}>
      {!hasProfile && (
        <h1 className="text-center mb-8 max-w-2xl mx-auto">
          <div className="text-2xl text-gray-700">Welcome to <span className="font-bold">bskyStats.me</span></div>
          <div className="text-xl text-gray-700">A free tool for analyzing Bluesky posts and engagement for public accounts.</div>
        </h1>
      )}
      {children}
    </div>
  );
} 