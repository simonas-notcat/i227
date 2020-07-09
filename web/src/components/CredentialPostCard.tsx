import React from "react";
import { Typography, CardHeader, CardContent, Tooltip, Snackbar, CardMedia } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import CardActions from "@material-ui/core/CardActions";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ThumbDownIcon from '@material-ui/icons/ThumbDownAltOutlined';
import ThumbUpIcon from '@material-ui/icons/ThumbUpAltOutlined';
import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
import { useAuth0 } from "../react-auth0-spa";
import Alert from '@material-ui/lab/Alert';
import { formatDistanceToNow } from 'date-fns'
import { Credential } from '../types'

interface Props {
  credential: Credential
  type: 'summary' | 'details'
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingRight: theme.spacing(2)
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    color: theme.palette.text.secondary
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    [theme.breakpoints.down('sm')]: {
      width: 100,
      height: 100,
    },
    width: 150,
    height: 150,
    // marginTop: theme.spacing(2)
    alignSelf: 'center',
    margin: theme.spacing(2)
  },
  smallAvatar: {
    width: 28,
    height: 28,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    // justifyContent: 'space-between'
  },
  claim: {

    display: 'flex',
    flexDirection: 'column',
    // alignItems: 'center'
  },
  claimTextBox: {
    padding: theme.spacing(2),
    display: 'flex',
    flex: 1,
    // flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  gridList: {
    // width: 500,
    // height: 450,
  },
}));

function CredentialPostCard(props: Props) {
  const { credential } = props
  const classes = useStyles();
  const { getTokenWithPopup, getTokenSilently, isAuthenticated } = useAuth0()
  const [openShareTooltip, setOpenShareTooltip] = React.useState(false);

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

  const [openSnackbar, setOpenSnackbar] = React.useState(false);

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
      <CardActionAreaLink to={ props.type === 'summary' ? '/c/' + credential.id : '/identity/' + credential.subject.did}>
        {credential.claims.map(claim => (
          <CardMedia 
            key={claim.hash}
            className={classes.claim}
            image={'/'+claim.value+'.png'}
            >
            <Avatar
              variant="circle" 
              className={classes.cover}
              src={credential.subject.picture}
            />
          </CardMedia>
        ))}
        
            
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="p">
          {credential.issuer.name} gave <strong>{credential.claims[0].value}</strong> kudos to {credential.subject.name}
          </Typography>
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

export default CredentialPostCard;