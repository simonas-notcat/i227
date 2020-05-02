import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { ApolloProvider } from '@apollo/react-hooks';
import { Auth0Provider } from "./react-auth0-spa";
import config from "./auth_config.json";
import history from "./utils/history";

import App from './App';
import theme from './theme';

import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://i227.dev/graphql',
});


const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      audience={config.audience}
      redirect_uri={window.location.origin}
      //@ts-ignore
      onRedirectCallback={onRedirectCallback}
    >

    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
