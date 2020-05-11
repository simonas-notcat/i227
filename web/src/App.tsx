import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PeopleIcon from '@material-ui/icons/People';
import DashboardIcon from '@material-ui/icons/Dashboard';
import StoreIcon from '@material-ui/icons/Store';
import { useMobile } from './components/Nav/MobileProvider';

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {
  Route,
  Redirect,
  Switch,
  useRouteMatch
} from 'react-router-dom' 

import Home from './views/Home'
import Identities from './views/Identities'
import Identity from './views/Identity'
import Credential from './views/Credential'
import Marketplace from './views/Marketplace'
import Service from './views/Service'
import ListItemLink from './components/Nav/ListItemLink'

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    fab: {
      position: 'fixed',
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    appBar: {
      [theme.breakpoints.up('sm')]: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
      },
    },
    menuButton: {
      marginRight: theme.spacing(2),
      [theme.breakpoints.up('sm')]: {
        display: 'none',
      },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
      width: drawerWidth,
    },
    content: {
      flexGrow: 1,
      paddingTop: theme.spacing(8),
    },
  }),
);


export default function ResponsiveDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const { mobileOpen, setMobileOpen } = useMobile();
  const homeMatch = useRouteMatch("/home");
  const identitiesMatch = useRouteMatch("/identities");
  const identityMatch = useRouteMatch("/identity/:did");
  const marketPlaceMatch = useRouteMatch("/marketplace");
  const serviceMatch = useRouteMatch("/s/:id");
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <List>
      <Divider />
        
        <ListItemLink to={'/home'} 
          selected={homeMatch !== null}
          >
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary={'Activity'} />
        </ListItemLink>
        <ListItemLink 
          to={'/marketplace'}
          selected={marketPlaceMatch !== null || serviceMatch !== null}
        >
          <ListItemIcon><StoreIcon /></ListItemIcon>
          <ListItemText primary={'Marketplace'} />
        </ListItemLink>
        <ListItemLink
          to={'/identities'}
          selected={identitiesMatch !== null || identityMatch !== null}
          >
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary={'Connections'} />
        </ListItemLink>

      </List>
    </div>
  );

  const container = window.document.body

  return (
    <div className={classes.root}>
      <CssBaseline />

      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route path={'/home'} component={Home} />
          <Route path={'/identities'} component={Identities} />
          <Route path={'/identity/:did'} component={Identity} />
          <Route path={'/c/:id'} component={Credential} />
          <Route path={'/marketplace'} component={Marketplace} />
          <Route path={'/s/:id'} component={Service} />
        </Switch>
      </main>
    </div>
  );
}