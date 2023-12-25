import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./styles/icons/icons.css";
import "./styles/dark.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import { createStore } from "redux";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";

// Creating a Redux Store
const store = createStore(rootReducer, composeWithDevTools());
// Renders the React application into the HTML document
ReactDOM.render(
  // This provides the Redux store to all components of the application, allowing them to access the application's state
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById("root")
);
