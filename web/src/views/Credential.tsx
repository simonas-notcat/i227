import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Typography, makeStyles, Card, CardContent, CardActions, IconButton } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ShareIcon from '@material-ui/icons/Share';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCredential, CredentialData, CredentialVariables } from '../queries/credential'
import CredentialFAB from "../components/CredentialFAB";
import { formatDistanceToNow } from "date-fns";
import { NavLink } from 'react-router-dom'


const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(2)
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.text.secondary
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 100,
    height: 100,
    marginTop: theme.spacing(2)
  },
  smallAvatar: {
    width: 28,
    height: 28,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

function Credential(props: any) {
  const { id } = useParams<{ id: string }>()
  const classes = useStyles();

  const { loading, error, data } = useQuery<CredentialData, CredentialVariables>(getCredential, { 
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <p>Error :(</p>;

  const credential = data?.credentials[0]

  return (
    <Container maxWidth="sm">
      {loading && <LinearProgress />}
      {credential !== undefined && <Card elevation={3}>
      <CardContent>
        <div className={classes.root}>
          <div className={classes.details}>
            {credential.claims.map(claim => (<CardContent className={classes.content} key={claim.hash}>
              {/* <Typography gutterBottom variant="h6" component="h2">
                {claim.type}
              </Typography> */}
              <Typography gutterBottom variant="h5" component="h2">
                {claim.value}
              </Typography>
              <Typography component="p">{credential.subject.name}</Typography>
            </CardContent>))}
            
            
          </div>
          <NavLink to={'/identity/'+credential.subject.did}>

          <Avatar
            variant="rounded" 
            className={classes.cover}
            // component="img"
            src={credential.subject.picture}
            />
            </NavLink>
        </div>
      </CardContent>
      <CardActions className={classes.actions} >
        <div className={classes.row}>
          <NavLink to={'/identity/'+credential.issuer.did}>
          <Avatar
            variant="rounded" 
            src={credential.issuer.picture}
            className={classes.smallAvatar}
            />
          </NavLink>
          <Typography variant="caption">{credential.issuer.nickname} | {formatDistanceToNow(Date.parse(credential.issuanceDate))} ago</Typography>
        </div>
        <div>
        <IconButton aria-label="add to favorites">
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        </div>
      </CardActions>
    </Card>}
      <CredentialFAB subject={credential?.subject.did} />
    </Container>
  );
}

export default Credential;