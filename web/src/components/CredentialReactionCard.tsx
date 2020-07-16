import React, { useState, useEffect } from "react";
import { Typography, Box } from "@material-ui/core";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from './CredentialCard'
import { formatDistanceToNow } from "date-fns";
import { NavLink } from 'react-router-dom'
import { VerifiableCredential } from "daf-core";
import { IdentityProfile } from "../types";
import { useAgent } from "../agent";

interface Props {
  credential: VerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
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
  const { credential, issuer } = props

  const liked = credential.credentialSubject['like'] !== undefined
  const disliked = credential.credentialSubject['dislike'] !== undefined

  const credentialId = liked ? credential.credentialSubject['like'] : credential.credentialSubject['dislike']
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ credentials, setCredentials ] = useState<Array<VerifiableCredential>>([])
  useEffect(() => {
    setLoading(true)
    agent.dataStoreORMGetVerifiableCredentials({      
      where: [ { column: 'id', value: [credentialId]}]
    })
    .then(result => {
      setCredentials(result)
    })
    .finally(() => setLoading(false))
  }, [agent, credentialId])
  
  return (
    <Box >
      <Box className={classes.row}>
        <NavLink to={'/identity/' + issuer.did} className={classes.link}>
          {liked && <ThumbUpIcon className={classes.icon} />}
          {disliked && <ThumbDownIcon className={classes.icon} />}
          <Typography variant='caption' color='textSecondary' gutterBottom>{issuer.name} {liked ? 'liked' : ''}{disliked ? 'disliked' : ''} {formatDistanceToNow(Date.parse(credential.issuanceDate))} ago</Typography>
        </NavLink>
      </Box>
      {loading && <LinearProgress />}
      {credentials[0] && <CredentialCard credential={credentials[0]} type={props.type}/>}
    </Box>
  );
}

export default CredentialReactionCard;