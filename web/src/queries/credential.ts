import { gql } from 'apollo-boost';
import { Credential, Claim, Identity } from '../types'
import { profile } from './fragments'

export interface CredentialData {
  credentials: Credential[]
  reactions: {
    issuer: Identity,
    issuanceDate: string,
    type: 'like' | 'dislike'
  }[]
}

export interface CredentialVariables {
  id: string
}

export const getCredential = gql`
  ${profile}
  query getCredential($id: String!) {
    credentials(input: {
      where: [
        { column: id, value: [$id] }
      ]
    }) {
      hash
      id
      raw
      issuer { ...profile }
      subject { ...profile }
      type
      context
      issuanceDate
      expirationDate
      claims {
        hash
        type
        value
      }
    }
    reactions: claims(input: {
      where: [
        { column: credentialType, value: "VerifiableCredential,Reaction" },
        { column: value, value: [$id] }
      ]
    }) {
      issuer { ...profile }
      type
      issuanceDate
    }
  }
`


export interface CredentialDetailsData {
  likes: Claim[]
  likesCount: number
  dislikes: Claim[]
  dislikesCount: number
}

export const getCredentialDetails = gql`
  ${profile}
  query getCredentialDetails($id: String!) {
    likes: claims(input: {
      where: [
        { column: type, value: ["like"] },
        { column: value, value: [$id] },
      ]
    }) {
      issuer { ...profile }
    }
    likesCount: claimsCount(input: {
      where: [
        { column: type, value: ["like"] },
        { column: value, value: [$id] },
      ]
    })
    dislikes: claims(input: {
      where: [
        { column: type, value: ["dislike"] },
        { column: value, value: [$id] },
      ]
    }) {
      issuer { ...profile }
    }
    dislikesCount: claimsCount(input: {
      where: [
        { column: type, value: ["dislike"] },
        { column: value, value: [$id] },
      ]
    })    
  }
`




