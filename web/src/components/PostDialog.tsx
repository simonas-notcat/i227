import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../react-auth0-spa";
import { useAgent } from "../agent";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent,  DialogActions, makeStyles, TextField } from "@material-ui/core";
import shortId from 'shortid'

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

function PostDialog(props: Props) {
  const classes = useStyles()
  const history = useHistory()
  const { getTokenWithPopup, getTokenSilently, isAuthenticated } = useAuth0()
  const { agent, authenticatedDid } = useAgent()
  const [comment, setComment] = useState<string|undefined>('')


  const callApi = async () => {
    try {
      if (!authenticatedDid) {
        throw Error('Not authenticated')
      }
      const uniqId = shortId.generate()
      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: authenticatedDid },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Post'],
          issuanceDate: new Date().toISOString(),
          id: process.env.REACT_APP_HOST + '/c/' + uniqId,
          credentialSubject: {
            id: authenticatedDid,
            comment,
          },
        },
        save: true,
        proofFormat: 'jwt',
      })
      
      props.onClose()
      history.push('/c/'+ uniqId)

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
        <DialogTitle id="responsive-dialog-title">Create new Tweet</DialogTitle>
        <DialogContent>
        <form className={classes.form} noValidate>

        <TextField
            id="comment"
            label="Tweet"
            type="text"
            multiline
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
          />
        </form>

        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={props.onClose} color="default">
            Cancel
          </Button>
          <Button onClick={callApi} color="primary" autoFocus>
            Tweet
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default PostDialog;