import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ContactsIcon from '@material-ui/icons/Contacts';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import LinearProgress from '@material-ui/core/LinearProgress';
import Toolbar from '@material-ui/core/Toolbar';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';

import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles';
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom' 

import { useAuth0 } from "./react-auth0-spa";

import Home from './views/Home'
import Identities from './views/Identities'
import Identity from './views/Identity'
import ListItemLink from './components/ListItemLink'
import AuthBox from './components/AuthBox'
import CredentialDialog from './components/CredentialDialog'
import { useMediaQuery } from '@material-ui/core';

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
      paddingTop: theme.spacing(3),
    },
  }),
);


export default function ResponsiveDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { loading } = useAuth0();

  const [openModal, setOpenModal] = React.useState(false);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <AuthBox />
      <Divider />
      <List>
        
        <ListItemLink to={'/home'}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary={'Home'} />
        </ListItemLink>
        <ListItemLink to={'/identities'}>
          <ListItemIcon><ContactsIcon /></ListItemIcon>
          <ListItemText primary={'Identities'} />
        </ListItemLink>

      </List>
    </div>
  );

  const container = window.document.body

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <BrowserRouter>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            i227
          </Typography>
        </Toolbar>
      </AppBar>
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
        </Switch>
      </main>
      <Fab color="primary" aria-label="New" className={classes.fab} onClick={handleOpenModal}>
        <AddIcon />
      </Fab>
      <CredentialDialog
        fullScreen={fullScreen}
        open={openModal}
        onClose={handleCloseModal}
      />
        
    </div>
    </BrowserRouter>
  );
}