'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Crown from './Crown'

export default function AuthForm({ mode = 'signin' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        
        setMessage('✅ Welcome back to CHIVITO AI!')
        
        // Redirect to dashboard after successful sign in
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
        
      } else {
        // Sign up mode - Create account and redirect immediately
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        
        if (error) throw error
        
        // For demo purposes, we'll redirect immediately after signup
        if (data.user) {
          setMessage('✅ Account created! Redirecting to dashboard...')
          
          // Force redirect to dashboard for demo
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 1500)
        } else {
          setMessage('✅ Check your email to confirm your account!')
        }
      }
    } catch (error) {
      console.error('Auth error:', error)
      setMessage(`❌ ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen luxury-gradient flex items-center justify-center p-4">
      <div className="premium-card w-full max-w-md p-8 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-12 h-12 mr-3" />
            <h1 className="brand-title">CHIVITO AI</h1>
          </div>
          <p className="text-gray-600">
            {mode === 'signin' ? 'Welcome back to your AI empire' : 'Join the AI automation revolution'}
          </p>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="premium-input w-full"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input w-full"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="royal-button w-full py-3 text-base font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              mode === 'signin' ? 'Sign In to CHIVITO AI' : 'Start Free Trial'
            )}
          </button>
        </form>

        {/* Message */}
        {message && (
          <div className="mt-4 p-3 rounded-lg text-sm text-center bg-gray-50">
            {message}
          </div>
        )}

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}
          </p>
          <button
            type="button"
            onClick={() => window.location.href = mode === 'signin' ? '/signup' : '/signin'}
            className="text-sm font-medium text-royal-600 hover:text-royal-500 mt-1"
          >
            {mode === 'signin' ? 'Start your free trial' : 'Sign in instead'}
          </button>
        </div>

        {/* Features Preview */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold text-gray-700">What you get:</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              <span>AI Agents</span>
            </div>
            <div className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              <span>Lead Generation</span>
            </div>
            <div className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              <span>Revenue Tracking</span>
            </div>
            <div className="flex items-center">
              <Crown className="w-4 h-4 mr-2" />
              <span>Automation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}