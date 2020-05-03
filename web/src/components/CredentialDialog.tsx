import React from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../react-auth0-spa";
import { Dialog, DialogTitle, DialogContent, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, DialogActions } from "@material-ui/core";

interface Props {
  fullScreen: boolean,
  open: boolean,
  onClose: any
}

function CredentialDialog(props: Props) {
  const { getTokenSilently, user, isAuthenticated, loginWithRedirect } = useAuth0();

  const callApi = async () => {
    try {
      const token = await getTokenSilently();

      console.log({token})

      const response = await fetch(`https://i227.dev/sign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: 'http://localhost:3000',
        },
        mode: 'cors'
      });

      console.log('AAAA')

      const responseData = await response.json();

      console.log({responseData})
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

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
          />



        <FormControl component="fieldset">
          <FormLabel component="legend">Kudos award <span role="img" aria-label="award">🏆</span></FormLabel>
          <RadioGroup aria-label="gender" name="gender1" 
          // value={value} onChange={handleChange}
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