import React from "react";
import { render } from "react-dom";
import ReactGA from "react-ga";
import App from "./App";
import groups from "./data/groups.json";
import registerServiceWorker from "./registerServiceWorker";

import "./styles";

ReactGA.initialize("UA-116383596-1", { debug: true });
ReactGA.pageview("/");

render(<App groups={groups} />, document.getElementById("root"));

registerServiceWorker();
