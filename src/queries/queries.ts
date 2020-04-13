export const getLatestKudos = `
  query getLatestKudos($take: Int, $skip: Int) {
    claims(input: {
      type: "kudos",
      options: {
        take: $take,
        skip: $skip,
      }
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
      }
    }
  }
`

export const getCredential = `
  query getCredential($hash: ID!) {
    credential(hash: $hash) {
      hash
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

export const getIdentities = `
  query getIdentities($take: Int, $skip: Int) {
    identities(input: {
      options: {
        take: $take,
        skip: $skip,
      }
    }) {
        did
        name: latestClaimValue(type: "realName")
        profileImage: latestClaimValue(type: "profileImage")
    }
  }
`

export const getIdentity = `
  query getIdentity($did: ID!) {
    identity(did: $did) {
      did
      name: latestClaimValue(type: "realName")
      profileImage: latestClaimValue(type: "profileImage")
      receivedCredentials {
        hash
        issuer {
          did
          name: latestClaimValue(type: "realName")
          profileImage: latestClaimValue(type: "profileImage")
        }
        claims {
          type
          value
        }
      }
      issuedCredentials {
        hash
        subject {
          did
          name: latestClaimValue(type: "realName")
          profileImage: latestClaimValue(type: "profileImage")
        }
        claims {
          type
          value
        }
      }
    }
  }
`