import React from "react";
import { Typography, CardContent, Box } from "@material-ui/core";
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import { makeStyles } from '@material-ui/core/styles';
import RepeatIcon from '@material-ui/icons/Repeat';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Credential } from '../types'
import { useQuery } from '@apollo/react-hooks';
import { getCredentialDetails, CredentialDetailsData, CredentialVariables } from '../queries/credential'
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import Avatar from '@material-ui/core/Avatar';


interface Props {
  credential: Credential
}

const useStyles = makeStyles((theme) => ({
  icon: {
    height: 12,
    width: 12,
    marginRight: theme.spacing(1)
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
}));

function CredentialDetails(props: Props) {
  const classes = useStyles();
  const { credential } = props

  const { loading, error, data } = useQuery<CredentialDetailsData, CredentialVariables>(getCredentialDetails, { 
    variables: { id: credential.id },
    fetchPolicy: 'cache-and-network'
  });


  return (
    <CardContent>
      {loading && <LinearProgress />}

        {/* <Typography paragraph> {data?.likesCount}</Typography> */}
        <Box className={classes.row}>
          <ThumbUpIcon className={classes.icon} />
          <Typography variant='caption' color='textSecondary' gutterBottom>Liked</Typography>
        </Box>
        <AvatarGroup max={10}>
          {data?.likes.map(claim => (
            <Avatar key={claim.issuer.did} alt={claim.issuer.name} src={claim.issuer.picture} />
            ))}        
        </AvatarGroup>

        {/* <Typography variant={'subtitle1'}> {data?.dislikesCount}</Typography> */}
        <Box className={classes.row}>
          <ThumbDownIcon className={classes.icon} />
          <Typography variant='caption' color='textSecondary' gutterBottom>Disliked</Typography>
        </Box>
        <AvatarGroup max={10}>
          {data?.dislikes.map(claim => (
            <Avatar key={claim.issuer.did} alt={claim.issuer.name} src={claim.issuer.picture} />
            ))}        
        </AvatarGroup>
      {/* <Typography paragraph><RepeatIcon /> 40</Typography> */}
      
    </CardContent>
  );
}

export default CredentialDetails;