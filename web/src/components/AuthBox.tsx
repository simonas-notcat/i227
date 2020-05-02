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

interface Props {
}

function AuthBox(props: Props) {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  if (isAuthenticated) {
    return (
      <Card>
        <CardActionArea>
          <CardMedia 
            component="img"
            image={user.picture} />

          <CardHeader
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={`${user.nickname}`}
            subheader={`${user.name}`}
          />
          <CardActions>
            <Button size="small" color="primary" onClick={() => logout()}>
              Logout
            </Button>
          </CardActions>
          
        </CardActionArea>
      </Card>
    );
  } else {
    return (
      <Card>
      <CardActionArea>
        <Button onClick={() => loginWithRedirect({})}>Login</Button>
       
        
      </CardActionArea>
    </Card>
    )
  }

}

export default AuthBox;