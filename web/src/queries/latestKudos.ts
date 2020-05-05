import { gql } from 'apollo-boost';
import { Credential } from '../types'
import { profile } from './fragments'

export interface LatestKudosData {
  count: number
  credentials: Credential[]
}

export const getLatestKudos = gql`
  ${profile}
  query getLatestKudos($take: Int, $skip: Int) {
    count: credentialsCount(input: {
      where: [
        { column: type, value: "VerifiableCredential,Kudos"}
      ],
    })
    credentials(input: {
      where: [
        { column: type, value: "VerifiableCredential,Kudos"}
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
