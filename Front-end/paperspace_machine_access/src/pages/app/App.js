import React from 'react';
import './App.css';
import { ThemeProvider, CSSReset, theme, Link, Text } from '@chakra-ui/core'
import GiveAccess from "../giveAccess/GiveAccess";
import RevokeAccess from "../revokeAccess/RevokeAccess";
import Home from "../home/Home";
import Nav from "../../components/Nav";
import {BrowserRouter, Route, Router, Switch} from "react-router-dom";
function App(){
        return (
            <div className="center">
                <Nav/>
                <br/>
                <div>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/giveAccess" component={GiveAccess}/>
                    <Route exact path="/revokeAccess" component={RevokeAccess}/>
                </Switch>
                </div>

            </div>
        )
}
export default App;
