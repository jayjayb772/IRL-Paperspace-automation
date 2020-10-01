import React from 'react';
import './RevokeAccess.css';
import AccessForm from "../../components/AccessForm";
function RevokeAccess(props){
    return(
        <AccessForm access={false}/>
    )
}
export default RevokeAccess;
