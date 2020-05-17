import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Toolbar, IconButton, AppBar, Typography, Menu, MenuItem, Avatar, ListItemAvatar, ListItem, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useMobile } from './MobileProvider';
import { useAuth0 } from "../../react-auth0-spa";

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
  const { user, isAuthenticated, loginWithPopup, logout, loading } = useAuth0();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

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
                {!loading && isAuthenticated && <ListItem button >
                  <ListItemAvatar>
                    <Avatar src={user.picture} />
                  </ListItemAvatar>
                  <ListItemText primary={user.nickname} secondary={user.name}/>
                </ListItem>}

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
