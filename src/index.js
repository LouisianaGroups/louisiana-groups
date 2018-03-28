import React from "react";
import { render } from "react-dom";
import App from "./App";
import groups from "./data/groups.json";
import registerServiceWorker from "./registerServiceWorker";

import "./styles";

render(<App groups={groups} />, document.getElementById("root"));

registerServiceWorker();
