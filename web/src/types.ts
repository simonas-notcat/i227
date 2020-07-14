export interface IdentityProfile {
  did: string
  name?: string
  nickname?: string
  picture?: string
}

export interface Service {
  id: string,
  title: string
  subtitle: string
  description: string
  url: string
  picture: string
  available: boolean
}

