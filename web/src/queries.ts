import { gql } from 'apollo-boost';

export const getCredential = gql`
  query getCredential($hash: ID!) {
    credential(hash: $hash) {
      hash
      id
      raw
      issuer {
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


