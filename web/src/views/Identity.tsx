import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Grid, Typography, ListItemAvatar, ListItemText, ListItem, makeStyles, Card, CardHeader, CardContent, CardActions, Button, IconButton, Collapse, useTheme, useMediaQuery, Box } from "@material-ui/core";
import { useParams } from "react-router-dom";

import Avatar from '@material-ui/core/Avatar';
import CredentialCard from '../components/CredentialCard'
import clsx from 'clsx';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getIdentity, IdentityData, IdentityVariables } from '../queries/identity'
import CredentialFAB from "../components/CredentialFAB";
import ProfileDialog from "../components/ProfileDialog"

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

  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const { loading, error, data } = useQuery<IdentityData, IdentityVariables>(getIdentity, { 
    variables: { did, take: 5 },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <p>Error :(</p>;

  return (
    <Container maxWidth="sm">
      {loading && <LinearProgress />}
      <Grid container spacing={4} justify="center">
        <Grid item xs={12}>
          <Card variant='outlined'>
            <CardContent className={classes.header}>

              <Avatar
                className={classes.avatar}
                src={data?.identity.picture}
                />
              <Typography variant='h5'>{data?.identity.name}</Typography>
              <Typography variant='h6'>{data?.identity.nickname}</Typography>
              {data?.identity.url && <Typography variant='body1'>{data?.identity.url}</Typography>}
              {data?.identity.email && <Typography variant='body2'>{data?.identity.email}</Typography>}
            </CardContent>
            <CardActions>
            
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: expanded,
              })}
              onClick={() => setExpanded(!expanded)}
              aria-expanded={expanded}
              aria-label="show more"
            >
              <ExpandMoreIcon />
            </IconButton>
            </CardActions>
            <Collapse in={expanded} timeout="auto" unmountOnExit >
              <Box className={classes.collapse}>

                <Typography variant='subtitle2' color='textSecondary'>{data?.identity.did}</Typography>
                <Button size="small" color="primary" onClick={handleOpenModal}>
                  Profile
                </Button>
              </Box>
            </Collapse>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h6'>Received ({data?.receivedCredentialsCount})</Typography>
        </Grid>

        {data?.receivedCredentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} />
          </Grid>
        ))}

        <Grid item xs={12}>
          <Typography variant='h6'>Sent( {data?.issuedCredentialsCount})</Typography>
        </Grid>
        {data?.issuedCredentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} />
          </Grid>
        ))}

      </Grid>
      <CredentialFAB subject={data?.identity.did} />
      {data?.identity && <ProfileDialog
        fullScreen={fullScreen}
        open={openModal}
        onClose={handleCloseModal}
        subject={data?.identity.did}
      />}
    </Container>
  );
}

export default Identity;