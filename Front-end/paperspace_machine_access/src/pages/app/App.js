import React, {useState} from 'react';
import './App.css';
import GiveAccess from "../giveAccess/GiveAccess";
import RevokeAccess from "../revokeAccess/RevokeAccess";
import Home from "../home/Home";
import Nav from "../../components/Nav";
import {BrowserRouter, Route, Router, Switch} from "react-router-dom";
import axios from "axios";
function App(){
    const [auth,setAuth] = useState(false)
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [revealPass, setRevealPass] = useState(false)

    const showpass = function(event){
        event.preventDefault();
        setRevealPass(revealPass ? false : true)
    }

    const handleClick = function(event){
        event.preventDefault()
        console.log("handle click")

        const body={
            name: name,
            password: password
        };

        let url = process.env.REACT_APP_LOGIN_URL;
        axios.post(`${url}`,body).then(res=>{
            setPassword(()=>"");
            setName(()=>"");
            alert("Logged in")
            setAuth(true);
        }).catch(err=>{
            alert(`Could not log in`)
            setPassword(()=>"");
            setName(()=>"");
        })

    }

    if(auth === true) {
        console.log(auth)
        return (
            <div className="center">
                <Nav/>
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
            <Nav/>
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
