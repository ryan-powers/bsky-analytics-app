'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleLogin = async () => {
    setStatus('sending')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`  // 👈 redirect here
      }
    })
  
    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow border border-gray-200">
        <div
          className="mb-6 flex justify-center cursor-pointer" 
          onClick={() => (window.location.href = "/")}
        >
          <img src="/logo.png" alt="bskyStats Logo" className="h-15" />
        </div>
        <p className="text-center text-gray-600 mb-6 text-sm">
          Enter your email to receive a magic link.
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring focus:border-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={status === "sending"}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium"
        >
          {status === "sending" ? "Sending..." : "Send Magic Link"}
        </button>

        {status === "sent" && (
          <p className="mt-4 text-center text-green-600">
            ✅ Check your email for the login link.
          </p>
        )}

        {status === "error" && (
          <p className="mt-4 text-center text-red-600">
            ❌ {errorMessage || "Something went wrong"}
          </p>
        )}
      </div>
    </div>
  );
}

