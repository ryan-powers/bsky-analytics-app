"use client";

export default function Header() {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="max-w-4xl mx-auto px-4 flex justify-center">
        <div 
          className="flex items-center cursor-pointer" 
          onClick={handleLogoClick}
        >
          <img
            src="/logo.png"
            alt="bskyStats Logo"
            className="h-15"
          />
        </div>
      </div>
    </header>
  );
} 