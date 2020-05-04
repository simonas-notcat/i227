import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import CredentialCard from '../components/CredentialCard'

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentity, IdentityData, IdentityVariables } from '../queries/identity'
import CredentialFAB from "../components/CredentialFAB";

function Identity(props: any) {
  const { did } = useParams<{ did: string }>()

  const { loading, error, data } = useQuery<IdentityData, IdentityVariables>(getIdentity, { variables: { did, take: 5 }});

  if (loading) return <LinearProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      <Grid container spacing={4} justify="center">
        <Grid item xs={12}>

        <Avatar src={data?.identity.profileImage} />
        <Typography component='h1'>{data?.identity.name}</Typography>
        </Grid>

        <Typography component='h1'>Received ({data?.receivedCredentialsCount})</Typography>

        {data?.receivedCredentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} />
          </Grid>
        ))}

        <Typography component='h1'>Sent( {data?.issuedCredentialsCount})</Typography>

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