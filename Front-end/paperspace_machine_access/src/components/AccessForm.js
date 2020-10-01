import React, {useState} from 'react';


function AccessForm(props){

    const [name, setName] = useState("")

    const [email, setEmail] = useState("")


    function handleSubmit(event) {
        let url;
        if(props.access){
            url = process.env.REACT_APP_GIVE_ACCESS_URL;
        }else{
            url = process.env.REACT_APP_REVOKE_ACCESS_URL;
        }
        alert(url)
        alert(props.access)
        console.log(event);
        setEmail("");
        setName("");
    }

        return (
            <form onSubmit={handleSubmit}>
                <label>
                    Name:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} />
                </label>
                <label>
                    Email:
                    <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                </label>
                <input type="submit" value="Submit" />
            </form>
        );

}

export default AccessForm;