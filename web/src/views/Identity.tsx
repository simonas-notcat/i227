import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid, Typography, ListItemAvatar, ListItemText, ListItem } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import CredentialCard from '../components/CredentialCard'

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentity, IdentityData, IdentityVariables } from '../queries/identity'
import CredentialFAB from "../components/CredentialFAB";

function Identity(props: any) {
  const { did } = useParams<{ did: string }>()

  const { loading, error, data } = useQuery<IdentityData, IdentityVariables>(getIdentity, { 
    variables: { did, take: 5 },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      {loading && <LinearProgress />}
      <Grid container spacing={4} justify="center">
        <Grid item xs={12}>
          <ListItem>

            <ListItemAvatar>
              <Avatar
              src={data?.identity.picture}
              />
            </ListItemAvatar>
            <ListItemText 
              primary={data?.identity.name} 
              secondary={data?.identity?.nickname} 
              />
            </ListItem>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h6'>Received ({data?.receivedCredentialsCount})</Typography>
        </Grid>

        {data?.receivedCredentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Typography variant='h6'>Sent( {data?.issuedCredentialsCount})</Typography>
        </Grid>
        {data?.issuedCredentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} />
          </Grid>
        ))}

      </Grid>
      <CredentialFAB subject={data?.identity.did} />
    </Container>
  );
}

export default Identity;