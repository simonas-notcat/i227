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
import { VerifiableCredential } from 'daf-core'

interface Props {
  credential: VerifiableCredential
  type: 'summary' | 'details'
}

function PostCard(props: Props) {
  const { credential } = props

  return (
    <Card elevation={2}>
      <CardActionAreaLink to={'/c/' + credential.id}>
        <Typography variant="body2" color="textSecondary" component="p">
          {JSON.stringify(credential)}  
        </Typography> 
      </CardActionAreaLink>
    </Card>
  );
}

export default PostCard;