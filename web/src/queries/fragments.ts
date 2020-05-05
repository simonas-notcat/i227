import { gql } from 'apollo-boost';

export const profile = gql`
  fragment profile on Identity {
    did
    name: latestClaimValue(type: "name")
    nickname: latestClaimValue(type: "nickname")
    picture: latestClaimValue(type: "picture")
  }
`