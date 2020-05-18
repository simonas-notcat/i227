import React from "react";
import { Typography, CardHeader } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import Avatar from '@material-ui/core/Avatar';
import CredentialPostCard from './CredentialPostCard'
import CredentialReactionCard from './CredentialReactionCard'
import CredentialProfileCard from './CredentialProfileCard'
import CredentialServiceCard from './CredentialServiceCard'

import { formatDistanceToNow } from 'date-fns'
import { Credential } from '../types'

interface Props {
  credential: Credential
  type: 'summary' | 'details'
}

function CredentialCard(props: Props) {
  const { credential } = props

  if (credential.type.includes('Post')) {
    return (<CredentialPostCard {...props} /> )
  }
  
  if (credential.type.includes('Profile')) {
    return (<CredentialProfileCard  {...props} /> )
  }

  if (credential.type.includes('Reaction')) {
    return (<CredentialReactionCard  {...props} /> )
  }

  if (credential.type.includes('Service')) {
    return (<CredentialServiceCard  {...props} /> )
  }

  return (
    <Card elevation={2}>
      <CardActionAreaLink to={'/identity/' + credential.issuer.did}>
        <CardHeader
          avatar={
            <Avatar src={credential.issuer.picture} />
          }

          title={`${credential.issuer.name}`}
          subheader={`${credential.issuer.nickname} | ${formatDistanceToNow(Date.parse(credential.issuanceDate))} ago`}
        />
      </CardActionAreaLink>
      <CardActionAreaLink to={'/c/' + credential.id}>
        <Typography variant="body2" color="textSecondary" component="p">
          {credential.issuer.name}  <strong>{credential.claims[0].type}={credential.claims[0].value}</strong> to {credential.subject.name}
          </Typography> 
      </CardActionAreaLink>
    </Card>
  );
}

export default CredentialCard;