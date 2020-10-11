import React from 'react';
import './SetPaperspacePage.css';
import SetPaperspaceForm from "./setPaperspaceForm/SetPaperspaceForm";

function SetPaperspacePage(props){
    return(
        <SetPaperspaceForm access={false}/>
    )
}
export default SetPaperspacePage;