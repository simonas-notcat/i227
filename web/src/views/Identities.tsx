import React, { useEffect, useState } from "react";
import { List, ListItemAvatar, ListItemText } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialFAB from "../components/CredentialFAB";
import ListItemLink from "../components/Nav/ListItemLink";
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { IdentityProfile } from "../types";


function Identities(props: any) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ identities, setIdentities ] = useState<Array<IdentityProfile>>([])

  useEffect(() => {
    setLoading(true)
    agent.getAllIdentitiesWithProfiles()
    .then(setIdentities)
    .finally(() => setLoading(false))
  }, [agent])

  return (
    <Container maxWidth="sm">

      <AppBar title='Connections'>

      </AppBar>

     
      {loading && <LinearProgress />}
      <List >
      {identities.map(identity => (
        <ListItemLink to={'/identity/'+ identity.did} key={identity.did}>
          <ListItemAvatar>
          <Avatar
            src={identity.picture}
          />
          </ListItemAvatar>
          <ListItemText 
            primary={identity.name}
            secondary={identity.nickname} 
            />
        </ListItemLink>
        ))}
      </List>
      <CredentialFAB />
    </Container>
  );
}

export default Identities;