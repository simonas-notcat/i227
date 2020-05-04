import { gql } from 'apollo-boost';
import { Credential } from '../types'

export interface LatestKudosData {
  count: number
  credentials: Credential[]
}

export const getLatestKudos = gql`
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
      issuer {
        did
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
      }
      subject {
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
      }
      type
      issuanceDate
      claims {
        type
        value
      }
    }
  }
`
