import React, { useContext, useState, useEffect } from "react";
import { createAgent, TAgent, IDataStore } from 'daf-core'
import { IW3c } from 'daf-w3c'
import { IDataStoreORM } from 'daf-typeorm'
import { AgentRestClient, IAgentRESTMethod } from 'daf-rest'
import { useAuth0 } from "./react-auth0-spa";

const url = `${process.env.REACT_APP_HOST}/agent`
const enabledMethods = [
  'getAuthenticatedDid',
  'createVerifiableCredential',
  'createVerifiablePresentation',
  'dataStoreORMGetVerifiablePresentations',
  'dataStoreORMGetVerifiableCredentials'
]
const overrides: Record<string,IAgentRESTMethod> = {
  getAuthenticatedDid: { type: 'POST', path: '/getAuthenticatedDid'}
}

type Agent = TAgent<IDataStore & IDataStoreORM & IW3c> & {
  getAuthenticatedDid(): Promise<string>
}

interface Context {
  agent: Agent,
  authenticatedDid?: string | null
}

const defaultAgent = createAgent<Agent>({
  plugins: [ new AgentRestClient({ url, enabledMethods, overrides })],
})

export const AgentContext = React.createContext<Context>({agent: defaultAgent, authenticatedDid: null});
export const useAgent = () => useContext(AgentContext);

const AgentProvider: React.FC = ({children}) => {

  const [authenticatedDid, setAuthenticatedDid] = useState<string|null>(null)
  const [agent, setAgent] = useState<Agent>(defaultAgent)
  const { getTokenSilently, isAuthenticated } = useAuth0()

  useEffect(() => {
    const createAuthenticatedAgent = async () => {
      const token = await getTokenSilently()
      const authenticatedAgent = createAgent<Agent>({
        plugins: [
          new AgentRestClient({
            url, 
            enabledMethods,
            overrides,
            headers: {
              'Authorization': 'Bearer ' + token
            },
          }),
        ],
      })
      const did = await authenticatedAgent.getAuthenticatedDid()
      setAuthenticatedDid(did)
      setAgent(authenticatedAgent)  

    }
    if (isAuthenticated) {
      createAuthenticatedAgent()
    }
  

  }, [isAuthenticated, getTokenSilently])

  return (<AgentContext.Provider value={{
    agent,
    authenticatedDid
  }}>
    {children}
  </AgentContext.Provider>)
}
export default AgentProvider

