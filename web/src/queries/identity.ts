import { gql } from 'apollo-boost';
import { Identity } from '../types'

interface ShortClaim {
  type: string
  value: string
}

export interface Credential {
  id: string
  hash: string
  issuanceDate: string
  issuer: Identity
  subject: Identity
  claims: ShortClaim[]
}

export interface IdentityData {
  identity: Identity
  receivedCredentials: Credential[]
  receivedCredentialsCount: number
  issuedCredentials: Credential[]
  issuedCredentialsCount: number
}

export interface IdentityVariables {
  did: string
  take: number
}

export const getIdentity = gql`
query getIdentity($did: String!, $take: Int!) {
  identity(did: $did) {
    did
    name: latestClaimValue(type: "realName")
    profileImage: latestClaimValue(type: "profileImage")
  }
  receivedCredentials: credentials(input: {
    where: [
      { column: subject, value: [$did]},
      { column: type, value: "VerifiableCredential,Kudos"}
    ],
    order: [
      { column: issuanceDate, direction: DESC }
    ],
    take: $take
  }) {
    id
    hash
    issuanceDate
    issuer {
      did
      name: latestClaimValue(type: "realName")
      profileImage: latestClaimValue(type: "profileImage")
    }
    claims {
      type
      value
    }
  }
  receivedCredentialsCount: credentialsCount(input: {
    where: [
      { column: subject, value: [$did]},
      { column: type, value: "VerifiableCredential,Kudos"}
    ]
  }) 
  issuedCredentials: credentials(input: {
    where: [
      { column: issuer, value: [$did]},
      { column: type, value: "VerifiableCredential,Kudos"}
    ],
    order: [
      { column: issuanceDate, direction: DESC }
    ],
    take: $take
  }) {
    id
    hash
    issuanceDate
    subject {
      did
      name: latestClaimValue(type: "realName")
      profileImage: latestClaimValue(type: "profileImage")
    }
    claims {
      type
      value
    }
  }
  issuedCredentialsCount: credentialsCount(input: {
    where: [
      { column: issuer, value: [$did]},
      { column: type, value: "VerifiableCredential,Kudos"}
    ]
  }) 
}
`