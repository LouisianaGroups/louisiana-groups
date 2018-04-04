import React from "react";
import { render } from "react-dom";
import ReactGA from "react-ga";
import ApolloClient from "apollo-client";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import "./styles";

const httpUri = "https://pelican.freighter.cloud/graphql";

const client = new ApolloClient({
  link: createHttpLink({ uri: httpUri }),
  cache: new InMemoryCache()
});

ReactGA.initialize("UA-116383596-1", { debug: true });
ReactGA.pageview("/");

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

registerServiceWorker();
