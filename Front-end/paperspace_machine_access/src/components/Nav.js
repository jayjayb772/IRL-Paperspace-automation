import React from "react";
import {NavLink} from "react-router-dom";
import './Nav.css'

function Nav(props){
    return (
        <div className="mainDiv">
            <div className="Title" >Paperspace Give Access</div>
            <br/>
            <NavLink to="/giveAccess">Give Access</NavLink>
            <br/>
            <NavLink to="/revokeAccess" >Revoke Access</NavLink>
        </div>
    )
}

export default Nav;