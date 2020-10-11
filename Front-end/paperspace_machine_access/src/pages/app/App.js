import React, {useState} from 'react';
import './App.css';
import GiveAccess from "../giveAccess/GiveAccess";
import RevokeAccess from "../revokeAccess/RevokeAccess";
import Home from "../home/Home";
import Nav from "../../components/Nav";
import {BrowserRouter, Route, Router, Switch} from "react-router-dom";
import axios from "axios";
import md5 from "md5";
import SetPaperspacePage from "../setPaperspace/SetPaperspacePage";
import VerifyPaperspacePage from "../Verify/VerifyPaperspacePage";


const apiUrl = process.env.REACT_APP_API_URL

axios.interceptors.request.use(
    config => {
        const { origin } = new URL(config.url);
        const allowedOrigins = [apiUrl];
        const token = localStorage.getItem('token');
        if (allowedOrigins.includes(origin)) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

function App(){

    const storedJwt = localStorage.getItem('token');
    const [jwt, setJwt] = useState(storedJwt || null);
    const [user, setUser] = useState(()=>{return "none"})
    const logout = function(event){
        localStorage.removeItem('token')
        setJwt(null);
        setUser("")
    }
    const setJwtPass = function(jwt){
        setJwt(jwt)
    }
    const setUserP = function(user){
        setUser(user)
    }



    if(user === "IRL") {
        return (
            <div className="center">
                <Nav logout={logout}/>
                <br/>
                <div>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route exact path="/GiveAccess" component={GiveAccess}/>
                        <Route exact path="/RevokeAccess" component={RevokeAccess}/>
                    </Switch>
                </div>

            </div>
        )
    }else if(user === "guest"){
       return(
           <div className="center">
               <Nav user={"guest"} verified={true}/>
               <Switch>
                   <Route exact path="/" component={()=>(<Home setJwtP={setJwtPass} user={"guest"} setUser={setUserP} verified={true}/>)}/>
                   <Route exact path="/SetPaperspace" component={SetPaperspacePage}/>
                   <Route exact path="/VerifyPaperspace" component={VerifyPaperspacePage}/>
               </Switch>

           </div>
       )
    }else{
        return (
        <div className="center">
            <Nav user={"guest"} verified={false}/>
            <Switch>
                <Route exact path="/" component={()=>(<Home setJwtP={setJwtPass} user={"guest"} setUser={setUserP}/>)}/>
                <Route exact path="/SetPaperspace" component={SetPaperspacePage}/>
                <Route exact path="/VerifyPaperspace" component={VerifyPaperspacePage}/>
            </Switch>

        </div>
        )
    }
}
export default App;
