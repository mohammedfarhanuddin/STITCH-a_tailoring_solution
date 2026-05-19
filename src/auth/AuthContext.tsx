import { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { Profile, Role } from '../domain/types'
import { getProfile } from '../domain/auth'
import { hasSupabaseConfig, supabase } from '../domain/supabase'

type AuthState = {
  hasSupabase: boolean
  loading: boolean
  session: Session | null
  user: User | null
  profile: Profile | null
  role: Role | null
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider(props: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  const safeFetchProfile = useCallback(async (u: User | null) => {
    if (!u || !hasSupabaseConfig || !supabase) {
      setProfile(null)
      return
    }
    try {
      const p = await getProfile(u)
      setProfile(p)
    } catch (err) {
      console.error('Failed to fetch profile during auth lifecycle:', err)
      setProfile(null)
    }
  }, [])

  const refreshProfile = useCallback(async () => {
    try {
      if (!hasSupabaseConfig || !supabase) return
      const { data } = await supabase.auth.getUser()
      await safeFetchProfile(data.user)
    } catch (err) {
      console.error('Failed to refresh profile', err)
    }
  }, [safeFetchProfile])

  const sessionTokenRef = useRef<string | undefined>(undefined)
  useEffect(() => {
    sessionTokenRef.current = session?.access_token
  }, [session?.access_token])

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) {
      setLoading(false)
      return
    }

    let mounted = true
    let subscription: { unsubscribe: () => void } | null = null

    // We initialize strictly sequentially to avoid Supabase gotrue-js localstorage deadlocks
    async function initAuth() {
      try {
        const { data: { session: activeSession }, error } = await supabase!.auth.getSession()
        
        if (!mounted) return
        if (error) throw error

        setSession(activeSession)
        setUser(activeSession?.user ?? null)
        await safeFetchProfile(activeSession?.user ?? null)
      } catch (err) {
        console.error('Initial session fetch failed:', err)
        if (mounted) {
          setSession(null)
          setUser(null)
          setProfile(null)
        }
      } finally {
        if (mounted) setLoading(false)
      }

      if (!mounted) return

      // Only subscribe AFTER initial getSession resolves
      const { data } = supabase!.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return
        
        if (event === 'INITIAL_SESSION') return // Handled by getSession above

        if (event === 'SIGNED_OUT') {
          setSession(null)
          setUser(null)
          setProfile(null)
          setLoading(false)
          return
        }

        try {
          setSession(newSession)
          setUser(newSession?.user ?? null)
          await safeFetchProfile(newSession?.user ?? null)
        } catch (err) {
          console.error('State change fetch failed', err)
        }
      })
      subscription = data.subscription
    }

    void initAuth()

    const handleFocus = async () => {
      if (!mounted) return
      
      try {
        const { data: { session: currentSession }, error } = await supabase!.auth.getSession()
        
        if (error || !currentSession) {
          setSession(null)
          setUser(null)
          setProfile(null)
        } else if (currentSession.access_token !== sessionTokenRef.current) {
          setSession(currentSession)
          setUser(currentSession.user)
          await safeFetchProfile(currentSession.user)
        }
      } catch (err) {
        console.error('Focus recovery failed:', err)
      }
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      mounted = false
      if (subscription) subscription.unsubscribe()
      window.removeEventListener('focus', handleFocus)
    }
  }, [safeFetchProfile])

  const value = useMemo<AuthState>(
    () => ({
      hasSupabase: hasSupabaseConfig,
      loading,
      session,
      user,
      profile,
      role: profile?.role ?? null,
      refreshProfile,
    }),
    [loading, session, user, profile, refreshProfile],
  )

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
