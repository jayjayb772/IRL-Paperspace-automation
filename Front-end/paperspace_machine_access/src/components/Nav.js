import React from "react";
import {NavLink} from "react-router-dom";
import './Nav.css'

function Nav(props){

    if(props.user === "guest"){
        if(props.verified){
            return (
                <div className="mainDiv">
                    <div className="Title" >Paperspace verify account</div>
                    <br/>
                    <NavLink to="/SetPaperspace" className="navLink">Set Paperspace Email</NavLink>
                    <NavLink to="/VerifyPaperspace" className="navLink">Verify Paperspace account</NavLink>
                </div>
            )
        }else{
            return (
                <div>
                    Please Log in
                </div>
            )
        }

    }

    return (
        <div className="mainDiv">
            <div className="Title" >Paperspace Give Access</div>
            <br/>
            <NavLink to="/GiveAccess" className="navLink">Give Access</NavLink>
            <NavLink to="/RevokeAccess" className="navLink">Revoke Access</NavLink>
            <NavLink to="/" style={{display: `${props.logout ? "inline" : "none"}`}} onClick={()=>{props.logout(); window.location.reload(false);}}>Logout</NavLink>
        </div>
    )
}

export default Nav;