export const PARTNERSHIP_TYPES = [
  { value: "One-Time Partner" },
  { value: "Recurring Partner" },
] as const

export type PartnershipType = (typeof PARTNERSHIP_TYPES)[number]["value"]

export const PLEDGE_FREQUENCIES = ["Weekly", "Monthly", "Quarterly", "Annually"] as const
export type PledgeFrequency = (typeof PLEDGE_FREQUENCIES)[number]

export const AREAS_OF_PARTNERSHIP = [
  "Tithe and Offerings",
  "Building Project",
] as const
export type AreaOfPartnership = (typeof AREAS_OF_PARTNERSHIP)[number]

export const PAYMENT_METHODS = [
  "Bank Transfer",
  "Card",
  "Mobile Money",
  "Cash/In-Person",
] as const
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
