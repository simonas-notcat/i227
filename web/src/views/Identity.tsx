import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid, Typography } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentity, IdentityData, IdentityVariables } from '../queries/identity'

function Identity(props: any) {
  const { did } = useParams<{ did: string }>()

  const { loading, error, data } = useQuery<IdentityData, IdentityVariables>(getIdentity, { variables: { did, take: 3 }});

  if (loading) return <LinearProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      <Grid container spacing={4} justify="center">
        <Avatar src={data?.identity.profileImage} />
        <Typography component='h1'>{data?.identity.name}</Typography>

      </Grid>
    </Container>
  );
}

export default Identity;