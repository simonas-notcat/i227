import { gql } from 'apollo-boost';
import { Claim } from '../types'

export interface LatestKudosData {
  count: number
  claims: Claim[]
}

export const getLatestKudos = gql`
  query getLatestKudos($take: Int, $skip: Int) {
    count: claimsCount(input: {
      where: [
        { column: type, value: "kudos"}
      ],
    })
    claims(input: {
      where: [
        { column: type, value: "kudos"}
      ],
      order: [
        { column: issuanceDate, direction: DESC }
      ],
      take: $take,
      skip: $skip
    }) {
      issuer {
        did
        name: latestClaimValue(type: "realName")
        profileImage: latestClaimValue(type: "profileImage")
      }
      subject {
        did
        name: latestClaimValue(type: "realName")
        profileImage: latestClaimValue(type: "profileImage")
      }
      value
      issuanceDate
      credential {
        hash
        id
      }
    }
  }
`
