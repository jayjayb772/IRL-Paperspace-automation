import React from 'react';
import './VerifyPaperspacePage.css';
import VerifyPaperspaceForm from "./VerifyForm/VerifyPaperspaceForm";

function VerifyPaperspacePage(props){
    return(
        <VerifyPaperspaceForm access={false}/>
    )
}
export default VerifyPaperspacePage;