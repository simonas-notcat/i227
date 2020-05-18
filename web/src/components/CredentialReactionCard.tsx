import React from "react";
import { Typography, Box } from "@material-ui/core";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Credential } from '../types'
import { useQuery } from '@apollo/react-hooks';
import { getCredential, CredentialData, CredentialVariables } from '../queries/credential'
import CredentialPostCard from './CredentialPostCard'
import { formatDistanceToNow } from "date-fns";
import { NavLink } from 'react-router-dom'


interface Props {
  credential: Credential
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 12,
    width: 12,
    marginRight: theme.spacing(1)
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  link: {
    textDecoration: 'none',
    color: theme.palette.text.secondary
  }
}));

function CredentialReactionCard(props: Props) {
  const classes = useStyles();
  const { credential } = props

  const liked = credential.claims.find(claim => claim.type === 'like')
  const disliked = credential.claims.find(claim => claim.type === 'dislike')

  const credentialId = liked ? liked.value : disliked?.value


  const { loading, error, data } = useQuery<CredentialData, CredentialVariables>(getCredential, { 
    variables: { id: credentialId || credential.id },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <p>Error :(</p>;

  return (
    <Box >
      <Box className={classes.row}>
        <NavLink to={'/identity/' + credential.issuer.did} className={classes.link}>
          {liked !== undefined && <ThumbUpIcon className={classes.icon} />}
          {disliked !== undefined && <ThumbDownIcon className={classes.icon} />}
          <Typography variant='caption' color='textSecondary' gutterBottom>{credential.issuer.name} {liked ? 'liked' : ''}{disliked ? 'disliked' : ''} {formatDistanceToNow(Date.parse(credential.issuanceDate))} ago</Typography>
        </NavLink>
      </Box>
      {loading && <LinearProgress />}
      {data?.credentials[0] && <CredentialPostCard credential={data?.credentials[0]} type={props.type}/>}
    </Box>
  );
}

export default CredentialReactionCard;