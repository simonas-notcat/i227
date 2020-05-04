import React from "react";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useAuth0 } from "../react-auth0-spa";
import { List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
import LockOpenIcon from '@material-ui/icons/LockOpen';
interface Props {
}

function AuthBox(props: Props) {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <ListItem button onClick={() => logout()}>

      <ListItemAvatar>
          <Avatar
           src={user.picture}
           />
          </ListItemAvatar>
          <ListItemText primary={user.nickname} secondary={user.name}/>
      </ListItem>

    );
  } else {
    return (
      <ListItem button onClick={() => loginWithRedirect({})}>
        <ListItemIcon><LockOpenIcon /></ListItemIcon>
        <ListItemText primary={'Login'} />
      </ListItem>
    )
  }

}

export default AuthBox;