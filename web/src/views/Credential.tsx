import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Typography, makeStyles, Card, CardActions, IconButton, CardHeader, CardMedia } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCredential, CredentialData, CredentialVariables } from '../queries/credential'
import CredentialFAB from "../components/CredentialFAB";
import CredentialCard from "../components/CredentialCard";
import { formatDistanceToNow } from "date-fns";
import CardActionAreaLink from "../components/Nav/CardActionAreaLink";


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
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 100,
    },
    width: 150,
    height: 150,
    // marginTop: theme.spacing(2)
    alignSelf: 'center',
    margin: theme.spacing(2)
  },
  smallAvatar: {
    width: 28,
    height: 28,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    // justifyContent: 'space-between'
  },
  claim: {

    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center'
  },
  claimTextBox: {
    padding: theme.spacing(2),
    display: 'flex',
    flex: 1,
    // flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
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
      {credential !== undefined && <CredentialCard credential={credential} />}
      <CredentialFAB subject={credential?.subject.did} />
    </Container>
  );
}

export default Credential;