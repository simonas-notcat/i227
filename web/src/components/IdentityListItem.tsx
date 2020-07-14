import React, { useEffect, useState } from "react";
import { List, ListItemAvatar, ListItemText, Paper, IconButton, InputBase, makeStyles, Tabs, Tab } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialFAB from "../components/CredentialFAB";
import ListItemLink from "../components/Nav/ListItemLink";
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { IIdentity } from 'daf-core'
import { IdentityProfile } from "../types";


function Identities(props: { did: string }) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ identity, setIdentity ] = useState<IdentityProfile|null>(null)

  useEffect(() => {
    setLoading(true)
    agent.getIdentityProfile({did: props.did})
      .then(setIdentity)
      .finally(() => setLoading(false))
  }, [agent])

  if (loading || !identity) {
    return (<LinearProgress />)
  }

  return (
    <ListItemLink to={'/identity/'+ identity.did}>
      <ListItemAvatar>
      <Avatar
        src={identity?.picture}
      />
      </ListItemAvatar>
      <ListItemText 
        primary={identity.name}
        secondary={identity.nickname} 
        />
    </ListItemLink>
  );
}

export default Identities;