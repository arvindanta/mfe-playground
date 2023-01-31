import React from "react";
// import { render } from "react-dom";
import { createRoot } from "react-dom/client";

import Kylo from "./Kylo";

const loadApp = (id, props) => {
  const container = document.getElementById(id);

  if (container) {
    const root = createRoot(container); // createRoot(container!) if you use TypeScript
    root.render(React.createElement(Kylo, { ...props }, null), root);
  }
};

export default loadApp;
