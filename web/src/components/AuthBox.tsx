import React from "react";
import { useAuth0 } from "../react-auth0-spa";
import { ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar } from "@material-ui/core";
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