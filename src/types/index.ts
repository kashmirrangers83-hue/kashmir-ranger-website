export interface SiteSettings {
  clubName: string
  socialMedia: {
    twitter?: string
    facebook?: string
    instagram?: string
    email?: string
    phone?: string
  }
  playCricketSiteId?: string
  playCricketLeagueTableWidget?: string
  playCricketResultsWidget?: string
}

export interface Official {
  id: string
  name: string
  role: string
  photoUrl?: string
  order: number
}

export interface Sponsor {
  id: string
  name: string
  logoUrl: string
  websiteUrl?: string
  order: number
}

export interface Content {
  aboutPage: string
  homeAnnouncement?: string
  rangerStandard: string
  contactInfo: {
    address?: string
    email?: string
    phone?: string
  }
}

export interface AuthState {
  isAuthenticated: boolean
  email?: string
}
