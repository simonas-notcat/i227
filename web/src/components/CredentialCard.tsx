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

import { formatDistanceToNow } from 'date-fns'
import { Claim } from '../types'

interface Props {
  claim: Claim
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
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 100,
    height: 100,

  },
}));

function CredentialCard(props: Props) {
  const classes = useStyles();
  const { claim } = props
  return (
    <Card elevation={3}>
      <CardActionArea>
        <CardHeader
          avatar={
            <Avatar src={claim.issuer.profileImage} />
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={`${claim.issuer.name}`}
          subheader={formatDistanceToNow(Date.parse(claim.issuanceDate)) + ' ago'}
        />
        <div className={classes.root}>
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography gutterBottom variant="h5" component="h2">
                {claim.value}
              </Typography>
              <Typography component="p">{claim.subject.name}</Typography>
            </CardContent>
            
          </div>
          <Avatar
            variant="rounded" 
            className={classes.cover}
            // component="img"
            src={claim.subject.profileImage}
          />
        </div>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Sign
        </Button>
        <Button size="small" color="primary">
          Share
        </Button>
      </CardActions>
    </Card>
  );
}

export default CredentialCard;