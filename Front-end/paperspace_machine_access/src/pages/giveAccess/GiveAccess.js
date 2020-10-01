import React from 'react';
import './GiveAccess.css';
import AccessForm from "../../components/AccessForm";

function GiveAccess(props){

    return(
        <AccessForm access={true} />
    )
}
export default GiveAccess;
