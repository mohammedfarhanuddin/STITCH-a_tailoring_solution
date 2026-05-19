import { hasSupabaseConfig, supabase } from './supabase'
import type {
  CustomerIssueRecord,
  CustomerProfileRecord,
  TailorApprovalStatus,
  TailorProfileRecord,
} from './types'

export async function listTailorProfiles(): Promise<TailorProfileRecord[]> {
  if (!hasSupabaseConfig || !supabase) return []
  const { data, error } = await supabase
    .from('tailor_profiles')
    .select(
      'id, full_name, shop_name, shop_address, gstin, email, phone, aadhaar_number, pan_number, created_at, approval_status',
    )
    .order('created_at', { ascending: false })
  if (error) {
    console.error(error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    id: String(r.id),
    fullName: String(r.full_name ?? ''),
    shopName: String(r.shop_name ?? ''),
    shopAddress: String(r.shop_address ?? ''),
    gstin: String(r.gstin ?? ''),
    email: String(r.email ?? ''),
    phone: String(r.phone ?? ''),
    aadhaarNumber: String(r.aadhaar_number ?? ''),
    panNumber: String(r.pan_number ?? ''),
    createdAtIso: String(r.created_at ?? new Date().toISOString()),
    approvalStatus: (r.approval_status as TailorApprovalStatus) ?? 'pending',
  }))
}

export async function updateTailorApprovalStatus(
  tailorId: string,
  approvalStatus: TailorApprovalStatus,
): Promise<void> {
  if (!hasSupabaseConfig || !supabase) return
  const { error } = await supabase
    .from('tailor_profiles')
    .update({ approval_status: approvalStatus })
    .eq('id', tailorId)
  if (error) throw error
}

export async function listCustomerProfiles(): Promise<CustomerProfileRecord[]> {
  if (!hasSupabaseConfig || !supabase) return []
  const { data, error } = await supabase
    .from('customer_profiles')
    .select('id, full_name, email, phone, location, gender, fitting_sizes, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error(error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    id: String(r.id),
    fullName: String(r.full_name ?? ''),
    email: String(r.email ?? ''),
    phone: String(r.phone ?? ''),
    location: String(r.location ?? ''),
    gender: String(r.gender ?? ''),
    fittingSizes: String(r.fitting_sizes ?? ''),
    createdAtIso: String(r.created_at ?? new Date().toISOString()),
  }))
}

export async function createCustomerIssue(params: {
  customerUserId: string
  customerName: string
  message: string
}): Promise<void> {
  if (!hasSupabaseConfig || !supabase) return
  const { error } = await supabase.from('customer_issues').insert({
    customer_user_id: params.customerUserId,
    customer_name: params.customerName,
    message: params.message,
  })
  if (error) throw error
}

export async function listCustomerIssues(): Promise<CustomerIssueRecord[]> {
  if (!hasSupabaseConfig || !supabase) return []
  const { data, error } = await supabase
    .from('customer_issues')
    .select('id, customer_user_id, customer_name, message, created_at')
    .order('created_at', { ascending: false })
  if (error) {
    console.error(error.message)
    return []
  }
  return (data ?? []).map((r) => ({
    id: String(r.id),
    customerUserId: String(r.customer_user_id),
    customerName: String(r.customer_name ?? ''),
    message: String(r.message ?? ''),
    createdAtIso: String(r.created_at ?? new Date().toISOString()),
  }))
}

