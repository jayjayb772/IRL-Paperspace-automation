import React, {useState} from 'react';
import axios from "axios";
import {NavLink} from "react-router-dom";

function VerifyPaperspaceForm(props){

    const [wcoId, setwcoId] = useState("")
    const [message, setMessage] = useState(()=>{return ""})
    let access = "Check if you are ready to use paperspace"

    const submit = function(event) {
        event.preventDefault()
        console.log("Starting update patch")
        let url = `${process.env.REACT_APP_API_URL}/database/users/${wcoId}/verify`
        console.log(url)


        axios.get(`${url}`).then(res=>{
            console.log(event);
            console.log(res)
            setwcoId(()=>"");
            setMessage(res.data.message)
        }).catch(err=>{
            setMessage(`${err.response.data.message}\n${err.response.data.details}`)
            console.log(err.response.data)
            setwcoId(()=>"");
        })

    }
    if(message === ""){
        return (
            <form onSubmit={submit} className="formClass">
                <div>{access}</div>
                <label>
                    Webcheckout Id:
                    <input type="text" value={wcoId} onChange={e => setwcoId(e.target.value)} className="input"/>
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        );
    }else{
        return (
            <div>
                {message}
                <br/>
                <NavLink to="/">Return Home</NavLink>
            </div>
        )
    }


}
export default VerifyPaperspaceForm;