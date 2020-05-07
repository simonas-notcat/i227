import React from "react";
import { Typography, CardHeader, CardMedia } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionAreaLink from "./Nav/CardActionAreaLink";
import CardActions from "@material-ui/core/CardActions";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';
import ExposurePlus1Icon from '@material-ui/icons/ExposurePlus1';
import ShareIcon from '@material-ui/icons/Share';
import { formatDistanceToNow } from 'date-fns'
import { Credential } from '../types'

interface Props {
  credential: Credential
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
    backgroundColor: 'rgba(0,0,0,0.6)'
  }
}));

function CredentialCard(props: Props) {
  const classes = useStyles();
  const { credential } = props
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
      <CardActionAreaLink to={'/c/' + credential.id}>
        {credential.claims.map(claim => (
          <CardMedia 
            key={claim.hash}
            className={classes.claim}
            image={'/kudos1.png'}
            >
            <Avatar
              variant="circle" 
              className={classes.cover}
              src={credential.subject.picture}
            />
            <div className={classes.claimTextBox}>
              <Typography variant="h5">
                {claim.value}
              </Typography>
              <Typography variant="h6">{credential.subject.name}</Typography>
            </div>
          </CardMedia>
        ))}
            
            
      </CardActionAreaLink>
      <CardActions className={classes.actions} >
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="add to favorites">
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default CredentialCard;