export const getLatestKudos = `
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
      take: $take,
      skip: $skip,
    }) {
        did
        name: latestClaimValue(type: "realName")
        profileImage: latestClaimValue(type: "profileImage")
    }
  }
`

export const getIdentity = `
  query getIdentity($did: String!, $take: Int!) {
    identity(did: $did) {
      did
      name: latestClaimValue(type: "realName")
      profileImage: latestClaimValue(type: "profileImage")
    }
    receivedCredentials: credentials(input: {
      where: [
        { column: subject, value: [$did]},
        { column: type, value: "VerifiableCredential,Kudos"}
      ],
      order: [
        { column: issuanceDate, direction: DESC }
      ],
      take: $take
    }) {
      hash
      issuanceDate
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
    receivedCredentialsCount: credentialsCount(input: {
      where: [
        { column: subject, value: [$did]},
        { column: type, value: "VerifiableCredential,Kudos"}
      ]
    }) 
    issuedCredentials: credentials(input: {
      where: [
        { column: issuer, value: [$did]},
        { column: type, value: "VerifiableCredential,Kudos"}
      ],
      order: [
        { column: issuanceDate, direction: DESC }
      ],
      take: $take
    }) {
      hash
      issuanceDate
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
    issuedCredentialsCount: credentialsCount(input: {
      where: [
        { column: issuer, value: [$did]},
        { column: type, value: "VerifiableCredential,Kudos"}
      ]
    }) 
  }
`