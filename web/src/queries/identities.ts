import { gql } from 'apollo-boost';
import { Identity } from '../types'

export interface IdentitiesData {
  identities: Identity[]
}

export const getIdentities = gql`
  query getIdentities($take: Int, $skip: Int) {
    identities(input: {
      take: $take,
      skip: $skip,
    }) {
        did
        name: latestClaimValue(type: "realName")
        profileImage: latestClaimValue(type: "profileImage")
    }
  }
`