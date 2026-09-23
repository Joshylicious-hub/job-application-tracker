import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function LoginPage() {

const [ email, setEmail ] = useState("");
const [ password, setPassword ] = useState("");
const navigate = useNavigate();

const Login = async (e) => {

    e.preventDefault();

    try {

        const response = await fetch('http://localhost:3000/api/user/login', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        const data = await response.json();

        if(!response.ok) {
            console.error(data.message);
            return;
        }

        if(data.hasProfile === false) {
            navigate('/user');
            return;
        }

        console.log(data.message);
        navigate('/home');

    }catch(err) {
        console.error(err.message);
    }
}

    return (
        <>

        <form onSubmit={Login}>
            <label>Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign in</button>
        </form>

        <p>Don't have an account yet?</p>
        <Link to="/register">Register</Link>
        
        </>
    )
}

export default LoginPage;