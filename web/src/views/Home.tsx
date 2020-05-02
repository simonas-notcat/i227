import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from '../components/CredentialCard'
import { getLatestKudos, LatestKudosData } from '../queries/latestKudos'

function Home(props: any) {
  const { loading, error, data } = useQuery<LatestKudosData>(getLatestKudos);

  if (loading) return <LinearProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      <Grid container spacing={2} justify="center">
        {data?.claims.map(claim => (
          <Grid item key={claim.credential.id} xs={12}>
            <CredentialCard key={claim.credential.id} claim={claim} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;