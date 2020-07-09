import React from "react";
import { Typography, CardHeader, CardContent, Tooltip, Grid, Snackbar } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import CardActions from "@material-ui/core/CardActions";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ShareIcon from '@material-ui/icons/Share';
import { useAuth0 } from "../react-auth0-spa";
import Alert from '@material-ui/lab/Alert';

import { formatDistanceToNow } from 'date-fns'
import { Credential } from '../types'

interface Props {
  credential: Credential
  type: 'summary' | 'details'
}

function CredentialProfileCard(props: Props) {
  const { credential } = props
  const { getTokenWithPopup, getTokenSilently, isAuthenticated } = useAuth0()
  const [openShareTooltip, setOpenShareTooltip] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleShare = async () => {
    const url = process.env.REACT_APP_HOST + '/c/'+credential.id
    try {
      //@ts-ignore
      await navigator.share({ title: "Credential", url });
    } catch (e) {
      navigator.clipboard.writeText(url)
      setOpenShareTooltip(true)
      setTimeout(()=> setOpenShareTooltip(false), 2000)

    }
  }

  const handleReaction = async (reaction: string) => {
    try {
      const token = isAuthenticated ? await getTokenSilently() : await getTokenWithPopup();

      const data = {
        type: 'Reaction',
        credentialSubject: {
          id: credential.subject.did,
        }
      }
      //@ts-ignore
      data.credentialSubject[reaction]=credential.id

      await fetch(`${process.env.REACT_APP_HOST}/sign`, {
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
      setOpenSnackbar(true)


    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card elevation={2}>
      <CardActionAreaLink to={'/identity/' + credential.issuer.did}>
        <CardHeader
          avatar={
            <Avatar src={credential.issuer.picture} />
          }

          title={`${credential.issuer.name}`}
          subheader={`${credential.issuer.nickname} | ${formatDistanceToNow(Date.parse(credential.issuanceDate))} ago`}
        />
      </CardActionAreaLink>
      <CardActionAreaLink to={'/identity/' + credential.subject.did}>
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
          {credential.issuer.name} updated profile for {credential.subject.name}
          </Typography>

          <Grid container spacing={1}>
            {credential.claims.map(claim => (
              <Grid item key={claim.type} xs={12} sm={6}>
                <Typography variant='caption' color='textSecondary'>{claim.type}</Typography>
                {claim.type !== 'picture' && <Typography variant='body2'>{claim.value}</Typography>}
                {claim.type === 'picture' && <Avatar src={claim.value}/>}
              </Grid>
            ))}
          </Grid>

        </CardContent>    
      </CardActionAreaLink>
      <CardActions  disableSpacing>
        <IconButton aria-label="like" onClick={() => handleReaction('like')}>
          <ThumbUpIcon />
        </IconButton>
        <IconButton aria-label="dislike"  onClick={() => handleReaction('dislike')}>
          <ThumbDownIcon />
        </IconButton>
        {/* <IconButton aria-label="repost">
          <RepeatIcon />
        </IconButton> */}
        <Tooltip open={openShareTooltip} title="Link copied">
          <IconButton aria-label="share" onClick={handleShare}>
            <ShareIcon />
          </IconButton>
        </Tooltip>
        
      </CardActions>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={()=>setOpenSnackbar(false)}>
        <Alert onClose={()=>setOpenSnackbar(false)} severity="success" elevation={6} variant="filled" >
          Success!
        </Alert>
      </Snackbar>

    </Card>
  );
}

export default CredentialProfileCard;