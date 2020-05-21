import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCredential, CredentialData, CredentialVariables } from '../queries/credential'
import CredentialFAB from "../components/CredentialFAB";
import CredentialCard from "../components/CredentialCard";
import AppBar from "../components/Nav/AppBar";
import { NavLink } from 'react-router-dom'
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box } from "@material-ui/core";
import { formatDistanceToNow } from "date-fns";

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
    display: 'flex',
    textDecoration: 'none',
    color: theme.palette.text.secondary
  },
  reactions: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: theme.spacing(2)
  }
}));

function Credential(props: any) {
  const { id } = useParams<{ id: string }>()
  const classes = useStyles();
  const { loading, error, data } = useQuery<CredentialData, CredentialVariables>(getCredential, { 
    variables: { id },
    fetchPolicy: 'no-cache'
  });

  if (error) return <p>Error :(</p>;

  const credential = data?.credentials[0]

  return (
    <Container maxWidth="sm">
      <AppBar/>
      {loading && <LinearProgress />}
      {credential !== undefined && <CredentialCard credential={credential} type='details' />}
      <Box className={classes.reactions}>
      {data?.reactions.map(reaction => (<NavLink to={'/identity/' + reaction.issuer.did} className={classes.link}>
          {reaction.type === 'like' && <ThumbUpIcon className={classes.icon} />}
          {reaction.type === 'dislike' && <ThumbDownIcon className={classes.icon} />}
          <Typography variant='caption' color='textSecondary' gutterBottom>{reaction.issuer.name} {reaction.type === 'like' ? 'liked' : 'disliked'} {formatDistanceToNow(Date.parse(reaction.issuanceDate))} ago</Typography>
        </NavLink>))}
      </Box>

      <CredentialFAB subject={credential?.subject.did} />
    </Container>
  );
}

export default Credential;