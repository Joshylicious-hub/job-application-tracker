import { useState } from 'react';
import { Link } from 'react-router-dom';

function RegisterPage() {

const [ email, setEmail ] = useState('');
const [ confirmEmail, setConfirmEmail ] = useState('');
const [ password, setPassword ] = useState('');
const [ confirmPassword, setConfirmPassword ] = useState('');

const Register = async (e) => {

    e.preventDefault();

    try {
        const response = await fetch('http://localhost:3000/api/user/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                confirmEmail: confirmEmail,
                password: password,
                confirmPassword: confirmPassword
            })
        })

        const data = await response.json();

        if(!response.ok) {
            console.error(data.message);
            return;
        }

        console.log(data.message);

    }catch(err) {
        console.error(err.message);
    }
}

    return (
        <>
        <form onSubmit={Register}>
            <label>Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            />
            <label>Confirm Email</label>
            <input
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            />
            <label>Password</label>
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            <label>Confirm Password</label>
            <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button type="submit">Sign Up</button>
        </form>
        <p>Already have an account?</p>
        <Link to="/login">Log in</Link>
        </>
    );
}

export default RegisterPage;