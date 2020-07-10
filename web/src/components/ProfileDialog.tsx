import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../react-auth0-spa";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, LinearProgress, makeStyles, TextField } from "@material-ui/core";
// import { getIdentity, IdentityData, IdentityVariables } from '../queries/identity'

interface Props {
  fullScreen: boolean,
  open: boolean,
  onClose: any,
  subject: string
}

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    // width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing(2),
    minWidth: 120,
  },
  select: {
    height: '48px',
    display: 'flex',
    alignItems: 'center',
  },
  avatar: {
    marginTop: theme.spacing(2),
    height: 30,
    width: 30,
  },
  formControlLabel: {
    marginTop: theme.spacing(1),
  },
}));

function ProfileDialog(props: Props) {
  const classes = useStyles()
  const history = useHistory()
  const { getTokenWithPopup, getTokenSilently, isAuthenticated } = useAuth0()
  const [name, setName] = useState<string|undefined>('')
  const [nickname, setNickname] = useState<string|undefined>('')
  const [email, setEmail] = useState<string|undefined>('')
  const [url, setUrl] = useState<string|undefined>('')

  // const { loading, error, data } = useQuery<IdentityData, IdentityVariables>(getIdentity, {variables: {did: props.subject, take: 0, type: []}});
  // useEffect(() => {
  //   if(data) {
  //     setName(data.identity.name)
  //     setNickname(data.identity.nickname)
  //     setEmail(data.identity.email)
  //     setUrl(data.identity.url)
  //   }
  // },[data])


  // if (loading) return <LinearProgress />;
  // if (error) return <p>Error :(</p>;

  const saveProfileInfo = async () => {
    try {
      const token = isAuthenticated ? await getTokenSilently() : await getTokenWithPopup();

      const data = {
        type: 'Profile',
        credentialSubject: {
          id: props.subject,
        }
      } as { type: string, credentialSubject: {
        name?: string,
        nickname?: string,
        url?: string,
        email?: string
      }}

      if (name) data.credentialSubject['name'] = name
      if (nickname) data.credentialSubject['nickname'] = nickname
      if (url) data.credentialSubject['url'] = url
      if (email) data.credentialSubject['email'] = email

      const response = await fetch(`${process.env.REACT_APP_HOST}/sign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: `${process.env.REACT_APP_HOST}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors',
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      props.onClose()
      history.push('/c/'+ responseData.id)

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog
        fullScreen={props.fullScreen}
        open={props.open}
        onClose={props.onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">Update profile information</DialogTitle>
        <DialogContent>
        <form className={classes.form}>

          <TextField
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            id="nickname"
            label="Nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            fullWidth
          />

          <TextField
            id="url"
            label="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
          />

          <TextField
            id="email"
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        </form>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClose} color="default">
            Cancel
          </Button>
          <Button onClick={saveProfileInfo} color="primary" autoFocus>
            Sign
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default ProfileDialog;