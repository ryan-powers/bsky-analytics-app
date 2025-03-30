'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ProfileSection from '../../components/ProfileSection'
import { fetchUserData } from '../../lib/atproto'

export default function Dashboard() {
  const [profile, setProfile] = useState(null)
  const [posts, setPosts] = useState([])
  const [handle, setHandle] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectingHandle, setSelectingHandle] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('handle')
        .eq('id', user.id)
        .single()

      if (error || !data?.handle) {
        setSelectingHandle(true)
        setLoading(false)
      } else {
        setHandle(data.handle)
        fetchAndSetData(data.handle)
      }
    }

    init()
  }, [router])

  const fetchAndSetData = async (userHandle: string) => {
    try {
      const data = await fetchUserData(userHandle)
      setProfile(data.profile)
      setPosts(data.posts)
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  const saveHandle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, handle })

    if (!error) {
      setSelectingHandle(false)
      fetchAndSetData(handle)
    }
  }

  if (loading) return <p className="p-4">Loading dashboard...</p>

  if (selectingHandle) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white p-6 rounded shadow border">
          <h2 className="text-lg font-semibold mb-2">Select your bsky handle</h2>
          <input
            type="text"
            placeholder="@your.handle"
            className="border px-3 py-2 rounded w-full"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
          />
          <button
            onClick={saveHandle}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save and View Dashboard
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow max-w-5xl mx-auto px-6 py-4">
        {profile && (
          <ProfileSection
            name={profile.name}
            handle={profile.handle}
            avatar={profile.avatar}
            description={profile.description}
            followersCount={profile.followersCount}
          />
        )}
        {/* Add StatsBlock, Chart, TopPosts, etc. here */}
      </div>
      <Footer />
    </main>
  )
}


