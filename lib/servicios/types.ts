import type { ServiceCategory } from "./catalog"

export type LeadServiceStatus =
  | "suggested"
  | "approved"
  | "rejected"
  | "in_progress"
  | "completed"

export type LeadServiceAssignment = "pipeline" | "admin"

export interface LeadServiceWithService {
  lead_id: string
  service_id: string
  assigned_at: string
  assigned_by: LeadServiceAssignment
  status: LeadServiceStatus
  notes: string | null
  service: {
    id: string
    name: string
    slug: string
    short_description: string
    category: ServiceCategory
    price_monthly: string | null
    timeline: string | null
    deliverables: string[]
  }
}

export interface ServiceWithLeadCount {
  id: string
  name: string
  slug: string
  short_description: string
  category: ServiceCategory
  industries: string[]
  active: boolean
  featured: boolean
  price_monthly: string | null
  timeline: string | null
  _count: {
    leads: number
  }
}
