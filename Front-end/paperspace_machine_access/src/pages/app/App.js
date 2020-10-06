import React, {useState} from 'react';
import './App.css';
import GiveAccess from "../giveAccess/GiveAccess";
import RevokeAccess from "../revokeAccess/RevokeAccess";
import Home from "../home/Home";
import Nav from "../../components/Nav";
import {BrowserRouter, Route, Router, Switch} from "react-router-dom";
import axios from "axios";

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
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [revealPass, setRevealPass] = useState(false)
    const storedJwt = localStorage.getItem('token');
    const [jwt, setJwt] = useState(storedJwt || null);


    const showpass = function(event){
        event.preventDefault();
        setRevealPass(revealPass ? false : true)
    }
    const logout = function(event){
        event.preventDefault()
        localStorage.removeItem('token')
        setJwt(null);
    }


    const handleClick = async (event) => {
        event.preventDefault()
        console.log("handle click")

        const body={
            name: name,
            password: password
        };

        let url = process.env.REACT_APP_LOGIN_URL;
        const { data } = await axios.post(`${url}`, body).catch(err=>{
            alert(`Could not log in`)
            setPassword(()=>"");
            setName(()=>"");
        });
        setPassword(()=>"");
        setName(()=>"");
        localStorage.setItem('token', data.token);
        setJwt(data.token);
    };


    if(jwt !== null) {
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
    }else{
        return (
        <div className="center">
            <Nav logout={false}/>
            <div className="login" >
                <form onSubmit={handleClick}>
                    <label>
                        Username:
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="input"/>
                    </label>
                    <label>
                        Password:
                        <input type={revealPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="input"/>
                    </label>
                    <button onClick={showpass} className="showPass">Show password</button>
                    <br/>
                    <button type="submit">
                        Login
                    </button>
                </form>

            </div>

        </div>
        )
    }
}
export default App;
