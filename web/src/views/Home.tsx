import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid, Tabs, Tab } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from '../components/CredentialCard'
import { getLatestPosts, LatestPostsData, LatestPostsVariables } from '../queries/latestPosts'
import CredentialFAB from "../components/CredentialFAB";
import AppBar from "../components/Nav/AppBar";

function Home(props: any) {

  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };



  const { loading, error, data } = useQuery<LatestPostsData, LatestPostsVariables>(getLatestPosts, { 
    fetchPolicy: 'cache-and-network',
    variables: {
      take: 10,
      skip: 0
    }
  });


  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      <AppBar title='Activity'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="All" />
          <Tab label="Connections" />
          <Tab label="My" />
        </Tabs>
      </AppBar>
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {data?.credentials.map(credential => (
          <Grid item key={credential.hash} xs={12}>
            <CredentialCard credential={credential} type='summary' />
          </Grid>
        ))}
      </Grid>
      <CredentialFAB />
    </Container>
  );
}

export default Home;