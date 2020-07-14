import React, { useState, useEffect } from "react";
import { Grid, Typography, makeStyles, Card, CardContent, CardActions, Button, IconButton, Collapse, useTheme, useMediaQuery, Box, Tabs, Tab } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import CredentialCard from '../components/CredentialCard'
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialFAB from "../components/CredentialFAB";
import ProfileDialog from "../components/ProfileDialog"
import ServiceDialog from "../components/ServiceDialog"
import AppBar from "../components/Nav/AppBar";
import { VerifiableCredential } from "daf-core";
import { id } from "date-fns/locale";
import { useAgent } from "../agent";
import { IdentityProfile } from "../types";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  collapse: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2)
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
}));

function Identity(props: any) {
  const { did } = useParams<{ did: string }>()
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);
  const theme = useTheme();
  const { agent } = useAgent()
  const [ identity, setIdentity ] = useState<IdentityProfile | undefined>(undefined)
  const [ loading, setLoading ] = useState(false)
  const [ credentials, setCredentials ] = useState<Array<VerifiableCredential>>([])


  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [openProfileModal, setOpenProfileModal] = React.useState(false);
  const [openServiceModal, setOpenServiceModal] = React.useState(false);

  const handleOpenProfileModal = () => {
    setOpenProfileModal(true);
  };

  const handleCloseProfileModal = () => {
    setOpenProfileModal(false);
  };

  const handleOpenServiceModal = () => {
    setOpenServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setOpenServiceModal(false);
  };

  


  useEffect(() => {
    agent.getIdentityProfile({ did })
    .then(setIdentity)
  }, [agent])

  useEffect(() => {
    setLoading(true)
    agent.dataStoreORMGetVerifiableCredentials({      
      where: [ 
        { column: value === 0 ? 'issuer' : 'subject', value: [did] },
      ]
    })
    .then(setCredentials)
    .finally(() => setLoading(false))
  }, [agent, value])



  return (
    <Container maxWidth="sm">
      <AppBar title={identity?.name || ''}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Received" />
          <Tab label="Issued" />
        </Tabs>
      </AppBar>
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {credentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} type='summary' />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Identity;