import React from "react";
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

  
  let type = [
    'VerifiableCredential,Post',
    'VerifiableCredential,Reaction',
    'VerifiableCredential,Profile',
    'VerifiableCredential,Service',
  ]
  switch (value) {
    case 0: 
    break
    case 1: 
      type = ['VerifiableCredential,Post']
    break
    case 2: 
      type = ['VerifiableCredential,Profile']
    break
    case 3: 
      type = ['VerifiableCredential,Reaction']
    break
    case 4: 
      type = ['VerifiableCredential,Service']
    break
  }

  // const { loading, error, data } = useQuery<IdentityData, IdentityVariables>(getIdentity, { 
  //   variables: { did, take: 5, type },
  //   fetchPolicy: 'no-cache'
  // });

  // if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      
    </Container>
  );
}

export default Identity;