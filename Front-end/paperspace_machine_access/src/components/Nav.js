import React from "react";
import {NavLink} from "react-router-dom";
import './Nav.css'

function Nav(props){
    return (
        <div className="mainDiv">
            <div className="Title" >Paperspace Give Access</div>
            <br/>
            <NavLink to="/GiveAccess" className="navLink">Give Access</NavLink>
            <NavLink to="/RevokeAccess" className="navLink">Revoke Access</NavLink>
            <button  style={{display: `${props.logout ? "inline" : "none"}`}} onClick={props.logout}>Logout</button>
        </div>
    )
}

export default Nav;