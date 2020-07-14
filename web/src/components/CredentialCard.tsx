import React, { useState, useEffect } from "react";
import { Typography, CardHeader, CardContent, Tooltip, Snackbar, CardMedia, Grid, LinearProgress } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import CardActions from "@material-ui/core/CardActions";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ThumbDownIcon from '@material-ui/icons/ThumbDownAlt';
import ThumbUpIcon from '@material-ui/icons/ThumbUpAlt';
import { makeStyles } from '@material-ui/core/styles';
import ShareIcon from '@material-ui/icons/Share';
import { useAuth0 } from "../react-auth0-spa";
import Alert from '@material-ui/lab/Alert';
import { formatDistanceToNow } from 'date-fns'
import { VerifiableCredential } from "daf-core";
import { IdentityProfile } from "../types";
import { useAgent } from '../agent'
import shortId from 'shortid'
import CredentialReactionCard from "./CredentialReactionCard";
import PostCredential from "./CredentialCardContent/PostCredential";
import ProfileCredential from "./CredentialCardContent/ProfileCredential";

interface Props {
  credential: VerifiableCredential
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
  const { agent, authenticatedDid } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ issuer, setIssuer ] = useState<IdentityProfile>({ did: credential.issuer.id })
  const [ subject, setSubject ] = useState<IdentityProfile|undefined>(undefined)
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  useEffect(() => {
    setLoading(true)
    Promise.all([
      agent.getIdentityProfile({did: credential.issuer.id}),
      agent.getIdentityProfile({did: credential.credentialSubject.id})
    ])
    .then(result => {
      setIssuer(result[0])
      setSubject(result[1])
    })
    .finally(() => setLoading(false))
  }, [agent])

  if (loading) {
    return (<LinearProgress />)
  }


  if (credential.type.includes('Reaction')) {
    return (<CredentialReactionCard  {...props} issuer={issuer} subject={subject} /> )
  }



  const handleShare = async () => {
    const url = '' + credential.id
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

      const credentialSubject = {
        id: credential.credentialSubject.id,
      }
      //@ts-ignore
      credentialSubject[reaction]=credential.id

      if (!authenticatedDid) throw Error('Not authenticated')

      const verifiableCredential = await agent.createVerifiableCredential({
        credential: {
          issuer: { id: authenticatedDid },
          '@context': ['https://www.w3.org/2018/credentials/v1'],
          type: ['VerifiableCredential', 'Reaction'],
          issuanceDate: new Date().toISOString(),
          id: process.env.REACT_APP_HOST + '/c/' + shortId.generate(),
          credentialSubject,
        },
        save: true,
        proofFormat: 'jwt',
      })

      setOpenSnackbar(true)
      
    } catch (error) {
      console.error(error);
    }
  };

  let contents
  if (credential.type.includes('Post')) {
    contents = (<PostCredential  {...props} issuer={issuer} subject={subject} /> )
  } else if (credential.type.includes('Profile')) {
    contents = (<ProfileCredential  {...props} issuer={issuer} subject={subject} /> )
  } 
  

  return (
    <Card elevation={2}>
      <CardActionAreaLink to={'/identity/' + issuer.did}>
        <CardHeader
          avatar={
            <Avatar src={issuer.picture} />
          }

          title={`${issuer.name}`}
          subheader={`${issuer.nickname} | ${formatDistanceToNow(Date.parse(credential.issuanceDate))} ago`}
        />
      </CardActionAreaLink>
      <CardActionAreaLink to={ props.type === 'summary' ? `${credential.id}`.replace(`${process.env.REACT_APP_HOST}`, '') : '/identity/' + subject?.did}>
        {contents}
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