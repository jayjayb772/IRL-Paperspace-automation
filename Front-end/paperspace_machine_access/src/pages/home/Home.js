import React, {useState} from "react";
import Nav from "../../components/Nav";
import axios from "axios";
import './Home.css';
import md5 from "md5";

const apiUrl = process.env.REACT_APP_API_URL

function Home(props) {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [revealPass, setRevealPass] = useState(false)
    const [revealLogin, setRevealLogin] = useState(false)

    const showPass = function(event){
        event.preventDefault();
        setRevealPass(revealPass ? false : true)
    }

    const showLogin = function(event){
        event.preventDefault();
        setRevealLogin(revealLogin ? false : true)
    }

    const handleClick = async (event) => {
        event.preventDefault()
        console.log("handle click")
        const { data } = await axios.post(
            `${apiUrl}/login`,
            {name: name, password: md5(password)})
            .catch(err=>{
                alert(`Could not log in`)
                setPassword(()=>"");
                setName(()=>"");
            });
        setPassword(()=>"");
        setName(()=>"");
        localStorage.setItem('token', data.token);
        props.setJwtP(data.token);
        props.setUser("IRL")
    };

    const handleClickGuest = async (event) => {
        event.preventDefault()
        console.log("handle click")
        const { data } = await axios.get(
            `${apiUrl}/login`)
            .catch(err=>{
                alert(`Could not log in`)
                setPassword(()=>"");
                setName(()=>"");
            });
        setPassword(()=>"");
        setName(()=>"");
        localStorage.setItem('token', data.token);
        props.setJwtP(data.token);
        props.setUser("guest")
    };

    if(props.user === "guest"){
        if(props.verified){
            return (
                <div>
                    Logged in as guest
                </div>
            )
        }else{
        return (
            <div>
            <div className="hideLogin" onClick={showLogin}>
                Login as IRL Staff
            </div>
                <div className="guestLogin" onClick={handleClickGuest}>
                    Guest Login
                </div>
        <div className="login" style={{display:(revealLogin ? "" : "none")}}>
            <form onSubmit={handleClick}>
                <label>
                    Username:
                    <input type="text" value={name} onChange={e => setName(e.target.value)} className="input"/>
                </label>
                <label>
                    Password:
                    <input type={revealPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="input"/>
                </label>
                <div onMouseEnter={showPass} onMouseLeave={showPass} className="showPass">Show password</div>
                <br/>
                <button type="submit">
                    Login
                </button>
            </form>

        </div>
            </div>
    )}}else{
        return(
            <div>
                HOME
            </div>
        )
    }

}

export default Home