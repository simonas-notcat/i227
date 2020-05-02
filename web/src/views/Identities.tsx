import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionAreaLink from "../components/CardActionAreaLink";

import Avatar from '@material-ui/core/Avatar';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentities, IdentitiesData } from '../queries/identities'

function Identities(props: any) {
  const { loading, error, data } = useQuery<IdentitiesData>(getIdentities);

  if (loading) return <LinearProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      <Grid container spacing={4} justify="center">
        {data?.identities.map(identity => (
          <Grid item key={identity.did}>
            <Card>
              <CardActionAreaLink to={'/identity/' + identity.did}>
              <CardHeader
                avatar={
                  <Avatar src={identity.profileImage} />
                }
                title={`${identity.name}`}
              />
              </CardActionAreaLink>
            </Card>
          </Grid>
        ))}
        
      </Grid>
    </Container>
  );
}

export default Identities;