import React from "react";
import { Typography, CardContent, Grid } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import { VerifiableCredential } from "daf-core";
import { IdentityProfile } from "../../types";

interface Props {
  credential: VerifiableCredential
  issuer: IdentityProfile
  subject?: IdentityProfile
  type: 'summary' | 'details'
}

function PostCredential(props: Props) {
  const { credential, issuer, subject } = props
  
  return (
    <CardContent>
      {credential.credentialSubject.comment && 
        <Typography variant='body1' color='textPrimary'>{credential.credentialSubject.comment}</Typography>}
        
    </CardContent>    
  );
}

export default PostCredential;