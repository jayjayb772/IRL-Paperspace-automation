import React, {useEffect, useState} from 'react';
import './AccessForm.css';
import axios from 'axios';


function AccessForm(props){

    const [name, setName] = useState("")

    const [email, setEmail] = useState("")
    const [access, setAccess] = useState(()=>{
        if(props.access){
            return "Give Access to:"
        }else{
            return "Revoke Access from:"
        }
    })

    const submit = function(event) {
        event.preventDefault()
        let url;
        if(props.access){
            url = `${process.env.REACT_APP_API_URL}/access/give-access-from-email`
        }else{
            url = `${process.env.REACT_APP_API_URL}/access/revoke-access-from-email`
        }
        const body={
            name: name,
            email: email
        };
        axios.post(`${url}`,body).then(res=>{
            console.log(event);
            console.log(res)
            setEmail(()=>"");
            setName(()=>"");
            alert(res.data)
        }).catch(err=>{
            alert(`${err.response.data.message} \n${err.response.data.details}`)
            console.log(err.response.data)
            setEmail(()=>"");
            setName(()=>"");
        })

    }

        return (
            <form onSubmit={submit} className="formClass">
                <div>{access}</div>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="input"/>
                </label>
            <br/>
                <label>
                    Email:
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="input"/>
                </label>
                <br/>
                <input type="submit" value="Submit" />
            </form>
        );

}

export default AccessForm;