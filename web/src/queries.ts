import { gql } from 'apollo-boost';

export const getCredential = gql`
  query getCredential($hash: ID!) {
    credential(hash: $hash) {
      hash
      id
      raw
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
      type
      issuanceDate
      claims {
        type
        value
      }
    }
  }
`

export const getCredentialsById = gql`
  query getCredentialsById($id: String!) {
    credentials(input: {
      where: [
        { column: id, value: [$id] }
      ]
    }) {
      id
      hash
      raw
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
      type
      issuanceDate
      claims {
        type
        value
      }
    }
  }
`


