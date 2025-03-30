'use client'

import Link from 'next/link'

export default function Header() {
  const handleLogoClick = () => {
    window.location.href = '/'
  }

  return (
    <header className="bg-white border-b border-gray-200 py-4">
      <div className="w-full px-6 flex items-center justify-between">
        {/* Logo hard-left */}
        <div className="cursor-pointer" onClick={handleLogoClick}>
          <img src="/logo.png" alt="bskyStats Logo" className="h-15 w-auto" />
        </div>

        {/* Login button hard-right */}
        <Link href="/login">
          <span className="bg-blue-500 text-white font-medium px-6 py-3 rounded hover:bg-blue-700 transition text-sm cursor-pointer">
            Log In
          </span>
        </Link>
      </div>
    </header>
  )
}


