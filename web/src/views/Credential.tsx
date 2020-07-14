import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialFAB from "../components/CredentialFAB";
import CredentialCard from "../components/CredentialCard";
import AppBar from "../components/Nav/AppBar";
import { NavLink } from 'react-router-dom'
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Box, Grid } from "@material-ui/core";
import { formatDistanceToNow } from "date-fns";
import { useAgent } from '../agent'
import { VerifiableCredential } from 'daf-core'


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

  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ credentials, setCredentials ] = useState<Array<VerifiableCredential>>([])
  useEffect(() => {
    setLoading(true)
    agent.dataStoreORMGetVerifiableCredentials({      
      where: [ { column: 'id', value: [process.env.REACT_APP_HOST + '/c/' + id]}]
    })
    .then(setCredentials)
    .finally(() => setLoading(false))
  }, [agent])

  return (
    <Container maxWidth="sm">
      <AppBar/>
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {credentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} type='details' />
          </Grid>
        ))}
      </Grid>

    </Container>
  );
}

export default Credential;