export type Project = {
  id: string
  created_at: string
  title: string
  description: string
  image_url: string | null
  funding_goal: number | null
  funding_raised: number
}

export type PartnerInsert = {
  full_name: string
  email: string
  phone: string
  location: string | null
  partnership_type: string
  pledge_frequency: string | null
  area_of_partnership: string
  amount: number | null
  payment_method: string | null
  is_anonymous: boolean
  message: string | null
}
