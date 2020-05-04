import { gql } from 'apollo-boost';
import { Identity, Credential } from '../types'


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
}

export const getIdentity = gql`
query getIdentity($did: String!, $take: Int!) {
  identity(did: $did) {
    did
    name: latestClaimValue(type: "name")
    nickname: latestClaimValue(type: "nickname")
    picture: latestClaimValue(type: "picture")
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
      name: latestClaimValue(type: "name")
      nickname: latestClaimValue(type: "nickname")
      picture: latestClaimValue(type: "picture")
    }
    subject {
      did
      name: latestClaimValue(type: "name")
      nickname: latestClaimValue(type: "nickname")
      picture: latestClaimValue(type: "picture")
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
    issuer {
      did
      name: latestClaimValue(type: "name")
      nickname: latestClaimValue(type: "nickname")
      picture: latestClaimValue(type: "picture")
    }
    subject {
      did
      name: latestClaimValue(type: "name")
      nickname: latestClaimValue(type: "nickname")
      picture: latestClaimValue(type: "picture")
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