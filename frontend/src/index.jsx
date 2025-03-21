import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { CollectionProvider } from "./context/CollectionContext"; // Adjust the relative path if needed

ReactDOM.render(
  <CollectionProvider>
    <App />
  </CollectionProvider>,
  document.getElementById("root")
);
