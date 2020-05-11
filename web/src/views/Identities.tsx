import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { List, ListItemAvatar, ListItemText, Paper, IconButton, InputBase, makeStyles, Tabs, Tab } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentities, IdentitiesData } from '../queries/identities'
import CredentialFAB from "../components/CredentialFAB";
import ListItemLink from "../components/Nav/ListItemLink";
import AppBar from "../components/Nav/AppBar";


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
  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };


  const { loading, error, data } = useQuery<IdentitiesData>(getIdentities, {fetchPolicy: 'cache-and-network'});
  if (error) return <p>Error :(</p>;
  return (
    <Container maxWidth="sm">

      <AppBar title='Connections'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Connections" />
          <Tab label="All" />
        </Tabs>
      </AppBar>

      <Paper component="form" className={classes.root}>

        <InputBase
          className={classes.input}
          placeholder="Search"
          inputProps={{ 'aria-label': 'search google maps' }}
        />
        <IconButton type="submit" className={classes.iconButton} aria-label="search">
          <SearchIcon />
        </IconButton>
      </Paper>

      {loading && <LinearProgress />}
      
      <List >
      {data?.identities.map(identity => (
        <ListItemLink key={identity.did} to={'/identity/'+ identity.did}>
          <ListItemAvatar>
          <Avatar
           src={identity?.picture}
          />
          </ListItemAvatar>
          <ListItemText 
            primary={identity?.name} 
            secondary={identity?.nickname} 
            />
        </ListItemLink>
        ))}
      </List>
      <CredentialFAB />
    </Container>
  );
}

export default Identities;