import React from "react";
import { ListItemAvatar, ListItemText, Grid, Card, Typography } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import ListItemLink from "../components/Nav/ListItemLink";
import { services } from '../utils/services'
import { Service } from "../types";

interface ServiceBoxProps {
  service: Service
}
function ServiceBox(props: ServiceBoxProps) {
  const { service } = props
  return (
  <Grid item key={service.id} xs={12} md={6}>
    <Card elevation={2}>
      <ListItemLink to={'/s/'+ service.id}>
        <ListItemAvatar>
          <Avatar
          src={service.picture}
          />
        </ListItemAvatar>
        <ListItemText 
          primary={service.title} 
          secondary={service.subtitle} 
          />
      </ListItemLink>
    </Card>
  </Grid>)
}


function Marketplace(props: any) {

  return (
    <Container maxWidth="md">
      <Typography variant="h6" >Available</Typography>
      <Grid container spacing={2} justify="center" >
        {services.filter(s => s.available).map(service => (
          <ServiceBox key={service.id} service={service} />
        ))}
      </Grid>

      <Typography variant="h6" >Coming soon</Typography>
      <Grid container spacing={2} justify="center">
        {services.filter(s => !s.available).map(service => (
          <ServiceBox key={service.id} service={service} />
        ))}
      </Grid>

    </Container>
  );
}



export default Marketplace;