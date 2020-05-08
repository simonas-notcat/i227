import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from '../components/CredentialCard'
import { getLatestPosts, LatestPostsData, LatestPostsVariables } from '../queries/latestPosts'
import CredentialFAB from "../components/CredentialFAB";

function Home(props: any) {
  const { loading, error, data } = useQuery<LatestPostsData, LatestPostsVariables>(getLatestPosts, { 
    fetchPolicy: 'cache-and-network',
    variables: {
      take: 40,
      skip: 0
    }
  });

  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {data?.credentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} />
          </Grid>
        ))}
      </Grid>
      <CredentialFAB />
    </Container>
  );
}

export default Home;