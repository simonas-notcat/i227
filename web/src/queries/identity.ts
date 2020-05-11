import { gql } from 'apollo-boost';
import { Identity, Credential } from '../types'
import { profile } from './fragments'

interface ShortClaim {
  type: string
  value: string
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
  type: string[]
}

export const getIdentity = gql`
${profile}
query getIdentity($did: String!, $type: [String]!, $take: Int!) {
  identity(did: $did) {
    ...profile
    url: latestClaimValue(type: "url")
    email: latestClaimValue(type: "email")
  }
  receivedCredentials: credentials(input: {
    where: [
      { column: subject, value: [$did]},
      { column: type, value: $type}
    ],
    order: [
      { column: issuanceDate, direction: DESC }
    ],
    take: $take
  }) {
    id
    hash
    issuanceDate
    type
    issuer { ...profile }
    subject { ...profile }
    claims {
      hash
      type
      value
    }
  }
  receivedCredentialsCount: credentialsCount(input: {
    where: [
      { column: subject, value: [$did]},
      { column: type, value: $type}
    ]
  }) 
  issuedCredentials: credentials(input: {
    where: [
      { column: issuer, value: [$did]},
      { column: type, value: $type}
    ],
    order: [
      { column: issuanceDate, direction: DESC }
    ],
    take: $take
  }) {
    id
    hash
    issuanceDate
    issuer { ...profile }
    subject { ...profile }
    type
    claims {
      hash
      type
      value
    }
  }
  issuedCredentialsCount: credentialsCount(input: {
    where: [
      { column: issuer, value: [$did]},
      { column: type, value: $type}
    ]
  }) 
}
`