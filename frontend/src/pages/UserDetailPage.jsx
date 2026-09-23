import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDetailPage() {

const [ firstName, setFirstName ] = useState("");
const [ lastName, setLastName ] = useState("");
const [ age, setAge ] = useState('');
const [ education, setEducation] = useState('');
const [ city, setCity ] = useState('');
const [ number, setNumber ] = useState('');
const navigate = useNavigate();

const sendUser = async (e) => {

    e.preventDefault();

    try {

        const response = await fetch('http://localhost:3000/api/user/profile', {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                age: age,
                education: education,
                location: city,
                number: number
            })
        })

        const data = await response.json();

        if(!response.ok) {
            console.error(data.message);
            return;
        }

        console.log(data.message);
        navigate('/home');

    }catch(err) {
        console.error(err);
    }
}

    return (
        <>
            <form onSubmit={sendUser}>
                <label>First Name</label>
                <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
                <label>Last Name</label>
                <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
                <label>Age</label>
                <input
                type="text"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                />
                <label>Education</label>
                <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                />
                <label>City</label>
                <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                />
                <label>Number</label>
                <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                />
                <button type="submit">Register</button>
            </form>
        </>
    )
}

export default UserDetailPage;