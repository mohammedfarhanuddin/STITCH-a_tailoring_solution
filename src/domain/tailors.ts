import { hasSupabaseConfig, supabase } from './supabase'

export type PublicTailorProfile = {
  id: string
  fullName: string
  shopName: string
  shopAddress: string
  phone: string
}

export async function getApprovedTailors(): Promise<PublicTailorProfile[]> {
  if (!hasSupabaseConfig || !supabase) return []
  const { data, error } = await supabase
    .from('tailor_profiles')
    .select('id, full_name, shop_name, shop_address, phone')
    .eq('approval_status', 'approved')
    .order('created_at', { ascending: false })
  
  if (error || !data) return []
  
  return data.map((d: any) => ({
    id: d.id,
    fullName: d.full_name,
    shopName: d.shop_name,
    shopAddress: d.shop_address,
    phone: d.phone,
  }))
}

export async function getTailorById(id: string): Promise<PublicTailorProfile | null> {
  if (!hasSupabaseConfig || !supabase) return null
  const { data, error } = await supabase
    .from('tailor_profiles')
    .select('id, full_name, shop_name, shop_address, phone')
    .eq('id', id)
    .maybeSingle()
  
  if (error || !data) return null
  
  return {
    id: data.id,
    fullName: data.full_name,
    shopName: data.shop_name,
    shopAddress: data.shop_address,
    phone: data.phone,
  }
}

