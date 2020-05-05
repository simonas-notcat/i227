import { gql } from 'apollo-boost';
import { Credential } from '../types'
import { profile } from './fragments'

export interface CredentialData {
  credentials: Credential[]
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
  }
`



