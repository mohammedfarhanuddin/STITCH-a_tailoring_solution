import type { Session, User } from '@supabase/supabase-js'
import type {
  CustomerProfileDetails,
  CustomerSignupPayload,
  Profile,
  Role,
  TailorApprovalStatus,
  TailorProfileDetails,
  TailorSignupPayload,
} from './types'
import { hasSupabaseConfig, supabase } from './supabase'

const PENDING_CUSTOMER_SIGNUP_KEY = 'smartTailor.pending.customer.signup'
const PENDING_TAILOR_SIGNUP_KEY = 'smartTailor.pending.tailor.signup'

export async function getSession(): Promise<Session | null> {
  if (!hasSupabaseConfig || !supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session ?? null
}

export async function signUpCustomer(payload: CustomerSignupPayload) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured')
  }
  localStorage.setItem(PENDING_CUSTOMER_SIGNUP_KEY, JSON.stringify(payload))
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?mode=signup_customer`,
    },
  })
  if (error) throw error
  return data
}

export async function signUpCustomerWithPassword(email: string, password: string) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function signInWithPassword(email: string, password: string) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data
}

export async function initTailorSignup() {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?mode=signup_tailor_init`,
    },
  })
  if (error) throw error
  return data
}

export async function signInWithGoogle(emailHint?: string) {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback?mode=login`,
      queryParams: emailHint ? { login_hint: emailHint } : undefined,
    },
  })
  if (error) throw error
}

export async function finalizeGoogleSignup(mode: string): Promise<void> {
  if (!hasSupabaseConfig || !supabase) {
    throw new Error('Supabase is not configured')
  }
  const { data } = await supabase.auth.getUser()
  const user = data.user
  if (!user) throw new Error('No authenticated user found after Google sign-in.')

  if (mode === 'signup_customer') {
    const raw = localStorage.getItem(PENDING_CUSTOMER_SIGNUP_KEY)
    const payload = raw ? (JSON.parse(raw) as CustomerSignupPayload) : null
    await upsertProfileBase(user.id, 'customer', payload?.fullName ?? user.user_metadata.full_name)
    await upsertCustomerProfile(user.id, {
      fullName: payload?.fullName ?? String(user.user_metadata.full_name ?? ''),
      email: user.email ?? payload?.email ?? '',
      phone: '',
      location: '',
      gender: '',
      fittingSizes: '',
    })
    localStorage.removeItem(PENDING_CUSTOMER_SIGNUP_KEY)
    return
  }

  if (mode === 'signup_tailor') {
    const raw = localStorage.getItem(PENDING_TAILOR_SIGNUP_KEY)
    const payload = raw ? (JSON.parse(raw) as TailorSignupPayload) : null
    if (!payload) {
      throw new Error('Tailor signup data is missing. Please submit signup again.')
    }
    await upsertProfileBase(user.id, 'tailor', payload.fullName, payload.phone)
    await upsertTailorProfile(user.id, {
      ...payload,
      email: user.email ?? payload.email,
    })
    localStorage.removeItem(PENDING_TAILOR_SIGNUP_KEY)
  }
}

export async function completeTailorProfile(userId: string, payload: TailorSignupPayload) {
  await upsertProfileBase(userId, 'tailor', payload.fullName, payload.phone)
  await upsertTailorProfile(userId, payload)
}

export async function signOut() {
  if (!hasSupabaseConfig || !supabase) return
  await supabase.auth.signOut()
}

export async function getProfile(user: User): Promise<Profile | null> {
  if (!hasSupabaseConfig || !supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('id, role, display_name, phone, created_at')
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    console.error('Failed to load profile:', error.message)
    return null
  }
  if (!data) return null

  const role = (data.role as Role) ?? 'customer'
  let approvalStatus: TailorApprovalStatus | undefined = undefined

  if (role === 'tailor') {
    const { data: tailorData } = await supabase
      .from('tailor_profiles')
      .select('approval_status')
      .eq('id', user.id)
      .maybeSingle()
    if (tailorData?.approval_status) {
      approvalStatus = tailorData.approval_status as TailorApprovalStatus
    } else {
      approvalStatus = 'pending'
    }
  }

  return {
    id: data.id as string,
    role,
    displayName: (data.display_name as string | null) ?? null,
    phone: (data.phone as string | null) ?? null,
    createdAtIso: (data.created_at as string) ?? new Date().toISOString(),
    approvalStatus,
  }
}

export async function getCustomerProfile(userId: string): Promise<CustomerProfileDetails | null> {
  if (!hasSupabaseConfig || !supabase) return null
  const { data, error } = await supabase
    .from('customer_profiles')
    .select('full_name, email, phone, location, gender, fitting_sizes')
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    fullName: (data.full_name as string) ?? '',
    email: (data.email as string) ?? '',
    phone: (data.phone as string) ?? '',
    location: (data.location as string) ?? '',
    gender: (data.gender as string) ?? '',
    fittingSizes: (data.fitting_sizes as string) ?? '',
  }
}

export async function upsertCustomerProfile(
  userId: string,
  payload: CustomerProfileDetails,
): Promise<void> {
  if (!hasSupabaseConfig || !supabase) return
  const { error } = await supabase.from('customer_profiles').upsert({
    id: userId,
    full_name: payload.fullName,
    email: payload.email,
    phone: payload.phone,
    location: payload.location,
    gender: payload.gender,
    fitting_sizes: payload.fittingSizes,
  })
  if (error) throw error
}

export async function getTailorProfile(userId: string): Promise<TailorProfileDetails | null> {
  if (!hasSupabaseConfig || !supabase) return null
  const { data, error } = await supabase
    .from('tailor_profiles')
    .select(
      'full_name, shop_name, shop_address, gstin, email, phone, aadhaar_number, pan_number, approval_status',
    )
    .eq('id', userId)
    .maybeSingle()
  if (error || !data) return null
  return {
    fullName: (data.full_name as string) ?? '',
    shopName: (data.shop_name as string) ?? '',
    shopAddress: (data.shop_address as string) ?? '',
    gstin: (data.gstin as string) ?? '',
    email: (data.email as string) ?? '',
    phone: (data.phone as string) ?? '',
    aadhaarNumber: (data.aadhaar_number as string) ?? '',
    panNumber: (data.pan_number as string) ?? '',
    approvalStatus: (data.approval_status as TailorApprovalStatus) ?? 'pending',
  }
}

async function upsertProfileBase(
  userId: string,
  role: Role,
  displayName?: string | null,
  phone?: string | null,
) {
  if (!hasSupabaseConfig || !supabase) return
  const { error } = await supabase.from('profiles').upsert({
    id: userId,
    role,
    display_name: displayName ?? null,
    phone: phone ?? null,
  })
  if (error) throw error
}

async function upsertTailorProfile(userId: string, payload: TailorSignupPayload) {
  if (!hasSupabaseConfig || !supabase) return
  const { error } = await supabase.from('tailor_profiles').upsert({
    id: userId,
    full_name: payload.fullName,
    shop_name: payload.shopName,
    shop_address: payload.shopAddress,
    gstin: payload.gstin,
    email: payload.email,
    phone: payload.phone,
    aadhaar_number: payload.aadhaarNumber,
    pan_number: payload.panNumber,
    approval_status: 'pending',
  })
  if (error) throw error
}

