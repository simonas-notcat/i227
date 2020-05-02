export interface Claim {
  credential: {
    id: string
    hash: string
  },
  issuer: Identity,
  subject: Identity,
  issuanceDate: string,
  type: string,
  value: string,
}

export interface Identity {
  did: string,
  name: string,
  profileImage: string,
}
