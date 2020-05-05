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
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
      }
      subject {
        did
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
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

export const getCredential = `
  query getCredential($hash: ID!) {
    credential(hash: $hash) {
      hash
      id
      raw
      issuer {
        did
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
      }
      subject {
        did
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

export const getCredentialsById = `
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
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
      }
      subject {
        did
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


export const getIdentities = `
  query getIdentities($take: Int, $skip: Int) {
    identities(input: {
      take: $take,
      skip: $skip,
    }) {
        did
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
    }
  }
`

export const getIdentity = `
  query getIdentity($did: String!, $take: Int!) {
    identity(did: $did) {
      did
      name: latestClaimValue(type: "name")
      nickname: latestClaimValue(type: "nickname")
      picture: latestClaimValue(type: "picture")
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
      id
      hash
      issuanceDate
      issuer {
        did
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
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
      id
      hash
      issuanceDate
      subject {
        did
        name: latestClaimValue(type: "name")
        nickname: latestClaimValue(type: "nickname")
        picture: latestClaimValue(type: "picture")
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