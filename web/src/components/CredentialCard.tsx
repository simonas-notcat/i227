import React from "react";
import { Typography, CardHeader, CardMedia, Collapse, CardContent, GridList, GridListTile, Badge } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import CardActions from "@material-ui/core/CardActions";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
import RepeatIcon from '@material-ui/icons/Repeat';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CredentialPostCard from './CredentialPostCard'
import CredentialReactionCard from './CredentialReactionCard'
import clsx from 'clsx';
import { useAuth0 } from "../react-auth0-spa";

import { formatDistanceToNow } from 'date-fns'
import { Credential } from '../types'

interface Props {
  credential: Credential
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(2)
  },

}));

function CredentialCard(props: Props) {
  const { credential } = props
  const classes = useStyles();

  if (credential.type.includes('Post')) {
    return (<CredentialPostCard credential={credential} /> )
  }
  
  if (credential.type.includes('Reaction')) {
    return (<CredentialReactionCard credential={credential} /> )
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