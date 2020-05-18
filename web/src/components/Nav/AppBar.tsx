import React, { useEffect } from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, AppBar, Typography, Menu, MenuItem, Avatar, ListItemAvatar, ListItem, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useMobile } from './MobileProvider';
import { useAuth0 } from "../../react-auth0-spa";
import ListItemLink from './ListItemLink'
const drawerWidth = 240;


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      flexGrow: 1,
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
    box: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row'
    },
    avatar: {
      height: 24,
      width: 24
    }
  }),
);

export interface Props {
  title?: string
}

const AppBarTabs: React.FC<Props> = props => {
  const { children } = props
  const classes = useStyles();
  const { mobileOpen, setMobileOpen } = useMobile();
  const { user, isAuthenticated, loginWithPopup, logout, loading, getTokenSilently } = useAuth0();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentDid, setCurrentDid] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchCurrentDid = async () => {

      const token = await getTokenSilently()
      
      const response = await fetch(`https://i227.dev/auth0did`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'http://localhost:3000',
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: ''
      });
      
      const { did } = await response.json();
      if (did) {
        setCurrentDid(did)
      }
    }
    if (isAuthenticated) {
      fetchCurrentDid()
    }
      
  }, [isAuthenticated])

  const handleMenu = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <AppBar position="fixed" className={classes.appBar} color={'inherit'}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={()=> setMobileOpen(!mobileOpen)}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            {props.title}  
          </Typography>
          <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {(!isAuthenticated || loading) && <AccountCircle />}
                {!loading && isAuthenticated && <Avatar
                  className={classes.avatar}
                  src={user.picture}
                />}
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                {!loading && isAuthenticated && currentDid && <ListItemLink to={'/identity/' + currentDid} >
                  <ListItemAvatar>
                    <Avatar src={user.picture} />
                  </ListItemAvatar>
                  <ListItemText primary={user.nickname} secondary={user.name}/>
                </ListItemLink>}

                {isAuthenticated && <MenuItem onClick={logout}>Logout</MenuItem>}
                {!isAuthenticated && <MenuItem onClick={loginWithPopup}>Login</MenuItem>}
              </Menu>
            </div>
        </Toolbar>

            {children}
      </AppBar>
  )
}

export default AppBarTabs
