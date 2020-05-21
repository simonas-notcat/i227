import { gql } from 'apollo-boost';
import { Credential } from '../types'
import { profile } from './fragments'

export interface LatestPostsData {
  count: number
  credentials: Credential[]
}

export interface LatestPostsVariables {
  take: number
  skip: number
}

export const getLatestPosts = gql`
  ${profile}
  query getLatestPosts($take: Int, $skip: Int) {
    count: credentialsCount(input: {
      where: [
        { column: type, value: "VerifiableCredential,ExternalUser", not: true}
      ],
    })
    credentials(input: {
      where: [
        { column: type, value: "VerifiableCredential,ExternalUser", not: true}
      ],
      order: [
        { column: issuanceDate, direction: DESC }
      ],
      take: $take,
      skip: $skip
    }) {
      issuer { ...profile }
      subject { ...profile }
      id
      hash
      type
      issuanceDate
      claims {
        hash
        type
        value
      }
    }
  }
`
