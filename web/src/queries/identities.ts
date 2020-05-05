import { gql } from 'apollo-boost';
import { Identity } from '../types'
import { profile } from './fragments'

export interface IdentitiesData {
  identities: Identity[]
}

export const getIdentities = gql`
  ${profile}
  query getIdentities($take: Int, $skip: Int) {
    identities(input: {
      take: $take,
      skip: $skip,
    }) {
        ...profile
    }
  }
`