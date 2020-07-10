import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Auth0Provider } from "./react-auth0-spa";
import history from "./utils/history";
import { BrowserRouter } from 'react-router-dom' 
import App from './App';
import theme from './theme';
import MobileProvider from './components/Nav/MobileProvider';
import AgentProvider from './agent';

const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        client_id={process.env.REACT_APP_AUTH0_CLIENT_ID}
        audience={process.env.REACT_APP_AUTH0_AUDIENCE}
        redirect_uri={window.location.origin}
        cacheLocation={'localstorage'}
        //@ts-ignore
        onRedirectCallback={onRedirectCallback}
        >
        <AgentProvider>
          <MobileProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </MobileProvider>
        </AgentProvider>
      </Auth0Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
