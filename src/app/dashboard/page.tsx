'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProfileSection from '../../components/ProfileSection'
import StatsBlock from '../../components/StatsBlock'
import Chart from '../../components/Chart'
import TopPosts from '../../components/TopPosts'
import { fetchUserData } from '../../lib/atproto'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])

  useEffect(() => {
    // Fetch user data
    fetchUserData('your-handle') // Replace with actual user handle
      .then((data) => {
        setProfile(data.profile)
        setPosts(data.posts)
      })
      .catch((error) => console.error('Error fetching user data:', error))
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <div className="flex-grow">
        <div className="max-w-5xl mx-auto px-6 py-4">
          {profile && (
            <ProfileSection
              name={profile.name}
              handle={profile.handle}
              avatar={profile.avatar}
              description={profile.description}
              followersCount={profile.followersCount}
            />
          )}

          {posts.length > 0 && (
            <>
              <StatsBlock posts={posts} filteredPosts={posts} />
              <Chart chartData={posts} />
              <TopPosts posts={posts} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
