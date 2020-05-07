export interface Credential {
  id: string
  hash: string
  issuer: Identity,
  subject: Identity,
  issuanceDate: string,
  type: string,
  context: string,
  claims: Claim[]
}

export interface Claim {
  credential: {
    id: string
    hash: string
  },
  hash: string,
  issuer: Identity,
  subject: Identity,
  issuanceDate: string,
  type: string,
  value: string,
}

export interface Identity {
  did: string,
  name: string,
  nickname: string,
  picture: string,
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