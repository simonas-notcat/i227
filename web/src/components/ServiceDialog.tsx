import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../react-auth0-spa";
import { useHistory } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, DialogActions, makeStyles, TextField, FormControl, FormGroup, FormControlLabel, Paper, Chip, Typography } from "@material-ui/core";
import Switch from '@material-ui/core/Switch';

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
    minWidth: 400,
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

  root: {
    display: 'flex',
    // justifyContent: 'center',
    flexWrap: 'wrap',
    listStyle: 'none',
    padding: theme.spacing(0.5),
    margin: 0,
  },
  chip: {
    margin: theme.spacing(0.5),
  },
}));

function ProfileDialog(props: Props) {
  const classes = useStyles()
  const history = useHistory()
  const { getTokenWithPopup, getTokenSilently, isAuthenticated } = useAuth0()
  const [name, setName] = useState<string|undefined>('')
  const [description, setDescription] = useState<string|undefined>('')
  const [available, setAvailable] = useState<boolean>(false)
  const [url, setUrl] = useState<string|undefined>('')
  
  const [chipData, setChipData] = React.useState([
    { key: 1, label: 'Diploma' },
    { key: 2, label: 'ClubMember' },
    { key: 3, label: 'Customer' },
  ]);

  const [selectedChipData, setSelectedChipData] = React.useState([
    { key: 0, label: 'Profile' },
  ]);

  const handleDelete = (chipToDelete: any) => () => {
    setSelectedChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    setChipData([...chipData, chipToDelete]);
  };

  const handleSelect = (chipToDelete: any) => () => {
    setChipData((chips) => chips.filter((chip) => chip.key !== chipToDelete.key));
    setSelectedChipData([...selectedChipData, chipToDelete]);
  };




  const saveProfileInfo = async () => {
    try {
      const token = isAuthenticated ? await getTokenSilently() : await getTokenWithPopup();

      const data = {
        type: 'Service',
        credentialSubject: {
          id: props.subject,
        }
      } as { type: string, credentialSubject: {
        name?: string,
        description?: string,
        url?: string,
        available?: boolean,
        consumes?: string[]
      }}

      if (name) data.credentialSubject['name'] = name
      if (description) data.credentialSubject['description'] = description
      if (url) data.credentialSubject['url'] = url
      if (available) data.credentialSubject['available'] = available
      if (selectedChipData.length>0) data.credentialSubject['consumes'] = selectedChipData.map(chip => chip.label)

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
        <DialogTitle id="responsive-dialog-title">Add service information</DialogTitle>
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
            id="description"
            label="Description"
            type="text"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
          />

          <TextField
            id="url"
            label="Url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            fullWidth
          />

          <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
              <FormControlLabel
                value="end"
                control={<Switch
                  checked={available}
                  onChange={(e)=> setAvailable(e.target.checked)}
                  name="available"
                  inputProps={{ 'aria-label': 'available checkbox' }}
                />}
                label="Service available"
                labelPlacement="end"
              />
            </FormGroup>
          </FormControl>

          <Paper elevation={2}>

            <Typography variant={'body1'}>Service consumes credentials</Typography>
            <Typography variant={'caption'} color='textSecondary'>Available</Typography>
            <Paper component="ul" className={classes.root} elevation={0}>
              {chipData.map((data) => {
                let icon;
                return (
                  <li key={data.key}>
                    <Chip
                      icon={icon}
                      label={data.label}
                      onClick={handleSelect(data)}
                      className={classes.chip}
                    />
                  </li>
                );
              })}
            </Paper>

            <Typography variant={'caption'} color='textSecondary'>Selected</Typography>

            <Paper component="ul" className={classes.root} elevation={0}>
              {selectedChipData.map((data) => {
                let icon;
                return (
                  <li key={data.key}>
                    <Chip
                      icon={icon}
                      label={data.label}
                      onDelete={handleDelete(data)}
                      className={classes.chip}
                    />
                  </li>
                );
              })}
            </Paper>
          </Paper>

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