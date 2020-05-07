import React from "react";
import { Grid, makeStyles, Typography, Button } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import { services } from '../utils/services'
import CredentialFAB from "../components/CredentialFAB";
import { useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  avatar: {
    width: 150,
    height: 150,
  },
}));

function Service(props: any) {
  const classes = useStyles();
  const { id } = useParams<{ id: string }>()
  const service = services.find(s => s.id === id)
  if (!service) throw Error('Service not found')

  return (
    <Container maxWidth="md">
      <Grid container spacing={2} justify="center">
        <Grid item xs={12} sm={3}>
          <Avatar
            src={service.picture}
            className={classes.avatar}
          />
        </Grid>
        <Grid item xs={12} sm={9}>
          <Typography variant={'h4'}>{service.title}</Typography>
          <Typography variant={'h5'} gutterBottom>{service.subtitle}</Typography>
          <Typography variant='body1'>{service.description}</Typography>
          <Button color='primary' variant="contained"  href={service.url}>Open</Button>
        </Grid>
      </Grid>
      <CredentialFAB />
    </Container>
  );
}

export default Service;