import React, { useEffect, useState } from "react";
import { Grid } from "@material-ui/core";
import Container from '@material-ui/core/Container';
import LinearProgress from '@material-ui/core/LinearProgress';
import CredentialCard from '../components/CredentialCard'
import CredentialFAB from "../components/CredentialFAB";
import AppBar from "../components/Nav/AppBar";
import { useAgent } from '../agent'
import { VerifiableCredential } from 'daf-core'

function Home(props: any) {
  const { agent } = useAgent()
  const [ loading, setLoading ] = useState(false)
  const [ credentials, setCredentials ] = useState<Array<VerifiableCredential>>([])

  useEffect(() => {
    setLoading(true)
    agent.dataStoreORMGetVerifiableCredentials({
      order: [
        { column: 'issuanceDate', direction: 'DESC' }
      ]
    })
    .then(setCredentials)
    .finally(() => setLoading(false))
  }, [agent])
  
  return (
    <Container maxWidth="sm">
      <AppBar title='Activity'>

      </AppBar>
      {loading && <LinearProgress />}
      <Grid container spacing={2} justify="center">
        {credentials.map(credential => (
          <Grid item key={credential.id} xs={12}>
            <CredentialCard credential={credential} type={'summary'}/>
          </Grid>
        ))}
      </Grid>
      <CredentialFAB />
    </Container>
  );
}

export default Home;