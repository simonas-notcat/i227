import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import LinearProgress from '@material-ui/core/LinearProgress';
import { useAgent } from "../agent";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent,  DialogActions, makeStyles, TextField, FormControl, InputLabel, Select, MenuItem, Avatar, ListItemText, ListItemAvatar } from "@material-ui/core";
import shortId from 'shortid'
import { IdentityProfile } from "../types";

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
  const { agent, authenticatedDid } = useAgent()
  const [comment, setComment] = useState<string|undefined>('')
  const [subject, setSubject] = useState<string|undefined>(props.subject)
  const [ loading, setLoading ] = useState(false)
  const [ identities, setIdentities ] = useState<Array<IdentityProfile>>([])

  useEffect(() => {
    setLoading(true)
    agent.getAllIdentitiesWithProfiles()
    .then(setIdentities)
    .finally(() => setLoading(false))
  }, [agent])


  const callApi = async () => {
    try {
      if (!authenticatedDid || !subject) {
        throw Error('Not authenticated')
      }
      const uniqId = shortId.generate()
      await agent.createVerifiableCredential({
        credential: {
          issuer: { id: authenticatedDid },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Post'],
          issuanceDate: new Date().toISOString(),
          id: process.env.REACT_APP_HOST + '/c/' + uniqId,
          credentialSubject: {
            id: subject || authenticatedDid,
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
        <DialogTitle id="responsive-dialog-title">Create new Post</DialogTitle>
        <DialogContent>
        <form className={classes.form} noValidate>
        {loading && <LinearProgress />}
        {identities && <FormControl className={classes.formControl}>
          <InputLabel id="demo-simple-select-label">Subject</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={subject}
            onChange={(event) => setSubject(event.target.value as string)}
          >
            {identities.map(identity => (
              <MenuItem value={identity.did} key={identity.did}>
                <ListItemAvatar>
                  <Avatar src={identity.picture} />
                </ListItemAvatar>
                <ListItemText primary={identity.name} secondary={identity.nickname} />
              </MenuItem>
            ))}

          </Select>
        </FormControl>}




        <TextField
            id="comment"
            label="Comment"
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