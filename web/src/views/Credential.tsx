import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { useParams } from "react-router-dom";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getCredential, CredentialData, CredentialVariables } from '../queries/credential'
import CredentialFAB from "../components/CredentialFAB";
import CredentialCard from "../components/CredentialCard";

function Credential(props: any) {
  const { id } = useParams<{ id: string }>()

  const { loading, error, data } = useQuery<CredentialData, CredentialVariables>(getCredential, { 
    variables: { id },
    fetchPolicy: 'cache-and-network'
  });

  if (error) return <p>Error :(</p>;

  const credential = data?.credentials[0]

  return (
    <Container maxWidth="sm">
      {loading && <LinearProgress />}
      {credential !== undefined && <CredentialCard credential={credential} />}
      <CredentialFAB subject={credential?.subject.did} />
    </Container>
  );
}

export default Credential;