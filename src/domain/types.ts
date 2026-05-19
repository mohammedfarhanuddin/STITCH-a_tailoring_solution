export type GenderFlow = 'men' | 'women'
export type ServiceType = 'alteration' | 'stitching' | 'repair'
export type Role = 'customer' | 'tailor' | 'admin'

export type OrderStatus =
  | 'Order Placed'
  | 'In Progress'
  | 'Order Ready'
  | 'Out for Delivery'
  | 'Delivered'

export type Tailor = {
  id: string
  name: string
  rating: number
  specialty: string
  turnaroundHours: number
  priceMin: number
  priceMax: number
  portfolio: { src: string; alt: string }[]
}

export type BookingInput = {
  genderFlow: GenderFlow
  tailorId: string
  serviceType: ServiceType
  garmentType: string
  quantity: number
  pickupSlot: string
  addressLine: string
  notes: string
  measurementNotes: string
  referencePhotos: string[]
}

export type MoneyBreakdown = {
  tailorPrice: number
  deliveryFee: number
  totalPaid: number
  tailorShare: number
  platformPool: number
}

export type OrderEvent = {
  atIso: string
  status: OrderStatus
  note?: string
}

export type Order = {
  id: string
  createdAtIso: string
  customerUserId?: string | null
  assignedTailorUserId?: string | null
  customerName: string
  customerPhone: string
  input: BookingInput
  money: MoneyBreakdown
  status: OrderStatus
  timeline: OrderEvent[]
}

export type Profile = {
  id: string
  role: Role
  displayName: string | null
  phone: string | null
  createdAtIso: string
  approvalStatus?: TailorApprovalStatus
}

export type TailorSignupPayload = {
  fullName: string
  shopName: string
  shopAddress: string
  gstin: string
  email: string
  phone: string
  aadhaarNumber: string
  panNumber: string
}

export type CustomerSignupPayload = {
  fullName: string
  email: string
}

export type CustomerProfileDetails = {
  fullName: string
  email: string
  phone: string
  location: string
  gender: string
  fittingSizes: string
}

export type TailorProfileDetails = {
  fullName: string
  shopName: string
  shopAddress: string
  gstin: string
  email: string
  phone: string
  aadhaarNumber: string
  panNumber: string
  approvalStatus?: TailorApprovalStatus
}

export type TailorApprovalStatus = 'pending' | 'approved' | 'rejected'

export type TailorProfileRecord = TailorProfileDetails & {
  id: string
  createdAtIso: string
  approvalStatus: TailorApprovalStatus
}

export type CustomerProfileRecord = CustomerProfileDetails & {
  id: string
  createdAtIso: string
}

export type CustomerIssueRecord = {
  id: string
  customerUserId: string
  customerName: string
  message: string
  createdAtIso: string
}

