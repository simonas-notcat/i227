import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../react-auth0-spa";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, DialogActions, LinearProgress, InputLabel, Select, MenuItem, makeStyles, Avatar, List, ListItem, ListItemAvatar, ListItemText } from "@material-ui/core";

interface Props {
  fullScreen: boolean,
  open: boolean,
  onClose: any,
  subject?: string
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

function CredentialDialog(props: Props) {
  const classes = useStyles()
  const history = useHistory()
  const { getTokenWithPopup, getTokenSilently, isAuthenticated } = useAuth0()
  const [kudos, setKudos] = useState<string|null>(null)
  const [subject, setSubject] = useState<string|undefined>(props.subject)

  // const { loading, error, data } = useQuery<IdentitiesData>(getIdentities);

  // const identity = (data?.identities && subject) ? data.identities.find(i=>i.did === subject) : null
  // if (loading) return <LinearProgress />;
  // if (error) return <p>Error :(</p>;

  const callApi = async () => {
    try {
      const token = isAuthenticated ? await getTokenSilently() : await getTokenWithPopup();

      const data = {
        type: 'Post',
        credentialSubject: {
          id: subject,
          kudos
        }
      }

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
        <DialogTitle id="responsive-dialog-title">Create new Verifiable Credential</DialogTitle>
        <DialogContent>
        <form className={classes.form} noValidate>

        {!subject && <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Subject</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={subject}
            onChange={(event) => setSubject(event.target.value as string)}
          >
            {/* {data?.identities.map(identity => (
              <MenuItem value={identity.did} key={identity.did}>
                <Avatar src={identity.picture}/>
                {identity.name}
              </MenuItem>
            ))} */}

          </Select>
        </FormControl> }

      {/* {identity !== null && <List >
        <ListItem>
          <ListItemAvatar>
          <Avatar
           src={identity?.picture}
          />
          </ListItemAvatar>
          <ListItemText 
            primary={identity?.name} 
            secondary={identity?.nickname} 
            />
        </ListItem>
      </List>} */}


        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Kudos award <span role="img" aria-label="award">🏆</span></FormLabel>
          <RadioGroup aria-label="gender" name="gender1" 
            value={kudos} onChange={(event) => setKudos(event.target.value)}
          >
            <FormControlLabel value="Thank you" control={<Radio />} label="Thank you" />
            <FormControlLabel value="Going Above and Beyond" control={<Radio />} label="Going Above and Beyond" />
            <FormControlLabel value="Inspirational Leader" control={<Radio />} label="Inspirational Leader" />
            <FormControlLabel value="Team Player" control={<Radio />} label="Team Player" />
            <FormControlLabel value="Great Job" control={<Radio />} label="Great Job" />
            <FormControlLabel value="Making Work Fun" control={<Radio />} label="Making Work Fun" />
            <FormControlLabel value="Amazing Mentor" control={<Radio />} label="Amazing Mentor" />
            <FormControlLabel value="Outside the Box Thinker" control={<Radio />} label="Outside the Box Thinker" />
            <FormControlLabel value="Great Presentation" control={<Radio />} label="Great Presentation" />
            <FormControlLabel value="Making an Impact" control={<Radio />} label="Making an Impact" />
          </RadioGroup>
        </FormControl>
        </form>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClose} color="default">
            Cancel
          </Button>
          <Button onClick={callApi} color="primary" autoFocus>
            Sign
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default CredentialDialog;