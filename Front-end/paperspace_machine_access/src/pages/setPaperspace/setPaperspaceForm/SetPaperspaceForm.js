import React, {useState} from 'react';
import './SetPaperspaceForm.css';
import axios from "axios";
import {NavLink} from "react-router-dom";

function SetPaperspaceForm(props){

    const [wcoId, setwcoId] = useState("")
    const [message, setMessage]= useState(()=>{return []})
    const [email, setEmail] = useState("")
    let access = "Set your paperspace email"

    const submit = function(event) {
        event.preventDefault()
        console.log("Starting update patch")
        let url = `${process.env.REACT_APP_API_URL}/database/users/${wcoId}`
        console.log(url)

        const body={
            paperspace_email_address: email
        };
        axios.patch(`${url}`,body).then(res=>{
            console.log(event);
            console.log(res)
            setEmail(()=>"");
            setwcoId(()=>"");
            setMessage(message=>[...message,res.data])
        }).catch(err=>{
            setMessage(message=>[...message,`${err.response.data.message} \n${err.response.data.details}`])
            console.log(err.response.data)
            setEmail(()=>"");
            setwcoId(()=>"");
        })

        url = `${process.env.REACT_APP_API_URL}/database/users/${wcoId}/verify`

        axios.get(`${url}`).then(res=>{
            console.log(event);
            console.log(res)
            setwcoId(()=>"");
            setMessage(message=>[...message,res.data.message])
        }).catch(err=>{
            setMessage(message=>[...message,(`${err.response.data.message}\n${err.response.data.details}`)])
            console.log(err.response.data)
            setwcoId(()=>"");
        })

    }
if(message.length === 0){
    return (
        <form onSubmit={submit} className="formClass">
            <div>{access}</div>
            <label>
                Webcheckout Id:
                <input type="text" value={wcoId} onChange={e => setwcoId(e.target.value)} className="input"/>
            </label>
            <br/>
            <label>
                Paperspace email:
                <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="input"/>
            </label>
            <br/>
            <input type="submit" value="Submit" />
        </form>
    );

}else{
    return (
        <div>
            {message.map(msg =>{
                return(
                    <div key={msg}>
                        {msg}
                    </div>
                )
            })}
            <br/>
            <NavLink to="/">Return Home</NavLink>
        </div>
    )
}
}
export default SetPaperspaceForm;