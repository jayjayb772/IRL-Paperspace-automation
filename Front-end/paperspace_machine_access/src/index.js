import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/app/App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter, Route, Router, Switch} from 'react-router-dom';
import GiveAccess from "./pages/giveAccess/GiveAccess";
import RevokeAccess from "./pages/revokeAccess/RevokeAccess";
import Home from "./pages/home/Home";


ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
          <App/>
      </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
