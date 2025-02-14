import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
import { Provider } from "react-redux";
import { UserProvider } from "./hooks/authHooks";
import store from "./store/storeIndex";
import BrowserIssue from "./components/layout/BrowserIssue";
import App from "./App";
import { Amplify } from "aws-amplify";
import "aws-amplify/auth/enable-oauth-listener";
import config from "./config";
import { asyncWithLDProvider } from "launchdarkly-react-client-sdk";

// Internet Explorer
const isIE = /*@cc_on!@*/ false || !!document.documentMode;

// Edge
const isEdge = !isIE && !!window.StyleMedia;

Amplify.configure({
  Storage: {
    S3: {
      region: config.s3.REGION,
      bucket: config.s3.BUCKET,
    },
  },
  API: {
    REST: {
      "carts-api": {
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },
    },
  },
  Auth: {
    Cognito: {
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolClientId: config.cognito.APP_CLIENT_ID,
      loginWith: {
        oauth: {
          domain: config.cognito.APP_CLIENT_DOMAIN,
          redirectSignIn: [config.cognito.REDIRECT_SIGNIN],
          redirectSignOut: [config.cognito.REDIRECT_SIGNOUT],
          scopes: ["email", "openid", "profile"],
          responseType: "code",
        },
      },
    },
  },
});

// LaunchDarkly configuration
const ldClientId = config.REACT_APP_LD_SDK_CLIENT;
(async () => {
  const LDProvider = await asyncWithLDProvider({
    clientSideID: ldClientId,
    options: {
      baseUrl: "https://clientsdk.launchdarkly.us",
      streamUrl: "https://clientstream.launchdarkly.us",
      eventsUrl: "https://events.launchdarkly.us",
    },
    deferInitialization: false,
  });

  ReactDOM.render(
    <React.StrictMode>
      <Router>
        <Provider store={store}>
          <UserProvider>
            <LDProvider>
              {isIE || isEdge ? <BrowserIssue /> : <App />}
            </LDProvider>
          </UserProvider>
        </Provider>
      </Router>
    </React.StrictMode>,
    document.getElementById("root")
  );
})().catch((e) => {
  throw e;
});

/*
 * If you want your app to work offline and load faster, you can change
 * unregister() to register() below. Note this comes with some pitfalls.
 * Learn more about service workers: https://bit.ly/CRA-PWA
 */
serviceWorker.unregister();
