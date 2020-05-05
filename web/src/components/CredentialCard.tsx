import React from "react";
import { Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from '@material-ui/core/CardHeader';
import Button from "@material-ui/core/Button";
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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
    width: 100,
    height: 100,
    marginTop: theme.spacing(2)
  },
  smallAvatar: {
    width: 28,
    height: 28,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

function CredentialCard(props: Props) {
  const classes = useStyles();
  const { credential } = props
  return (
    <Card elevation={3}>
      <CardActionArea>
        <div className={classes.root}>
          <div className={classes.details}>
            {credential.claims.map(claim => (<CardContent className={classes.content}>
              {/* <Typography gutterBottom variant="h6" component="h2">
                {claim.type}
              </Typography> */}
              <Typography gutterBottom variant="h5" component="h2">
                {claim.value}
              </Typography>
              <Typography component="p">{credential.subject.name}</Typography>
            </CardContent>))}
            
            
          </div>
          <Avatar
            variant="rounded" 
            className={classes.cover}
            // component="img"
            src={credential.subject.picture}
          />
        </div>
      </CardActionArea>
      <CardActions className={classes.actions} >
        <div className={classes.row}>
          <Avatar
            variant="rounded" 
            src={credential.issuer.picture}
            className={classes.smallAvatar}
            />
          <Typography variant="caption">{credential.issuer.nickname} | {formatDistanceToNow(Date.parse(credential.issuanceDate))} ago</Typography>
        </div>
        <div>
        <IconButton aria-label="add to favorites">
          <ExposurePlus1Icon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        </div>
      </CardActions>
    </Card>
  );
}

export default CredentialCard;