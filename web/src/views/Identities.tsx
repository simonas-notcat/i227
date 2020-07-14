import React, { useEffect, useState } from "react";
import { List, ListItemAvatar, ListItemText, Paper, IconButton, InputBase, makeStyles, Tabs, Tab } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialFAB from "../components/CredentialFAB";
import IdentityListItem from "../components/IdentityListItem";
import ListItemLink from "../components/Nav/ListItemLink";
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { IIdentity } from 'daf-core'

interface IdentityProfile {
  did: string
  name?: string
  nickname?: string
  picture?: string
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    // width: 400,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },

}));


function Identities(props: any) {
  const classes = useStyles();
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ identities, setIdentities ] = useState<Array<IIdentity>>([])

  useEffect(() => {
    setLoading(true)
    agent.dataStoreORMGetIdentities()
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
        <IdentityListItem key={identity.did} did={identity.did} />
        ))}
      </List>
      <CredentialFAB />
    </Container>
  );
}

export default Identities;