import React from "react";
import { ListItemAvatar, ListItemText, Grid, Card, Tabs, Tab } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import ListItemLink from "../components/Nav/ListItemLink";
import { services } from '../utils/services'
import { Service } from "../types";
import AppBar from "../components/Nav/AppBar";

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

  const [value, setValue] = React.useState(0);

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };


  return (
    <Container maxWidth="md">
      <AppBar title='Marketplace'>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Available" />
          <Tab label="Coming soon" />
        </Tabs>
      </AppBar>

      <Grid container spacing={2} justify="center" >
        {services.filter(s => s.available === (value === 0)).map(service => (
          <ServiceBox key={service.id} service={service} />
        ))}
      </Grid>

    </Container>
  );
}



export default Marketplace;