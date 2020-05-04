import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActionAreaLink from "../components/CardActionAreaLink";

import Avatar from '@material-ui/core/Avatar';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentities, IdentitiesData } from '../queries/identities'
import CredentialFAB from "../components/CredentialFAB";
import ListItemLink from "../components/ListItemLink";

function Identities(props: any) {
  const { loading, error, data } = useQuery<IdentitiesData>(getIdentities);

  if (loading) return <LinearProgress />;
  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      <List >
      {data?.identities.map(identity => (
        <ListItemLink key={identity.did} to={'/identity/'+ identity.did}>
          <ListItemAvatar>
          <Avatar
           src={identity?.profileImage}
          />
          </ListItemAvatar>
          <ListItemText primary={identity?.name} />
        </ListItemLink>
        ))}
      </List>
      <CredentialFAB />
    </Container>
  );
}

export default Identities;